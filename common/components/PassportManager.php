<?php
/**
 * Created by JetBrains PhpStorm.
 * User: mihan007
 * Date: 17.12.12
 * Time: 9:33
 * To change this template use File | Settings | File Templates.
 */ 
class PassportManager
{
    public $tripItems = array();

    public $counters;
    public $roomCounters;
    public $passportForms;

    public function generatePassportForms()
    {
        $this->initCounters();
        $ambigous = $this->checkIfAmbigous();
        if ($ambigous)
        {
            $this->generatePassportFormsForEachTripElement();
        }
        else
        {
            $this->generatePassportFormsForAllTrip();
        }
        return $ambigous;
    }

    private function initCounters()
    {
        $this->counters = array(
            'adultCount' => 0,
            'childCount' => 0,
            'infantCount' => 0
        );
        $this->roomCounters = array();
        foreach ($this->tripItems as $item)
        {
            if ($item instanceof FlightTripElement)
            {
                $this->counters = array(
                    'adultCount' => $item->adultCount,
                    'childCount' => $item->childCount,
                    'infantCount' => $item->infantCount
                );
                break;
            }
            elseif ($item instanceof HotelTripElement)
            {
                $hotelRoom = reset($item->hotel->rooms);
                foreach ($item->rooms as $room)
                {
                    $roomCounters = array(
                        'adult' => $room['adt'],
                        'child' => $room['chd'],
                        'label' => $hotelRoom->roomName
                    );
                    $this->counters['adultCount'] += $room['adt'];
                    $this->counters['childCount'] += $room['chd'];
                    $this->counters['infantCount'] += ($room['cots'] > 0) ? 1 : 0;
                    $this->roomCounters[] = $roomCounters;
                    $hotelRoom = next($item->hotel->rooms);
                }
                break;
            }
        }
    }

    private function checkIfAmbigous()
    {
        foreach ($this->tripItems as $item)
        {
            if ($item instanceof FlightTripElement)
            {
                if (
                    $this->counters['adultCount'] != $item->adultCount
                    || $this->counters['childCount'] != $item->childCount
                    || $this->counters['infantCount'] != $item->infantCount
                )
                    return true;
            }
            if ($item instanceof HotelTripElement)
            {
                $counters = array(
                    'adultCount' => 0,
                    'childCount' => 0,
                    'infantCount' => 0
                );
                foreach ($item->rooms as $room)
                {
                    $counters['adultCount'] += $room['adt'];
                    $counters['childCount'] += $room['chd'];
                    $counters['infantCount'] += ($room['cots'] > 0) ? 1 : 0;
                }
                if (
                    $this->counters['adultCount'] != $counters['adultCount']
                    || $this->counters['childCount'] != $counters['childCount']
                    || $this->counters['infantCount'] != $counters['infantCount']
                )
                    return true;
            }
        }
        return false;
    }

    private function generatePassportFormsForEachTripElement()
    {
        foreach ($this->tripItems as $item)
        {
            if ($item instanceof FlightTripElement)
            {
                for ($i = 0; $i < $item->adultCount; $i++)
                {
                    $this->passportForms[] = new FlightAdultPassportForm();
                }
                for ($i = 0; $i < $item->childCount; $i++)
                {
                    $this->passportForms[] = new FlightChildPassportForm();
                }
                for ($i = 0; $i < $item->infantCount; $i++)
                {
                    $this->passportForms[] = new FlightInfantPassportForm();
                }
            }
            elseif ($item instanceof HotelTripElement)
            {
                foreach ($item->rooms as $room)
                {
                    for ($i = 0; $i < $room['adt']; $i++)
                    {
                        $this->passportForms[] = new HotelAdultPassportForm();
                    }
                    for ($i = 0; $i < $room['chd']; $i++)
                    {
                        $this->passportForms[] = new HotelChildPassportForm();
                    }
                }
            }
        }
        return $item;
    }

    private function generatePassportFormsForAllTrip()
    {
        for ($i = 0; $i < $this->counters['adultCount']; $i++)
        {
            $this->passportForms[] = new FlightAdultPassportForm();
        }
        for ($i = 0; $i < $this->counters['childCount']; $i++)
        {
            $this->passportForms[] = new FlightChildPassportForm();
        }
        for ($i = 0; $i < $this->counters['infantCount']; $i++)
        {
            $this->passportForms[] = new FlightInfantPassportForm();
        }
    }

    public function fillFromArray($passports)
    {
        $cnt = 0;
        foreach($passports as $passport)
        {
            $this->passportForms[$cnt]->attributes = $passport->attributes;
            if ((property_exists($this->passportForms[$cnt], 'seriesNumber')) &&
                (property_exists($passport, 'number')))
                    $this->passportForms[$cnt]->seriesNumber = $passport->number;
            $cnt++;
        }
        return $this->passportForms;
    }
}
