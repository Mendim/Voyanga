<?php
/**
 * User: Kuklin Mikhail (kuklin@voyanga.com)
 * Company: Easytrip LLC
 * Date: 20.06.12
 * Time: 13:00
 */
class FlightController extends FrontendController
{
    public $tab = 'avia';

    private $flightBooker;

    public function actionIndex()
    {
        $flightForm = new FlightForm;
        $this->render('index', array('items'=>$this->generateItems(), 'flightForm'=>$flightForm, 'autosearch'=>false, 'fromCityName'=>'', 'toCityName'=>''), true);
    }

    public function actionSearch($from, $to, $date)
    {
        $flightForm = new FlightForm;
        $flightForm->departureCityId = $from;
        $flightForm->arrivalCityId = $to;
        $flightForm->departureDate = $date;
        $fromCityName = City::model()->findByPk($from)->localRu;
        $toCityName = City::model()->findByPk($to)->localRu;
        $this->render('index', array(
            'items'=>$this->generateItems(),
            'flightForm'=>$flightForm,
            'autosearch'=>true,
            'fromCityName'=>$fromCityName,
            'toCityName'=>$toCityName
        ));
    }

    public function actionBuy($key)
    {
        $parts = explode('_', $key);
        $searchKey = $parts[0];
        $searchId = $parts[1];
        $flightVoyage = FlightVoyage::getFromCache($searchKey, $searchId);
        Yii::app()->flightBooker->flightVoyage = $flightVoyage;
        if (Yii::app()->flightBooker->getCurrent()==null)
            Yii::app()->flightBooker->book();
        $status = Yii::app()->flightBooker->current->swGetStatus()->getId();
        $action = 'stage'.ucfirst($status);
        if (method_exists($this, $action))
            $this->$action();
        else
            Yii::app()->flightBooker->$action();
    }

    public function stageEnterCredentials()
    {
        $valid = true;
        $booking = new BookingForm();
        if(isset($_POST['BookingForm']))
        {
            $booking->attributes=$_POST['BookingForm'];
            $valid = $booking->validate() && $valid;
        }
        else
        {
            $valid = false;
        }

        $passport = new PassportForm();
        if(isset($_POST['PassportForm']))
        {
            $passport->attributes=$_POST['PassportForm'];
            $valid = $valid && $passport->validate();
        }

        if($valid)
        {
            //saving data to objects
            $bookingAr = new Booking();

            $bookingAr->email = $booking->contactEmail;
            $bookingAr->phone = $booking->contactPhone;
            if (!Yii::app()->user->isGuest)
                $bookingAr->userId = Yii::app()->user->id;

            $bookingPassports = array();
            $bookingPassport = new BookingPassport();
            $bookingPassport->birthday = $passport->birthday;
            $bookingPassport->firstName = $passport->firstName;
            $bookingPassport->lastName = $passport->lastName;
            $bookingPassport->countryId = $passport->countryId;
            $bookingPassport->number = $passport->number;
            $bookingPassport->series = $passport->series;
            $bookingPassport->genderId = $passport->genderId;
            $bookingPassport->documentTypeId = $passport->documentTypeId;
            $bookingPassports[] = $bookingPassport;

            $bookingAr->bookingPassports = $bookingPassports;
            $bookingAr->flightId = Yii::app()->flightBooker->current->flightVoyage->flightKey;

            if($bookingAr->save())
            {
                Yii::app()->flightBooker->current->bookingId = $bookingAr->id;
                Yii::app()->flightBooker->status('booking');
                $this->refresh();
            }
            else
            {
                $this->render('enterCredentials', array('passport'=>$passport, 'booking'=>$booking));
            }
        }
        else
            $this->render('enterCredentials', array('passport'=>$passport, 'booking'=>$booking));
    }

    public function stagePayment()
    {
        if (isset($_POST['submit']))
            Yii::app()->flightBooker->status('ticketing');
        else
            $this->render('payment');
    }

    public function generateItems()
    {
        $elements = Yii::app()->user->getState('lastSearches');
        $items = array();
        if (!is_array($elements))
            return $items;
        foreach ($elements as $element)
        {
            $item = array(
                'label' => City::model()->getCityByPk($element[0])->localRu . '&nbsp;&rarr;&nbsp;' . City::model()->getCityByPk($element[1])->localRu . '<br>(' . $element[2] .')',
                'url' => '/admin/booking/flight/search/from/'.$element[0].'/to/'.$element[1].'/date/'.$element[2],
                'encodeLabel' => false
            );
            $items[] = $item;
        }
        return $items;
    }
}
