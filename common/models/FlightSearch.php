<?php
/**
 * FlightSearch class
 * Class for making FlightSearch requesh with saving results into db
 * @author oleg
 *
 */
class FlightSearch extends CModel implements IStatisticItem
{
    const STATUS_SUCCESS = 1;
    const STATUS_ERROR = 2;

    public $id;
    public $timestamp;
    public $requestId = '1';
    public $status = 1;
    public $key;
    public $data = '{}';
    public $flight_class;
    /** @var FlightVoyageStack */
    public $flightVoyageStack;
    private $_routes;

    public function __construct()
    {
        $this->attachBehaviors($this->behaviors());
    }

    public function behaviors()
    {
        return array(
            'statisticable' => array(
                'class' => 'site.common.components.statistic.Statisticable',
            )
        );
    }

    /**
     * @param FlightSearchParams $flightSearchParams
     * @param bool $returnCacheRecord
     * @return bool|FlightCache
     * @throws CException
     */
    public function sendRequest(FlightSearchParams $flightSearchParams, $returnCacheRecord = true)
    {
        Yii::app()->observer->notify('onBeforeFlightSearch', $this);
        if ($flightSearchParams instanceof FlightSearchParams)
        {
            if ($flightSearchParams->checkValid())
            {
                $this->_routes = $flightSearchParams->routes;
                $this->flight_class = $flightSearchParams->flight_class;
                $this->key = $flightSearchParams->key;

                $sJdata = Yii::app()->gdsAdapter->FlightSearch($flightSearchParams);
                if ($sJdata)
                {
                    $paramsFs = $sJdata;
                    $paramsFs['fsKey'] = $this->key;
                    $flightVoyageStack = new FlightVoyageStack($paramsFs);
                    $this->flightVoyageStack = $flightVoyageStack;
                    Yii::app()->cache->set('flightSearch' . $this->key, $this, Yii::app()->params['fligh_search_cache_time']);

                    $this->status = FlightSearch::STATUS_SUCCESS;
                    $this->data = json_encode($this->flightVoyageStack);
                    $this->requestId = '1';
                }
                else
                    $this->status = FlightSearch::STATUS_ERROR;

                $this->saveStatistic();

                if ($this->flightVoyageStack)
                {
                    //saving best data to FlightCache
                    $attributes = array(
                        'adult_count' => $flightSearchParams->adultCount,
                        'child_count' => $flightSearchParams->childCount,
                        'infant_count' => $flightSearchParams->infantCount,
                        'flight_search_id' => $this->id
                    );
                    $this->flightVoyageStack->setAttributes($attributes);
                    Yii::app()->observer->notify('onAfterFlightSearch', $this);
                    if (($flightSearchParams->adultCount==1) && ($flightSearchParams->childCount==0) && ($flightSearchParams->infantCount==0) && ($flightSearchParams->flight_class=='E'))
                        FlightCache::addCacheFromStack($this->flightVoyageStack);
                    return $this->flightVoyageStack;
                }
            }
            else
            {
                throw new CException(Yii::t('application', 'Data in oFlightSearchParams not valid'));
            }
        }
        else
        {
            throw new CException(Yii::t('application', 'Parameter oFlightSearchParams not type of FlightSearchParams'));
        }
    }


    public function getRoutes()
    {
        return $this->_routes;
    }

    protected function createRow(Route $route)
    {
        return $route->attributes;
    }

    public function getId()
    {
        return $this->key;
    }

    public function getStatisticData()
    {
        $id = uniqid();
        $rows = array();
        foreach ($this->_routes as $route)
        {
            $element = $this->createRow($route);
            $element['isComplex'] = sizeof($this->_routes)>1;
            $element['searchId'] = $id;
            $rows[] = $element;
        }
        return $rows;
    }

    /**
     * Returns the list of attribute names of the model.
     * @return array list of attribute names.
     */
    public function attributeNames()
    {
        return array(
            'timestamp',
            'requestId',
            'status',
            'key',
            'data'
        );
    }
}
