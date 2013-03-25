<?php

/**
 * This is the model class for table "flight_booking".
 *
 * The followings are the available columns in table 'flight_booking':
 * @property integer $id
 * @property string $status
 * @property string $pnr
 * @property string $timeout
 * @property string $flightVoyageInfo
 * @property string $updated
 * @property string $flightVoyageId
 * @property integer $orderBookingId
 * @property integer $nemoBookId
 * @property string $timestamp
 * @property integer $price
 *
 * The followings are the available model relations:
 * @property OrderBooking $orderBooking
 * @property FlightBookingPassport[] $flightBookingPassports
 */

Yii::import("common.extensions.payments.models.Bill");

class FlightBooker extends SWLogActiveRecord
{
    private $_flightVoyage;
    private $statusChanged = false;
    private $flightBookerComponent;

    /**
     * Returns the static model of the specified AR class.
     * @param string $className active record class name.
     * @return FlightBooker the static model class
     */
    public static function model($className=__CLASS__)
    {
        return parent::model($className);
    }

    public function beforeTransition($event)
    {
        Yii::app()->observer->notify('onAfter'.ucfirst($event->source->getId()), $this);
        parent::beforeTransition($event);
    }

    public function afterTransition($event)
    {
        $stage = $event->destination->getId();
        Yii::app()->observer->notify('onBefore'.ucfirst($stage), $this);
        $this->statusChanged = true;
        parent::afterTransition($event);
    }

    public function afterSave()
    {
        if (!$this->statusChanged)
            return parent::afterSave();
        $method = 'stage'. ucfirst($this->swGetStatus()->getId());
        if (isset(Yii::app()->controller) and ($action = Yii::app()->controller->createAction($method)))
        {
            $action->execute();
        }
        elseif (method_exists(Yii::app()->flightBooker, $method) or method_exists($this->flightBookerComponent, $method))
        {
            if($this->flightBookerComponent)
            {
                $this->flightBookerComponent->$method();
                return parent::afterSave();
            }
            elseif(Yii::app()->flightBooker)
            {
                Yii::app()->flightBooker->$method();
                return parent::afterSave();
            }
            throw new CException('Unknown '.$method.' of FlightBooker');
        }
    }

    /**
     * @return string the associated database table name
     */
    public function tableName()
    {
        return 'flight_booking';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules()
    {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            //array('id', 'required'),
            array('id, orderBookingId, nemoBookId', 'numerical', 'integerOnly'=>true),
            array('status, flightVoyageId', 'length', 'max'=>60),
            array('pnr', 'length', 'max'=>10),
            array('timeout, flightVoyageInfo, updated, timestamp', 'safe'),
            // The following rule is used by search().
            // Please remove those attributes that should not be searched.
            array('id, status, pnr, timeout, flightVoyageInfo, updated, flightVoyageId, orderBookingId, nemoBookId, timestamp, price, searchParams', 'safe', 'on'=>'search'),
        );
    }

