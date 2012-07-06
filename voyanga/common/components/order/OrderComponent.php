<?php
/**
 * User: Kuklin Mikhail (kuklin@voyanga.com)
 * Company: Easytrip LLC
 * Date: 04.06.12
 * Time: 16:25
 */
class OrderComponent extends CApplicationComponent
{
    public function getPositions($asJson = true)
    {
        $positions = Yii::app()->shoppingCart->getPositions();
        $result = array();
        $time = array();
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
            if ($asJson)
                $element['key'] = $position->getId();
            $result['items'][] = $element;
            unset($element);
        }
        if (sizeof($time)>0)
        {
            array_multisort($time, SORT_ASC, SORT_NUMERIC, $result['items']);
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
                    $orderHasFlightVoyage = new OrderHasFlightVoyage();
                    $orderHasFlightVoyage->orderId = $order->id;
                    $orderHasFlightVoyage->orderFlightVoyage = $saved->id;
                    $orderHasFlightVoyage->save();
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
}
