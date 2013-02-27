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
            $inMonth = time() + 30*24*3600;
            if (strtotime($order->ttl) < $inMonth)
            {
                $order->ttl = date('Y-m-d H:i:s', $inMonth);
                if (!$order->update(array('ttl')))
                    Yii::app()->RSentryException->logException(new CException('Cannot increase ttl of link'));
            }
        }
        catch(CException $e)
        {
            throw new CHttpException(404);
        }

        $longUrl = Yii::app()->params['baseUrl'].'/share/tour/id/'.$id;
        $short = new ShortUrl();
        $short = $short->createShortUrl($longUrl);
        $short = Yii::app()->params['baseUrl'].'/'.$short;

        $this->assignTitle('tour', array('##tourTitle##' => $order->name));
        $this->layout = 'static';
        $this->render('tour', array(
            'title' => 'Я составил путешествие на Voyanga',
            'description' => $order->name,
            'tour' => $tdp->getWithAdditionalInfo($tdp->getSortedCartItemsOnePerGroup(false)),
            'orderId' => $id,
            'shortUrl' => $short
        ));
    }
}