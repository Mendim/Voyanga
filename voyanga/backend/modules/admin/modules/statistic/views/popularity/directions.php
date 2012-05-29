<?php
$this->breadcrumbs=array(
	'Статистика'=>array('admin'),
	'Из города',
);

$this->beginWidget("AAdminPortlet", array(
    "menuItems" => array(
        array(
            "label" => "Обновить",
            "url" => array("flights"),
        ),
    ),
    "title" => "Статистика поисков перелётов из города ".$report->fromCity->localRu
));
?>

<?php $this->widget('bootstrap.widgets.BootGridView',array(
	'id'=>'event-grid',
	'dataProvider'=>$model->search(),
	'filter'=>$model,
    'ajaxUpdate'=>true,
	'columns'=>array(
        array(
            'header'=>'Откуда',
            'value'=>'$data->departureCity->localRu'
        ),
        array(
            'header'=>'Куда',
            'value'=>'$data->arrivalCity->localRu'
        ),
        array(
            'name'=>'value',
            'header'=>'Число поисков',
            'value'=>'$data->value'
        ),
	),
)); ?>

<?php $this->endWidget(); ?>
