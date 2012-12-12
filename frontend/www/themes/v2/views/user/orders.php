<?php $this->widget('zii.widgets.grid.CGridView', array(
    'id' => 'drives-grid',
    'dataProvider' => $model,
    'template' => "{pager}\n{items}\n{pager}",
    'columns' => array(
        array(
            'header' => 'Дата заказа',
            'value' => 'date("d/m/Y H:i", strtotime($data->timestamp))',
        ),
        array(
            'header' => 'Номер заказа',
            'value' => 'CHtml::link("Заказ &#8470;".$data->readableId, array("/buy/order/id/".$data->secretKey))',
            'type' => 'raw'
        )
    ),
)); ?>