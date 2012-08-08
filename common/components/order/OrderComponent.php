<?php
/**
 * User: Kuklin Mikhail (kuklin@voyanga.com)
 * Company: Easytrip LLC
 * Date: 04.06.12
 * Time: 16:25
 */
class OrderComponent extends CApplicationComponent
{
    public $shoppingCartComponent = 'shoppingCart';
    public $isValid;

    public function getPositions($asJson = true)
    {
        $positions = Yii::app()->{$this->shoppingCartComponent}->getPositions();
        $result = array();
        $time = array();
        $weight = array();
        foreach($positions as $position)
        {
            if ($asJson)
            {
                $element = $position->getJsonObject();
            }
            else
            {
                $element = $position;
            }
            $time[] = $position->getTime();
            $weight[] = $position->getWeight();
            if ($asJson)
            {
                if ($position instanceof FlightTripElement)
                    $element['isFlight'] = true;
                if ($position instanceof HotelTripElement)
                {
                    $element['isHotel'] = true;
                }
                $element['isLinked'] = $position->isLinked();
            }
            $result['items'][] = $element;
            unset($element);
        }
        if (sizeof($time)>0)
        {
            array_multisort($time, SORT_ASC, SORT_NUMERIC, $weight, SORT_ASC, SORT_NUMERIC, $result['items']);
        }
        if ($asJson)
            return json_encode($result);
        else
            return $result;
    }

    public function create($name)
    {
        $order = new Order;
        $order->userId = Yii::app()->user->id;
        $order->name = $name;
        if ($result = $order->save())
        {
            $items = $this->getPositions(false);
            foreach ($items['items'] as $item)
            {
                if ($saved = $item->saveToOrderDb())
                {
                    $item->saveReference($order);
                }
                else
                {
                    $result = false;
                    break;
                }
            }

        }
        echo json_encode(array('result'=>$result));
    }

    public function forceValidate()
    {
        $positions = $this->getPositions(false);
        $allValid = true;
        /** @var FlightVoyage[] $positions */
        foreach($positions as $position){
            $valid = $position->getIsValid();
            if(!$valid)
            {
                //$position->
            }
            $allValid &= $valid;
        }
        $this->isValid = $allValid;
    }

