<?php
/**
 * Created by JetBrains PhpStorm.
 * User: mihan007
 * Date: 26.02.13
 * Time: 22:43
 * To change this template use File | Settings | File Templates.
 */

class ShareController extends FrontendController
{

    public function actionTour($id)
    {
        try
        {
            $tdp = new TripDataProvider();
            $order = $tdp->restoreFromDb($id);
        }
        catch(CException $e)
        {
            throw new CHttpException(404);
        }

        $this->assignTitle('tour', array('##tourTitle##' => $order->name));
        $this->layout = 'static';
        $this->render('tour', array(
            'title' => 'Я составил путешествие на Воянге',
            'description' => $order->name,
            'tour' => $tdp->getWithAdditionalInfo($tdp->getSortedCartItemsOnePerGroup(false))
        ));
    }
}