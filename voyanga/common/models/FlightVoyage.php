<?php
/**
 * FlightVoyage class
 * Class with full flight marchroute
 * @author oleg
 *
 */
class FlightVoyage
{
    public $price;
    public $taxes;
    public $flightKey;
    public $valAirlineCode;
    public $commission;
    public $flights;
    public $adultPassengerInfo;
    public $childPassengerInfo;
    public $infantPassengerInfo;
    public $bestMask = 0;

    public function __construct($oParams)
    {
        $this->price = $oParams->full_sum;
        $this->taxes = $oParams->commission_price;
        $this->flightKey = $oParams->flight_key;
        $this->commission = $oParams->commission_price;
        $this->flights = array();
        if (!$this->valAirlineCode)
        {
            $this->valAirlineCode = $oParams->valAirline;
        }
        $iInd = 0;
        $lastArrTime = 0;
        $lastCityToId = 0;
        $bStart = true;
        if ($oParams->parts)
        {
            foreach ($oParams->parts as $iGroupId => $aParts)
            {
                $iIndPart = 0;
                $this->flights[$iGroupId] = new Flight();

                foreach ($aParts as $oPartParams)
                {
                    $oPart = new FlightPart($oPartParams);
                    $this->flights[$iGroupId]->addPart($oPart);
                }
            }
        } else
        {
            throw new CException(Yii::t('application', 'Required param $oParams->parts not set.'));
        }

    }

    public function getFullDuration()
    {
        $iFullDuration = 0;
        foreach ($this->flights as $oFlight)
        {
            $iFullDuration += $oFlight->fullDuration;
        }
        return $iFullDuration;
    }


}