    public function booking()
    {
        //$positions = $this->getPositions(false);
        //VarDumper::dump($positions);die();
        echo date('Y-m-d H:i:s');
        $bookingModel = new OrderBooking();
        $bookingModel->attributes = ($this->getOrderParams()) ? $this->getOrderParams()->attributes : array();
        $validSaving = $bookingModel->save();

        if(!$validSaving)
            Yii::trace(CVarDumper::dumpAsString($bookingModel->errors), 'HotelBooker.EnterCredentials.bookingModel');

        if($validSaving)
        {
            echo "processing ".$bookingModel->id;
            $positions = $this->getPositions(false);
            if(isset($positions['items']))
                $positions = $positions['items'];

            //die();
            $bookedElements = array();

            /** @var HotelTripElement[] $positions */
            foreach($positions as $position)
            {
                $passports = $position->getPassports();
                //VarDumper::dump($passports);die();
                if($position instanceof HotelTripElement)
                {
                    echo "Processing HotelTrip";
                    $groupId = $position->getId();
                    if(!isset($bookedElements[$groupId]))
                    {
                        /** @var HotelBookerComponent $hotelBookerComponent  */
                        $hotelBookerComponent = new HotelBookerComponent();

                        $hotelBookerComponent->setHotelBookerFromHotel($position->hotel);

                        $bookedElements[$groupId] = $groupId;

                        //$hotelBookerComponent->book();
                        $hotelBookerComponent->getCurrent()->orderBookingId = $bookingModel->id;
                        $hotelBookerComponent->getCurrent()->status = 'enterCredentials';
                        $hotelBookerComponent->getCurrent()->save();

                        if($hotelBookerComponent->getCurrent()->getErrors()){
                            VarDumper::dump($hotelBookerComponent->getCurrent()->getErrors());
                        }else
                        {
                            echo "HotelBooker id :".$hotelBookerComponent->getCurrent()->id;
                        }
                        //die();
                        //??
                        $hotelBookerId = $hotelBookerComponent->getHotelBookerId();
                        /** @var $passports HotelPassportForm */
                        foreach($passports->roomsPassports as $i=>$roomPassport)
                        {
                            //VarDumper::dump($roomsPassport);die();
                            /** @var $roomsPassport RoomPassportForm[] */
                            //foreach ($roomsPassport as $i=>$roomPassport)
                            //{
                                foreach($roomPassport->adultsPassports as $adultInfo)
                                {
                                    $hotelPassport = new HotelBookingPassport();
                                    $hotelPassport->scenario = 'adult';
                                    $hotelPassport->attributes = $adultInfo->attributes;
                                    $hotelPassport->hotelBookingId = $hotelBookerId;
                                    $hotelPassport->roomKey = $i;
                                    $validSaving = $validSaving and $hotelPassport->save();
                                    Yii::trace(CVarDumper::dumpAsString($hotelPassport->errors), 'HotelBooker.EnterCredentials.adultPassport');
                                }
                                foreach($roomPassport->childrenPassports as $childInfo)
                                {
                                    $hotelPassport = new HotelBookingPassport();
                                    $hotelPassport->scenario = 'child';
                                    $hotelPassport->attributes = $childInfo->attributes;
                                    $hotelPassport->hotelBookingId = $hotelBookerId;
                                    $hotelPassport->roomKey = $i;
                                    $validSaving = $validSaving and $hotelPassport->save();
                                    Yii::trace(CVarDumper::dumpAsString($hotelPassport->errors), 'HotelBooker.EnterCredentials.childPassport');
                                }
                            //}
                        }
                        if ($validSaving)
                        {
                            //VarDumper::dump($hotelBookerComponent->hotel);die();
                            echo "Go to analyzing";
                            $hotelBookerComponent->status('analyzing');
                        }
                    }
                }
                elseif($position instanceof FlightTripElement)
                {
                    $groupId = $position->getGroupId();
                    if(!isset($bookedElements[$groupId]))
                    {
                        echo "processing Flight";
                        /** @var FlightBookerComponent $flightBookerComponent  */
                        $flightBookerComponent = new FlightBookerComponent();
                        $flightBookerComponent->setFlightBookerFromFlightVoyage($position->flightVoyage);

                        $bookedElements[$groupId] = $groupId;
                        $flightBookerComponent->getCurrent()->orderBookingId = $bookingModel->id;
                        $flightBookerComponent->getCurrent()->save();

                        //VarDumper::dump($flightBookerComponent);
                        $flightBookerId = $flightBookerComponent->getFlightBookerId();
                        echo "FlightBookerId : $flightBookerId";
                        //VarDumper::dump($passports);
                        //die();
                        /** @var $passports PassengerPassportForm[] */
                        //foreach($passports as $passport)
                        //{

                            foreach ($passports->adultsPassports as $adultInfo)
                            {
                                $flightPassport = new FlightBookingPassport();
                                //$flightPassport->attributes = $adultInfo->attributes;
                                //$flightPassport->flightBookingId = $flightBookerId;
                                $flightPassport->populate($adultInfo,$flightBookerId);
                                $flightPassport->save();
                            }
                            foreach ($passports->childrenPassports as $childInfo)
                            {
                                $flightPassport = new FlightBookingPassport();
                                //$flightPassport->attributes = $childInfo->attributes;
                                //$flightPassport->flightBookingId = $flightBookerId;
                                $flightPassport->populate($childInfo,$flightBookerId);
                                $flightPassport->save();
                            }
                            foreach ($passports->infantPassports as $infantInfo)
                            {
                                $flightPassport = new FlightBookingPassport();
                                //$flightPassport->attributes = $infantInfo->attributes;
                                //$flightPassport->flightBookingId = $flightBookerId;
                                $flightPassport->populate($infantInfo,$flightBookerId);
                                $flightPassport->save();
                            }
                            //Yii::trace(CVarDumper::dumpAsString($flightPassport->errors), 'FlightBooker.EnterCredentials.flightPassport');
                        //}
                        //VarDumper::dump($flightBookerComponent);
                        echo "GoTo Booking";
                        $flightBookerComponent->status('booking');
                    }
                }
            }
        }

    }

    public function startPayment()
    {
        // perekluchaem v state startpayment
        // i proveraem
    }

