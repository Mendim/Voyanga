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
            $this->renderPartial('new', array('flightForm'=>$flightForm, 'hotelForm'=>$hotelForm,'autosearch'=>false, 'cityName'=>'', 'duration'=>1));
        else
            $this->render('new', array('flightForm'=>$flightForm, 'hotelForm'=>$hotelForm,'autosearch'=>false, 'cityName'=>'', 'duration'=>1));
    }

    public function actionFlightSearch()
    {
        $flightForm = new FlightForm();
        if (isset($_GET['FlightForm']))
        {
            $flightForm->attributes = $_GET['FlightForm'];
            if ($flightForm->validate())
            {
                $this->storeSearches($flightForm->departureCityId, $flightForm->arrivalCityId, $flightForm->departureDate, $flightForm->adultCount, $flightForm->childCount, $flightForm->infantCount);
                $result = MFlightSearch::getAllPricesAsJson($flightForm->departureCityId, $flightForm->arrivalCityId, $flightForm->departureDate, false, $flightForm->adultCount, $flightForm->childCount, $flightForm->infantCount);
                echo $result;
            }
            else
            {
                throw new CHttpException(500, CHtml::errorSummary($flightForm));
            }
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

    private function storeSearches($from, $to, $date, $adultCount, $childCount, $infantCount)
    {
        $hash = $from.$to.$date;
        $element = array($from, $to, $date, time(), $adultCount, $childCount, $infantCount);
        $elements = Yii::app()->user->getState('lastSearches');
        $elements[$hash] = $element;
        uasort($elements, array($this, 'compareByTime'));
        $last = array_splice($elements, 0, 10);
        Yii::app()->user->setState('lastSearches', $last);
    }
}
