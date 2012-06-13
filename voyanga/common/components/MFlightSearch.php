<?php
/**
 * User: Kuklin Mikhail (kuklin@voyanga.com)
 * Company: Easytrip LLC
 * Date: 18.05.12
 * Time: 17:02
 */
class MFlightSearch extends CComponent
{
    private static function buildSearchParams($fromCityId, $toCityId, $date, $returnDate=false, $flightClass = 'E')
    {
        $flightSearchParams = new FlightSearchParams();
        $departureDate = date('d.m.Y', strtotime($date));
        $flightSearchParams->addRoute(array(
            'adult_count' => 1,
            'child_count' => 0,
            'infant_count' => 0,
            'departure_city_id' => $fromCityId,
            'arrival_city_id' => $toCityId,
            'departure_date' => $departureDate,
        ));
        if ($returnDate)
        {
            $returnDate = date('d.m.Y', strtotime($returnDate));
            $flightSearchParams->addRoute(array(
                'adult_count' => 1,
                'child_count' => 0,
                'infant_count' => 0,
                'departure_city_id' => $toCityId,
                'arrival_city_id' => $fromCityId,
                'departure_date' => $returnDate
            ));
        }
        $flightSearchParams->flight_class = $flightClass;
        return $flightSearchParams;
    }

    public static function getAllPricesAsJson($fromCityId, $toCityId, $date, $returnDate=false)
    {
        $flightSearchParams = self::buildSearchParams($fromCityId, $toCityId, $date, $returnDate);
        $fs = new FlightSearch();
        $fs->status = 1;
        $fs->requestId = '1';
        $fs->data = '{}';
        $variants = $fs->sendRequest($flightSearchParams, false);
        $json = $variants->getAsJson();
        return $json;
    }

    public static function getOptimalPrice($fromCityId, $toCityId, $date, $returnDate=false, $forceUpdate = false)
    {
        $flightSearchParams = self::buildSearchParams($fromCityId, $toCityId, $date, $returnDate);
        $fs = new FlightSearch();
        $fs->status = 1;
        $fs->requestId = '1';
        $fs->data = '{}';
        $criteria = new CDbCriteria();
        $criteria->addColumnCondition(array('`from`'=>$fromCityId, '`to`'=>$toCityId));
        $criteria->addCondition('`dateFrom` = STR_TO_DATE("'.$date.'", "%d.%m.%Y")');
        if ($returnDate)
        {
            $criteria->addCondition('`dateBack` = STR_TO_DATE("'.$returnDate.'", "%d.%m.%Y")');
        }
        else
        {
            $criteria->addCondition('`dateBack` = "0000-00-00"');
        }
        if ($forceUpdate)
        {
            $result = $fs->sendRequest($flightSearchParams);
        }
        else
        {
            $result = FlightCache::model()->find($criteria);
        }
        if ($result)
        {
            $return = (int)$result->priceBestPriceTime;
            if ($return == 0)
                $return = (int)$result->priceBestPrice;
            return $return;
        }
        else
            throw new CException('Can\'t get best pricetime');
    }
}
