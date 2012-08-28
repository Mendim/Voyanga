<?php
/**
 * User: Kuklin Mikhail (kuklin@voyanga.com)
 * Company: Easytrip LLC
 * Date: 07.08.12
 * Time: 12:46
 */
class TestApiController extends FrontendController
{
    public $api = 'http://api.misha.voyanga/v1';

    public $flightApi = 'flight';
    public $hotelApi = 'hotel';
    public $tourApi = 'tour';

    public $search = 'search';

    public $tests = array(
/*        'aviaSearchSimple',
        'aviaSearchComplex',
        'aviaSearchRoundTrip',
        'aviaSearchComplexRoundTrip',*/
        'hotelSearchSimple',
//        'tourSearchSimple',
    );

    public function actionDefault()
    {
        echo "<html><head><title>Testing API</title></head><body>";
        foreach ($this->tests as $test)
        {
            echo '<h2>Perform test <b>'.$test.'</b></h2>';
            $result = $this->$test();
            if ($result)
            {
                echo '<h3 style="color: green">Test ok</h3>';
                echo "Result : <pre>".$result."</pre>";
            }
            else
            {
                echo '<h3 style="color: red">Test failed</h3>';
            }
            echo '<hr>';
        }
        echo "</body></html>";
    }

    private function buildAviaApiUrl($params)
    {
        $url = $this->api . '/' . $this->flightApi . '/' . $this->search;
        $fullUrl = $url . '?' . http_build_query($params);
        echo "<br>Query: ".$fullUrl."<br>";
        return $fullUrl;
    }

    private function buildHotelApiUrl($params)
    {
        $url = $this->api . '/' . $this->hotelApi . '/' . $this->search;
        $fullUrl = $url . '?' . http_build_query($params);
        echo "<br>Query: ".$fullUrl."<br>";
        return $fullUrl;
    }

    private function buildTourApiUrl($params)
    {
        $url = $this->api . '/' . $this->tourApi . '/' . $this->search;
        $fullUrl = $url . '?' . http_build_query($params);
        echo "<br>Query: ".$fullUrl."<br>";
        return $fullUrl;
    }

    private function aviaSearchSimple()
    {
        $search = array(
            'destinations' => array(
                array(
                'departure' => 'MOW',
                'arrival' => 'LED',
                'date' => '01.10.2012',
            ))
        );
        VarDumper::dump($search);
        $fullUrl = $this->buildAviaApiUrl($search);
        $result = file_get_contents($fullUrl);
        return $result;
    }

    private function aviaSearchComplex()
    {
        $search = array(
            'destinations' => array(
                array(
                    'departure' => 'MOW',
                    'arrival' => 'LED',
                    'date' => '01.10.2012',
                ),
                array(
                    'departure' => 'LED',
                    'arrival' => 'PAR',
                    'date' => '15.10.2012',
                ),
                array(
                    'departure' => 'PAR',
                    'arrival' => 'LON',
                    'date' => '20.10.2012',
                ),
            ));
        VarDumper::dump($search);
        $fullUrl = $this->buildAviaApiUrl($search);
        $result = file_get_contents($fullUrl);
        return $result;
    }

    private function aviaSearchRoundTrip()
    {
        $search = array(
            'destinations' => array(
                array(
                    'departure' => 'MOW',
                    'arrival' => 'LED',
                    'date' => '01.10.2012',
                ),
                array(
                    'departure' => 'LED',
                    'arrival' => 'MOW',
                    'date' => '15.10.2012',
                ),
            ));
        VarDumper::dump($search);
        $fullUrl = $this->buildAviaApiUrl($search);
        $result = file_get_contents($fullUrl);
        return $result;
    }

    private function aviaSearchComplexRoundTrip()
    {
        $search = array(
            'destinations' => array(
                array(
                    'departure' => 'MOW',
                    'arrival' => 'LED',
                    'date' => '01.10.2012',
                ),
                array(
                    'departure' => 'LED',
                    'arrival' => 'LON',
                    'date' => '15.10.2012',
                ),
                array(
                    'departure' => 'LON',
                    'arrival' => 'MOW',
                    'date' => '20.10.2012',
                ),
            ));
        VarDumper::dump($search);
        $fullUrl = $this->buildAviaApiUrl($search);
        $result = file_get_contents($fullUrl);
        return $result;
    }

    private function hotelSearchSimple()
    {
        $search = array(
            'city' => 'MOW',
            'checkIn' => '2012-10-01',
            'duration' => 10,
            'rooms' => array(
                array(
                    'adt' => '2',
                    'chd' => '0',
                    'chdAge' => '0',
                    'cots' => '0',
                ))
        );
        VarDumper::dump($search);
        $fullUrl = $this->buildHotelApiUrl($search);
        $result = file_get_contents($fullUrl);
        return $result;
    }

    private function tourSearchSimple()
    {
        $search = array(
            'start' => 'LED',
            'destinations' => array(
                array(
                    'city' => 'MOW',
                    'dateFrom' => '01.10.2012',
                    'dateTo' => '10.10.2012',
                ))
        );
        VarDumper::dump($search);
        $fullUrl = $this->buildTourApiUrl($search);
        $result = file_get_contents($fullUrl);
        return $result;
    }

}