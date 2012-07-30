<?php
/**
 * A view used to update {@link AAuthRole} models
 * @var AAuthRole $model The AAuthRole model to be updated
 */

$this->breadcrumbs = array(
    'RBAC' => array('rbac/index'),
    'Роли' => array('index'),
    $model->name => array('view', 'slug' => $model->slug),
    'Редактировать',
);

$this->beginWidget("AAdminPortlet",
    array(

        "title" => "Edit Authorisation Role: " . $model->name,
        "menuItems" => array(
            array(
                "label" => "View",
                "url" => array("/admin/rbac/role/view", "slug" => $model->slug),
            ),
            array(
                "label" => "Delete",
                "url" => "#",
                'linkOptions' => array(
                    'class' => 'delete',
                    'submit' => array('delete', 'slug' => $model->slug),
                    'confirm' => 'Are you sure you want to delete this item?'
                ),
            )
        )
    ));
?>
<?php echo $this->renderPartial('_form', array('model' => $model)); ?>
<?php
$this->endWidget();
?>