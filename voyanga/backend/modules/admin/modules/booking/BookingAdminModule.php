<?php
/**
 * Provides user administration functions
 * @author Charles Pick
 * @package packages.users.admin
 */
class BookingAdminModule extends ABaseAdminModule
{
    public function init()
    {
        Yii::import('site.backend.modules.admin.modules.tour.models.*');
    }

    /**
     * The menu items to show for this module.
     * These menu items will be shown in the sidebar in the admin interface
     * @see CMenu::$items
     * @var array
     */
    protected $_menuItems = array(
        array(
            "label" => "Бронирование",
            "url" => "#",
            "linkOptions" => array(
                "icon" => "icon-user",
            ),
            "items" => array(
                array(
                    "label" => "Перелёт",
                    "url" => array("/admin/booking/flight/"),
                ),
                array(
                    "label" => "Гостиница",
                    "url" => array("/admin/booking/hotel/"),
                ),
                array(
                    "label" => "Тур",
                    "url" => array("/admin/booking/tour/"),
                ),
            )
        )
    );
}