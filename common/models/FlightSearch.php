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
    public $requestId;
    public $status;
    public $key;
    public $data;
    public $flight_class;
    public $flightVoyageStack;
    private $_routes;


    public function behaviors()
    {
        return array(
            'statisticable' => array(
                'class' => 'site.common.components.statistic.Statisticable',
            )
        );
    }

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
                if (false) //$fs = Yii::app()->cache->get('flightSearch' . $this->key))
                {
                    $this->_routes = $fs->routes;
                    $this->flight_class = $fs->flight_class;
                    $this->key = $fs->key;
                    $this->id = $fs->id;
                    $this->timestamp = $fs->timestamp;
                    $this->data = $fs->data;
                    $this->requestId = $fs->requestId;
                    $this->flightVoyageStack = $fs->oFlightVoyageStack;
                    $this->status = $fs->status;
                    return FlightCache::addCacheFromStack($this->flightVoyageStack);
                }

                //TODO: Making request to GDS
                //fill fields of object:
                //data
                //status
                //request_id
                $sJdata = Yii::app()->gdsAdapter->FlightSearch($flightSearchParams);
                if ($sJdata)
                {
                    $paramsFs = $sJdata;
                    $paramsFs['fsKey'] = $this->key;
                    $flightVoyageStack = new FlightVoyageStack($paramsFs);
                    //VarDumper::dump($flightVoyageStack);die();

                    //echo $flightVoyageStack->getAsJson();

                    $this->flightVoyageStack = $flightVoyageStack;
                    Yii::app()->cache->set('flightSearch' . $this->key, $this, Yii::app()->params['fligh_search_cache_time']);

                    $this->status = FlightSearch::STATUS_SUCCESS;
                    $this->data = json_encode($this->flightVoyageStack);
                    $this->requestId = '1';
                }
                else
                    $this->status = FlightSearch::STATUS_ERROR;

                //$this->save();

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
                    if ($returnCacheRecord)
                        return FlightCache::addCacheFromStack($this->flightVoyageStack);
                    else
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

    public function save($runValidation = true, $attributes = null)
    {
        if ($runValidation)
        {
            if ($this->_routes)
            {
                //check valid of Rotes
                //TODO: check good save
                parent::save();
                $this->id = $this->getPrimaryKey();
                $this->timestamp = date('Y-m-d H:i:s');
                foreach ($this->_routes as $route)
                {
                    $route->searchId = $this->id;
                    $route->save();
                    $route->id = $route->getPrimaryKey();
                }
            }
            else
            {
                throw new CException(Yii::t('application', 'Cant save FlightSearch without Routes'));
            }
        }
    }

    protected function createRow(Route $route)
    {
        return $route->attributes;
    }

    public function getStatisticData()
    {
        $id = uniqid();
        $rows = array();
        foreach ($this->_routes as $route)
        {
            $element = array();
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