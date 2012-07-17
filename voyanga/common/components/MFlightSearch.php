<?php
/**
 * User: Kuklin Mikhail (kuklin@voyanga.com)
 * Company: Easytrip LLC
 * Date: 18.05.12
 * Time: 17:02
 */
class MFlightSearch extends CComponent
{
    /**
     * @static
     * @param FlightForm $flightForm
     * @return FlightSearchParams
     */
    private static function buildSearchParams($flightForm)
    {
        $flightSearchParams = new FlightSearchParams();
        foreach ($flightForm->routes as $route)
        {
            $departureDate = date('d.m.Y', strtotime($route->departureDate));
            $flightSearchParams->addRoute(array(
                'adult_count' => $flightForm->adultCount,
                'child_count' => $flightForm->childCount,
                'infant_count' => $flightForm->infantCount,
                'departure_city_id' => $route->departureCityId,
                'arrival_city_id' => $route->arrivalCityId,
                'departure_date' => $route->departureDate,
            ));
            if ($route->isRoundTrip)
            {
                $returnDate = date('d.m.Y', strtotime($route->backDate));
                $flightSearchParams->addRoute(array(
                    'adult_count' => $flightForm->adultCount,
                    'child_count' => $flightForm->childCount,
                    'infant_count' => $flightForm->infantCount,
                    'departure_city_id' => $route->arrivalCityId,
                    'arrival_city_id' => $route->departureCityId,
                    'departure_date' => $returnDate
                ));
            }
            $flightSearchParams->flight_class = $flightForm->flightClass;
        }
        return $flightSearchParams;
    }

    /**
     * @static
     * @param FlightForm $flightForm
     * @return mixed
     */
    public static function getAllPricesAsJson($flightForm)
    {
        if (!$flightForm instanceof FlightForm)
            throw new CHttpException(500, 'MFlightSearch requires instance of FlightForm as incoming param');
        $flightSearchParams = self::buildSearchParams($flightForm);
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
        $flightSearchParams = self::buildSearchParams($fromCityId, $toCityId, $date, $returnDate, 1, 0, 0);
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
