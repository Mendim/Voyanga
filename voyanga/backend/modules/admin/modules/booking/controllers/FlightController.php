<?php
/**
 * User: Kuklin Mikhail (kuklin@voyanga.com)
 * Company: Easytrip LLC
 * Date: 20.06.12
 * Time: 13:00
 */
class FlightController extends ABaseAdminController
{
    public function actionIndex()
    {
        $flightForm = new FlightForm;
        $this->render('index', array('flightForm'=>$flightForm));
    }
}