    public function getPayment()
    {
        $bookingModel = new OrderBooking();

        $haveStateStartPayment = true;
        $allTicketingValid = true;

        /** @var FlightBooker[] $flightBookers  */
        $flightBookers = FlightBooker::model()->findAllByAttributes(array('orderBookingId'=>$bookingModel->primaryKey));
        foreach($flightBookers as $flightBooker)
        {
            $status = $flightBooker->status;
            if(strpos($status,'/') !== false)
            {
                $status = substr($status, strpos($status,'/')+1);
            }
            if($status !== 'startPayment'){
                $haveStateStartPayment = false;
            }

            //$flightBooker->timeout;
        }

        $hotelBookers = HotelBooker::model()->findAllByAttributes(array('orderBookingId'=>$bookingModel->primaryKey));
        foreach($hotelBookers as $hotelBooker)
        {
            $status = $hotelBooker->status;
            if(strpos($status,'/') !== false)
            {
                $status = substr($status, strpos($status,'/')+1);
            }
            if(($status !== 'softStartPayment') OR ($status !== 'hardStartPayment'))
            {
                $haveStateStartPayment = false;
            }
        }

        if(!$haveStateStartPayment)
        {
            //TODO: make return money and go to find new objects
            $allTicketingValid = false;
        }
        else
        {
            //TODO: make tiketing
            /** @var FlightBooker[] $flightBookers  */

            $flightBookers = FlightBooker::model()->findAllByAttributes(array('orderBookingId'=>$bookingModel->primaryKey));
            foreach($flightBookers as $flightBooker)
            {
                $status = $flightBooker->status;
                if(strpos($status,'/') !== false)
                {
                    $status = substr($status, strpos($status,'/')+1);
                }
                if(($status == 'startPayment') and ($allTicketingValid)){
                    $flightBooker->status = 'ticketing';
                    $flightBooker->save();
                    //check that status is good
                    //else $allTicketingValid = false;
                    $newStatus = $flightBooker->status;
                    if($newStatus == 'ticketingRepeat')
                    {
                        $allTicketingValid = false;
                    }
                }

                //$flightBooker->timeout;
            }

            /** @var HotelBooker[] $hotelBookers  */
            $hotelBookers = HotelBooker::model()->findAllByAttributes(array('orderBookingId'=>$bookingModel->primaryKey));
            foreach($hotelBookers as $hotelBooker)
            {
                $status = $hotelBooker->status;
                if(strpos($status,'/') !== false)
                {
                    $status = substr($status, strpos($status,'/')+1);
                }
                if(($status == 'hardStartPayment') and ($allTicketingValid))
                {
                    $hotelBooker->status = 'ticketing';
                    $hotelBooker->save();

                    $newStatus = $hotelBooker->status;
                    if($newStatus == 'ticketingRepeat')
                    {
                        $allTicketingValid = false;
                    }
                }
            }
            foreach($hotelBookers as $hotelBooker)
            {
                $status = $hotelBooker->status;
                if(strpos($status,'/') !== false)
                {
                    $status = substr($status, strpos($status,'/')+1);
                }
                if(($status == 'softStartPayment') and ($allTicketingValid))
                {
                    $hotelBooker->status = 'moneyTransfer';
                    $hotelBooker->save();
                }
            }

            if(!$allTicketingValid)
            {

            }
        }

    }

    public function returnMoney()
    {
        $bookingModel = new OrderBooking();

        /** @var FlightBooker[] $flightBookers  */
        $flightBookers = FlightBooker::model()->findAllByAttributes(array('orderBookingId'=>$bookingModel->primaryKey));
        foreach($flightBookers as $flightBooker)
        {
            $status = $flightBooker->status;
            if(strpos($status,'/') !== false)
            {
                $status = substr($status, strpos($status,'/')+1);
            }
            $flightBooker->status = 'moneyReturn';
            $flightBooker->save();

            //$flightBooker->timeout;
        }

        $hotelBookers = HotelBooker::model()->findAllByAttributes(array('orderBookingId'=>$bookingModel->primaryKey));
        foreach($hotelBookers as $hotelBooker)
        {
            $status = $hotelBooker->status;
            if(strpos($status,'/') !== false)
            {
                $status = substr($status, strpos($status,'/')+1);
            }
            $hotelBooker->status = 'moneyReturn';
            $hotelBooker->save();

        }
    }

    public function transferMoney()
    {
        $bookingModel = new OrderBooking();

        /** @var FlightBooker[] $flightBookers  */
        $flightBookers = FlightBooker::model()->findAllByAttributes(array('orderBookingId'=>$bookingModel->primaryKey));
        foreach($flightBookers as $flightBooker)
        {
            $status = $flightBooker->status;
            if(strpos($status,'/') !== false)
            {
                $status = substr($status, strpos($status,'/')+1);
            }
            $flightBooker->status = 'transferMoney';
            $flightBooker->save();

            //$flightBooker->timeout;
        }

        $hotelBookers = HotelBooker::model()->findAllByAttributes(array('orderBookingId'=>$bookingModel->primaryKey));
        foreach($hotelBookers as $hotelBooker)
        {
            $status = $hotelBooker->status;
            if(strpos($status,'/') !== false)
            {
                $status = substr($status, strpos($status,'/')+1);
            }
            $hotelBooker->status = 'transferMoney';
            $hotelBooker->save();
        }
    }

    /**
     * @return BookingForm
     */
    private function getOrderParams()
    {
        //todo: implement returning booking form here
        $return = '';
        return $return;
    }
}
