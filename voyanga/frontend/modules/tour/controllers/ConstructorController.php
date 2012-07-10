<?php
/**
 * User: Kuklin Mikhail (kuklin@voyanga.com)
 * Company: Easytrip LLC
 * Date: 09.06.12
 * Time: 13:41
 */
class ConstructorController extends FrontendController
{
    public $tab='tour';

    public $defaultAction = 'new';

    public function actionNew($clear=false, $isTab=false)
    {
        if ($clear)
            Yii::app()->shoppingCart->clear();
        $flightForm = new FlightForm;
        $hotelForm = new HotelForm;
        if ($isTab)
            echo 'Tour rocks here';
            //$this->renderPartial('new', array('flightForm'=>$flightForm, 'hotelForm'=>$hotelForm,'autosearch'=>false, 'cityName'=>'', 'duration'=>1));
        else
            $this->render('new', array('flightForm'=>$flightForm, 'hotelForm'=>$hotelForm,'autosearch'=>false, 'cityName'=>'', 'duration'=>1));
    }

    public function actionFlightSearch()
    {
        $flightForm = new FlightForm();
        if (isset($_GET['FlightForm']))
        {
            $flightForm->attributes = $_GET['FlightForm'];
            $this->storeSearches($flightForm->departureCityId, $flightForm->arrivalCityId, $flightForm->departureDate);
            $result = MFlightSearch::getAllPricesAsJson($flightForm->departureCityId, $flightForm->arrivalCityId, $flightForm->departureDate);
            echo $result;
            Yii::app()->end();
        }
        else
            throw new CHttpException(404);
    }

    function compareByTime($a, $b)
    {
        if ($a[3] == $b[3]) {
            return 0;
        }
        return ($a[3] > $b[3]) ? -1 : 1;
    }

    private function storeSearches($from, $to, $date)
    {
        $hash = $from.$to.$date;
        $element = array($from, $to, $date, time());
        $elements = Yii::app()->user->getState('lastSearches');
        $elements[$hash] = $element;
        uasort($elements, array($this, 'compareByTime'));
        $last = array_splice($elements, 0, 10);
        Yii::app()->user->setState('lastSearches', $last);
    }
}
