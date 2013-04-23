<?php

class UpdateStatCommand extends CConsoleCommand
{
    public function actionRun($force = false)
    {
        $criteria = new CDbCriteria();
        $criteria->order = 'id desc';
        $criteria->limit = 3000;
        if (!$force)
        {
            $criteria->condition = 'hash is null';
        }
        $orders = OrderBooking::model()->with(array(
                                                   'flightBookers' => array(
                                                       'select' => 'id, status, flightVoyageInfo'
                                                   )
                                              ))->findAll($criteria);
        echo "Total: ".sizeof($orders)."\n";
        foreach ($orders as $order)
        {
            $order->buildHash();
        }
        echo "Done\n";
    }
}
