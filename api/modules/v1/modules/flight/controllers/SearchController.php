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
     * @param array $destinations
     *  [Х][departure] - departure city iata code,
     *  [Х][arrival] - arrival city iata code,
     *  [Х][date] - departure date,
     *
     * @param int $adt amount of adults
     * @param int $chd amount of childs
     * @param int $inf amount of infanties
     */
    public function actionBE(array $destinations, $adt = 1, $chd = 0, $inf = 0, $format='json')
    {
        $asyncExecutor = new AsyncCurl();
        $this->addBusinessClassAsyncResponse($destinations, $adt, $chd, $inf, $asyncExecutor);
        $this->addEconomClassAsyncResponse($destinations, $adt, $chd, $inf, $asyncExecutor);
        //$this->addFirstClassAsyncResponse($destinations, $adt, $chd, $inf, $asyncExecutor);
        $responses = $asyncExecutor->send();
        $errors = array();
        $variants = array();
        foreach ($responses as $response)
        {
            if ($httpCode=$response->headers['http_code'] == 200)
            {
                $combined = CJSON::decode($response->body);
                $flights = $combined['flights'];
                $searchParams = $combined['searchParams'];
                $variants = CMap::mergeArray($variants, $this->injectForBe($flights, $searchParams));
            }
            else
                $errors[] = 'Error '.$httpCode;
        }
        if (!empty($this->errors))
        {
            $this->sendError(200, CVarDumper::dump($errors));
            Yii::app()->end();
        }
        else
        {
            $flightSearchParams = $this->buildSearchParams($destinations, $adt, $chd, $inf, 'A');
            $this->results = $variants;
            $result['flights']['flightVoyages'] = $this->results;
            $result['searchParams'] = $flightSearchParams->getJsonObject();
            $this->sendWithCorrectFormat($format, $result);
        }
    }

    private function addEconomClassAsyncResponse($destinations, $adt, $chd, $inf, $asyncExecutor)
    {
        $economUrl = Yii::app()->createAbsoluteUrl('/v1/flight/search/withParams');
        $query = http_build_query(array(
            'destinations' => $destinations,
            'adt' => $adt,
            'chd' => $chd,
            'inf' => $inf,
            'serviceClass' => 'E',
        ));
        $economUrl = $economUrl . '?' . $query;
        $asyncExecutor->add($economUrl);
    }

    private function addBusinessClassAsyncResponse($destinations, $adt, $chd, $inf, $asyncExecutor)
    {
        $businessUrl = Yii::app()->createAbsoluteUrl('/v1/flight/search/withParams');
        $query = http_build_query(array(
            'destinations' => $destinations,
            'adt' => $adt,
            'chd' => $chd,
            'inf' => $inf,
            'serviceClass' => 'B',
        ));
        $businessUrl = $businessUrl . '?' . $query;
        $asyncExecutor->add($businessUrl);
    }

    private function addFirstClassAsyncResponse($destinations, $adt, $chd, $inf, $asyncExecutor)
    {
        $businessUrl = Yii::app()->createAbsoluteUrl('/v1/flight/search/withParams');
        $query = http_build_query(array(
            'destinations' => $destinations,
            'adt' => $adt,
            'chd' => $chd,
            'inf' => $inf,
            'serviceClass' => 'F',
        ));
        $businessUrl = $businessUrl . '?' . $query;
        $asyncExecutor->add($businessUrl);
    }

    /**
     * @param array $destinations
     *  [Х][departure] - departure city iata code,
     *  [Х][arrival] - arrival city iata code,
     *  [Х][date] - departure date,
     *
     * @param int $adt amount of adults
     * @param int $chd amount of childs
     * @param int $inf amount of infanties
     * @param string $serviceClass (A = all | E = economy | B = business)
     */
    public function actionDefault(array $destinations, $adt = 1, $chd = 0, $inf = 0, $serviceClass = 'A', $format='json')
    {
        $flightSearchParams = $this->buildSearchParams($destinations, $adt, $chd, $inf, $serviceClass);
        $results['flightVoyages'] = $this->doFlightSearch($flightSearchParams);
        $this->sendWithCorrectFormat($format, $results);
    }

    public function actionWithParams(array $destinations, $adt = 1, $chd = 0, $inf = 0, $serviceClass = 'A', $format='json')
    {
        $flightSearchParams = $this->buildSearchParams($destinations, $adt, $chd, $inf, $serviceClass);
        $results = array(
            'flights' => $this->doFlightSearch($flightSearchParams),
            'searchParams' => $flightSearchParams->getJsonObject()
        );
        $this->sendWithCorrectFormat($format, $results);
    }

    private function injectForBe($flightVoyages, $injectSearchParams=false)
    {
        $newFlights = array();
        foreach ($flightVoyages as $key => $flight)
        {
            $newFlight = $flight;
            if ($injectSearchParams)
            {
                $newFlight['serviceClass'] = $injectSearchParams['serviceClass'];
                $newFlight['freeWeight'] = ($newFlight['serviceClass'] == 'E') ? $flight['economFreeWeight'] : $flight['businessFreeWeight'];
                $newFlight['freeWeightDescription'] = ($newFlight['serviceClass'] == 'E') ? $flight['economDescription'] : $flight['businessDescription'];
                unset($newFlight['economFreeWeight']);
                unset($newFlight['businessFreeWeight']);
                unset($newFlight['economDescription']);
                unset($newFlight['businessDescription']);
            }
            $newFlights[] = $newFlight;
        }
        return $newFlights;
    }

    private function inject($flights, $cacheId)
    {
        $newFlights = array();
        $searchId = $flights['searchId'];
        $flightVoyages = $flights['flightVoyages'];
        foreach ($flightVoyages as $key => $flight)
        {
            $newFlight = $flight;
            $newFlight['searchId'] = $searchId;
            $newFlight['cacheId'] = $cacheId;
            $newFlights[] = $newFlight;
        }
        return $newFlights;
    }

    private function doFlightSearch($flightSearchParams)
    {
        $fs = new FlightSearch();
        $this->results = $fs->sendRequest($flightSearchParams, false);
        $cacheId = $this->storeToCache($flightSearchParams);
        $results = $this->inject($this->results->getJsonObject(), $cacheId);
        return $results;
    }

    private function buildSearchParams($destinations, $adt, $chd, $inf, $service_class)
    {
        $flightSearchParams = new FlightSearchParams();
        foreach ($destinations as $route)
        {
            $departureDate = date('d.m.Y', strtotime($route['date']));
            $departureCity = City::model()->getCityByCode($route['departure']);
            if (!$departureCity)
                $this->sendError(400, 'Incorrect IATA code for deparure city');
            $arrivalCity = City::model()->getCityByCode($route['arrival']);
            if (!$arrivalCity)
                $this->sendError(400, 'Incorrect IATA code for arrival city');
            $flightSearchParams->addRoute(array(
                'adult_count' => $adt,
                'child_count' => $chd,
                'infant_count' => $inf,
                'departure_city_id' => $departureCity->id,
                'arrival_city_id' => $arrivalCity->id,
                'departure_date' => $departureDate,
            ));
            $flightSearchParams->flight_class = $service_class;
        }
        return $flightSearchParams;
    }

    private function sendWithCorrectFormat($format, $results)
    {
        if ($format == 'json')
            $this->sendJson($results);
        elseif ($format == 'xml')
            $this->sendXml($results, 'aviaSearchResults');
        else
        {
            $this->sendError(400, 'Incorrect response format');
            Yii::app()->end();
        }
    }

    private function storeToCache($flightSearchParams)
    {
        $cacheId = md5(serialize($flightSearchParams));
        Yii::app()->pCache->set('flightSearchResult' . $cacheId, $this->results, appParams('flight_search_cache_time'));
        Yii::app()->pCache->set('flightSearchParams' . $cacheId, $flightSearchParams, appParams('flight_search_cache_time'));
        return $cacheId;
    }
}