<?php
/**
 * User: Kuklin Mikhail (kuklin@voyanga.com)
 * Company: Easytrip LLC
 * Date: 24.07.12
 * Time: 12:25
 */
class TourBuilderForm extends CFormModel
{
    /** @var TripForm[] */
    public $trips = array();

    public $startDate;
    public $endDate;

    public $adultCount = 2;
    public $childCount = 0;
    public $infantCount = 0;

    public $startCityModel;

    public function getStartCityId()
    {
        if ($this->startCityModel)
            return $this->startCityModel->id;
        return null;
    }

    public function setStartCityId($value)
    {
        $this->startCityModel = City::model()->getCityByPk($value);
    }

    public function getStartCityName()
    {
        if ($this->startCityModel)
            return $this->startCityModel->localRu;
        return null;
    }

    public function setStartCityName($value)
    {
        $this->startCityModel = City::model()->findByAttributes(array('localRu'=>$value));
    }
}
