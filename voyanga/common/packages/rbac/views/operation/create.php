<?php
/**
 * A view used to create new {@link AAuthOperation} models
 * @var AAuthOperation $model The AAuthOperation model to be inserted
 */

$this->breadcrumbs = array(
    'RBAC' => array('rbac/index'),
    'Операции' => array('index'),
    'Создать',
);

$this->beginWidget("AAdminPortlet", array(
    "title" => "Операции авторизации"
));
?>
<p class='info box'>Operations are the lowest level in the authorisation hierarchy, they can be assigned to roles or
    authorisation tasks. <br/>
    Operations can also represent permissions for specific URL routes, in this case the operation should have the same
    name as the URL route (always prefixed with a /)</p>
<?php echo $this->renderPartial('_form', array('model' => $model)); ?>
<?php $this->endWidget(); ?>