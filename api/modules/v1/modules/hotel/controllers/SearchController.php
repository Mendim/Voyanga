<?php
/**
 * User: Kuklin Mikhail (kuklin@voyanga.com)
 * Company: Easytrip LLC
 * Date: 07.08.12
 * Time: 12:17
 */
class SearchController extends ApiController
{
    public $defaultAction = 'default';
    private $results;

    /**
     * @param string city
     * @param string checkIn d.m.Y date
     * @param int duration # of nights inside hotel
     * @param array $rooms
     *  [Х][adt] - amount of adults inside room,
     *  [Х][chd] - amount of childs inside room,
     *  [Х][chdAge] - age of child inside room,
     *  [Х][cots] - cots inside room (0 or 1),
     */
    public function actionDefault($city, $checkIn, $duration, array $rooms, $format = 'json')
    {
        $hotelSearchParams = new HotelSearchParams();
        $hotelSearchParams->checkIn = date('Y-m-d', strtotime($checkIn));
        $possibleCities = CityManager::getCitiesWithHotels($city);
        if (!empty($possibleCities))
        {
            $hotelSearchParams->city = City::getCityByPk($possibleCities[0]['id']);
        }
        else
        {
            $city = CityManager::getCities($city);
            if (!empty($city))
            {
                $hotelSearchParams->city = City::getCityByPk($city[0]['id']);
            }
        }
        $hotelSearchParams->duration = $duration;
        foreach ($rooms as $i => $room)
        {
            if ($room['chd'] == 0)
                $hotelSearchParams->addRoom($room['adt'], $room['cots'], false);
            elseif($room['chd'] > 0 && $room['chd'] < 3)
                $hotelSearchParams->addRoom($room['adt'], $room['cots'], $room['chdAges']);
            else
            {
                $this->sendError(200, 'Only 0 or 1 or 2 child at one hotel room accepted');
                Yii::app()->end();
            }
        }
        $cacheId = md5(serialize($hotelSearchParams).microtime().rand(1000,9999));

        if (empty($possibleCities))
        {
            $this->results = array('hotels'=>array(), 'hotelsDetails'=>array());
        }
        else
        {
            $this->results = HotelManager::sendRequestToHotelProvider($hotelSearchParams, $cacheId);
            if (!$this->results)
            {
                $this->results = array('hotels'=>array(), 'hotelsDetails'=>array());
            }
        }

        $this->results['cacheId'] = $cacheId;
        $this->results['searchParams'] = $hotelSearchParams->getJsonObject();
        if($rooms)
            $this->results['searchParams']['rooms'] = $rooms;

        if ($format == 'json')
            $this->sendJson($this->results);
        elseif ($format == 'xml')
            $this->sendXml($this->results, 'hotelSearchResults');
        else
        {
            $this->sendError(400, 'Incorrect response format');
            Yii::app()->end();
        }
    }

    public function actionInfo($hotelId,$hotelResult, $cacheId = null, $format = 'json')
    {
        $hotelClient = new HotelBookClient();
        $response = array();
        $response['hotel'] = array();
        $response['hotel']['oldHotels'] = array();
        $response['hotel']['details'] = array();
        $hotelResultIDS = explode(',',$hotelResult);
        $hotelResult = array();
        foreach($hotelResultIDS as $hotelStr){
            list($resultId,$searchId) = explode(':',$hotelStr);
            $hotelResult[$resultId] = $searchId;
        }
        foreach ($hotelResult as $resultId=>$searchId)
        {
            $response['hotel']['oldHotels'][] = new Hotel(array('searchId'=>$searchId,'resultId'=>$resultId,'hotelId'=>$hotelId));
        }
        if (isset($response))
        {
            $null = null;
            $hotelClient->hotelSearchDetails($null, $response['hotel']['oldHotels']);
            if ($format == 'json')
                $this->sendJson($response);
            elseif ($format == 'xml')
                $this->sendXml($response, 'hotelSearchResults');
            Yii::app()->end();
        }
        $this->sendError(200, 'No hotel with given hotelId found');
    }

}
