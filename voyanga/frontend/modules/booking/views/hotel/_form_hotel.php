<?php $form=$this->beginWidget('bootstrap.widgets.BootActiveForm',array(
    //'type' =>'search',
    'id'=>'hotel-form',
    'action'=>'/booking/hotel/',
    'clientOptions' => array(
        'validateOnSubmit' => true,
    ),
    'enableAjaxValidation'=> true,
    'htmlOptions'=>array(
        'enctype' => 'multipart/form-data'
    )
)); ?>

    <?php echo $form->hiddenField($model,'cityId',array('class'=>'hotel-form-HotelForm_cityId')); ?>

    <?php echo $form->labelEx($model,'cityId'); ?>
    <?php $this->widget('bootstrap.widgets.BootTypeahead', array(
        'options'=>array(
            'items'=>10,
            'ajax' => array(
                'url' => "/ajax/cityForHotel",
                'timeout' => 5,
                'displayField' => "label",
                'triggerLength' => 2,
                'method' => "get",
                'loadingClass' => "loading-circle",
            ),
            'onselect'=>'js:function(res){console.log(res);$(".hotel-form-HotelForm_cityId").val(res.id)}',
            'matcher'=>'js:function(){return true}',
        ),
        'htmlOptions'=>array(
            'class'=>'span5 hotelFromField',
            'value'=>$cityName,
        )
    )); ?>
    <?php echo $form->error($model, 'cityId'); ?>

    <?php echo $form->datepickerRow(
        $model,
        'fromDate',
        array(
            'events'=> array(
                'changeDate'=>'js:function(ev){$(this).datepicker("hide")}'
            )
        )
    );?>

    <?php echo $form->dropDownListRow($model, 'duration', range(0,31)); ?>

    <?php $this->widget('common.widgets.rooms.Rooms', array('model' => $model, 'attribute'=>'rooms', 'form'=>$form)); ?>

    <div class="form-actions">
        <?php $this->widget('bootstrap.widgets.BootButton', array(
            'buttonType'=>'submit',
            'type'=>'primary',
            'label'=>'Поиск отеля',
            'htmlOptions'=>array('id'=>'searchHotel')
        )); ?>
    </div>

<?php $this->endWidget(); ?>