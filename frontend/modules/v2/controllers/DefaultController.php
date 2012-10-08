<?php
/**
 * User: Kuklin Mikhail (kuklin@voyanga.com)
 * Company: Easytrip LLC
 * Date: 27.08.12
 * Time: 13:59
 */
class DefaultController extends CController
{
    public function actionIndex()
    {
        $events = Event::getRandomEvents();
        $eventsJsonObject = array();
        foreach ($events as $event)
            $eventsJsonObject[] = $event->getJsonObject();
        $this->render('frontend.www.themes.v2.views.default.index', array('events'=>$eventsJsonObject));
    }

    public function actionHotelInfo($cacheId, $hotelId)
    {
        $this->render('frontend.www.themes.v2.views.layouts.main');
    }
}
