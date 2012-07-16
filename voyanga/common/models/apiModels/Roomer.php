<?php
/**
 * Created by JetBrains PhpStorm.
 * User: oleg
 * Date: 05.07.12
 * Time: 17:53
 * To change this template use File | Settings | File Templates.
 */
class Roomer
{
    public $genderId;
    public $firstName;
    public $lastName;
    public $fullName;
    public $age;
    /** @var unique id of room among whole request */
    public $roomId;

    public function setFromHotelBookingPassport(HotelBookingPassport $passport)
    {
        $this->firstName = $passport->firstName;
        $this->lastName = $passport->lastName;
        $bd=new DateTime($passport->birthday);
        $dnow=new DateTime();
        $diff=$dnow->diff($bd);
        $this->age = $diff->y;
        $this->genderId = $passport->genderId;
        $this->fullName = $this->firstName.' '.$this->lastName;

    }
}
