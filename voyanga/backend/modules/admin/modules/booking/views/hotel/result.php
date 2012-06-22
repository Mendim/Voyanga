<?php
/**
 * A view used to create new {@link User} models
 * @var User $model The User model to be inserted
 */

$this->breadcrumbs = array(
    'Бронирование'=>array('/admin/booking/'),
    'Гостиница'=>array('/admin/booking/hotel'),
    'Поиск'
);

$this->beginWidget("AAdminPortlet",
    array(
        "sidebarMenuItems" => $items,
        "title" => "Поиск гостиницы"
    ));
?>

<?php echo $this->renderPartial('_form_hotel', array('model'=>$hotelForm, 'autosearch'=>$autosearch, 'cityName'=>$cityName)); ?>
<a href='#result' class="result-hotel-link" style="display: none">Результаты поиска</a>
<h3 id='result'>Результаты поиска</h3>
<?php echo $this->renderPartial('_hotels', array('results'=>$results, 'variable'=>'hotelResults')); ?>
<?php
$this->endWidget(); ?>
<?php Yii::app()->clientScript->registerScript('smooth-scroll', "
$('.result-hotel-link').trigger('click');
", CClientScript::POS_READY); ?>