<?php
/**
 * User: Kuklin Mikhail (mikhail@clevertech.biz)
 * Company: Clevertech LLC.
 * Date: 19.08.12 18:37
 */
abstract class TripElementWorkflow extends CComponent implements ITripElementWorkflow
{
    public $finalStatus = 'notStarted';

    protected $bookingContactInfo;

    protected $item;

    protected $workflow;

    public function __construct($item)
    {
        $this->item = $item;
    }

    public function getItem()
    {
        return $this->item;
    }

    public function setItem($val)
    {
        $this->item = $val;
    }

    public function getWorkflow()
    {
        return $this->workflow;
    }

    public function setWorkflow($val)
    {
        $this->workflow = $val;
    }

    public function bookItem()
    {
        $this->createBookingInfoForItem();
        $this->createWorkflowAndLinkItWithItem();
        $this->saveCredentialsForItem();
    }

    protected function createOrderBookingIfNotExist()
    {
        if (!$this->bookingContactInfo)
        {
            $this->bookingContactInfo = new OrderBooking();
            $this->bookingContactInfo->attributes = $this->getBookingContactFormData();
            if (!$this->bookingContactInfo->save())
            {
                $errMsg = 'Saving of order booking fails: '.CVarDumper::dumpAsString($this->bookingContactInfo->errors);
                $this->logAndThrowException($errMsg, 'OrderComponent.createOrderBookingIfNotExist');
            }
        }
        return $this->bookingContactInfo;
    }

    private function getBookingContactFormData()
    {
        //todo: implement returning booking form here
        return $this->getTestBookingContactFormData();
    }

    private function getTestBookingContactFormData()
    {
        return array('email' => 'test@test.ru', 'phone' => '9213546576');
    }
}