    public function behaviors()
    {
        return array(
            'workflow'=>array(
                'class' => 'site.common.extensions.simpleWorkflow.SWActiveRecordBehavior',
                'workflowSourceComponent' => 'workflow',
            ),
            'CTimestampBehavior' => array(
                'class' => 'zii.behaviors.CTimestampBehavior',
                'createAttribute' => 'timestamp',
                'updateAttribute' => 'updated',
            ),
            'EAdvancedArBehavior' => array(
                'class' => 'common.components.EAdvancedArBehavior'
            ),
            'CronTask'=>array(
                'class' => 'site.common.components.cron.CronTaskBehavior',
            ),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations()
    {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'orderBooking' => array(self::BELONGS_TO, 'OrderBooking', 'orderBookingId'),
            'flightBookingPassports' => array(self::HAS_MANY, 'FlightBookingPassport', 'flightBookingId'),
            'bill' => array(self::BELONGS_TO, 'Bill', 'billId'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels()
    {
        return array(
            'id' => 'ID',
            'status' => 'Status',
            'pnr' => 'Pnr',
            'timeout' => 'Timeout',
            'flightVoyage' => 'Flight Voyage',
            'updated' => 'Updated',
            'flightVoyageId' => 'Flight Voyage',
            'orderBookingId' => 'Order Booking',
            'nemoBookId' => 'Nemo Book',
            'timestamp' => 'Timestamp',
        );
    }

    /**
     * Retrieves a list of models based on the current search/filter conditions.
     * @return CActiveDataProvider the data provider that can return the models based on the search/filter conditions.
     */
    public function search()
    {
        // Warning: Please modify the following code to remove attributes that
        // should not be searched.

        $criteria=new CDbCriteria;

        $criteria->compare('id',$this->id);
        $criteria->compare('status',$this->status,true);
        $criteria->compare('pnr',$this->pnr,true);
        $criteria->compare('timeout',$this->timeout,true);
        $criteria->compare('flightVoyage',$this->flightVoyage,true);
        $criteria->compare('updated',$this->updated,true);
        $criteria->compare('flightVoyageId',$this->flightVoyageId,true);
        $criteria->compare('orderBookingId',$this->orderBookingId);
        $criteria->compare('nemoBookId',$this->nemoBookId);
        $criteria->compare('timestamp',$this->timestamp,true);

        return new CActiveDataProvider($this, array(
            'criteria'=>$criteria,
        ));
    }

    public function getFlightVoyage()
    {
        if ($this->_flightVoyage==null)
        {
            if ($this->isNewRecord)
            {
                return null;
            }
            else
            {
                $element = unserialize($this->flightVoyageInfo);
                $this->_flightVoyage = $element;
            }
        }
        return $this->_flightVoyage;
    }

    //! return MOW - LED
    public function getSmallDescription()
    {
        $fw = $this->getFlightVoyage();
        $result = $fw->getDepartureCity(0)->code;
        $result.= ' - ';
        if($fw->isRoundTrip())
            $result.= $fw->getArrivalCity(0)->code;
        else
            $result.= $fw->getArrivalCity(count($fw->flights)-1)->code;
        return $result;
    }

    public function getFullDescription()
    {
        $description = array();
        if ($this->_flightVoyage==null)
        {
            if ($this->isNewRecord)
            {
                return null;
            }
            else
            {
                $element = unserialize($this->flightVoyageInfo);
                $this->_flightVoyage = $element;
            }
        }
        /** var Flight $flight */
        foreach($this->_flightVoyage->flights as $flight)
        {
            $description[] = date('d.m.Y',strtotime($flight->departureDate)) .' '.$flight->departureCity->code.' - '.$flight->arrivalCity->code;
        }
        if($this->flightBookingPassports)
        {
            foreach($this->flightBookingPassports as $passport)
            {
                $description[] = $passport->firstName.' '.$passport->lastName.' '.$passport->birthday;
            }
        }

        return $description;
    }

    //! FIXME UNUSED
    public function getSKU()
    {
        $fw = $this->getFlightVoyage();
        $result = $fw->getDepartureCity(0)->code;
        $result.= '-';
        if($fw->isRoundTrip())
            $result.= $fw->getArrivalCity(0)->code;
        else
            $result.= $fw->getArrivalCity(count($fw->flights)-1)->code;
        $result.='-'.$fw->valAirline->code;
        return $result;
    }



    public function setFlightVoyage($value)
    {
        $element = serialize($value);
        $this->_flightVoyage = $value;
        $this->price = $value->price;
        $this->flightVoyageInfo = $element;
    }

    public function setFlightBookerComponent(FlightBookerComponent &$flightBookerComponent)
    {
        $this->flightBookerComponent = &$flightBookerComponent;
    }

    public function getBillHistory() {
        $bills = Yii::app()->db->createCommand("SELECT billId from bill_flight_booking_history WHERE flightBookingId  = " . $this->id)->queryAll();
        if(!count($bills))
            return $bills;
        $ids = array();
        foreach($bills as $billRow){
            $ids[] = $billRow['billId'];
        }
        $ids = implode(",", $ids);
        $bills = Bill::model()->findAllBySql("SELECT * FROM bill WHERE id IN (" . $ids .  ")");
        return $bills;
    }
}