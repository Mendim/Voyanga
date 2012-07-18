<?php
/**
 * Created by JetBrains PhpStorm.
 * User: oleg
 * Date: 02.07.12
 * Time: 11:14
 * To change this template use File | Settings | File Templates.
 */
class FlightEngineAction extends CAction
{
    public function run($key)
    {
        $parts = explode('_', $key);
        $searchKey = $parts[0];
        $searchId = $parts[1];

        $flightBooker = FlightBooker::model()->findByAttributes(array('flightVoyageId'=>'flight_voyage_'.$key));
        if($flightBooker)
        {
            $flightVoyage = $flightBooker->flightVoyage;
            Yii::app()->flightBooker->flightVoyage = $flightVoyage;
        }
        else
        {
            $flightVoyage = FlightVoyage::getFromCache($searchKey, $searchId);
            if ($flightVoyage)
            {
                Yii::app()->flightBooker->flightVoyage = $flightVoyage;
            }
        }

        if(!$flightVoyage)
        {
            throw new CHttpException(500, 'Your request expired');
        }

        Yii::app()->flightBooker->book();

        $status = Yii::app()->flightBooker->current->swGetStatus()->getId();
        $actionName = 'stage'.ucfirst($status);
        if ($action = $this->getController()->createAction($actionName))
        {
            $action->execute();
        }
        else
            Yii::app()->flightBooker->$actionName();
    }
}
