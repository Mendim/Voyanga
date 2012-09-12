<?php
/**
 * Provides user administration functions
 * @author Charles Pick
 * @package packages.users.admin
 */
class TourAdminModule extends ABaseAdminModule
{
    public $defaultController = 'constructor';

    public function init()
    {
        Yii::import('site.frontend.modules.tour.models.*');
    }

    /**
     * The menu items to show for this module.
     * These menu items will be shown in the sidebar in the admin interface
     * @see CMenu::$items
     * @var array
     */
    protected $_menuItems = array(
        array(
            "label" => "Туры",
            "url" => "#",
            "linkOptions" => array(
                "icon" => "icon-user",
            ),
            "items" => array(
                array(
                    "label" => "Конструктор",
                    "url" => array("/admin/tour/constructor/create"),
                ),
                array(
                    "label" => "Готовые",
                    "url" => array("/admin/tour/viewer/index"),
                ),
            )
        )
    );
}