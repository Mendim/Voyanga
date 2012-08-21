<?php
/**
 * Created by JetBrains PhpStorm.
 * User: oleg
 * Date: 13.06.12
 * Time: 17:29
 * To change this template use File | Settings | File Templates.
 */
class HotelRoom extends CApplicationComponent
{
    /*
     * [Room] => SimpleXMLElement#37
                    (
                        [@attributes] => array
                        (
                            'roomSizeId' => '2'
                            'roomSizeName' => 'DBL'
                            'roomTypeId' => '1'
                            'roomTypeName' => 'STD'
                            'roomViewId' => '1'
                            'roomViewName' => 'ROH'
                            'roomNumber' => '1'
                            'mealId' => '2'
                            'mealName' => 'Завтрак'
                            'mealBreakfastId' => '25'
                            'mealBreakfastName' => ''
                            'child' => '1'
                            'cots' => '0'
                            'sharingBedding' => 'false'
                        )
                        [ChildAge] => '6'
                    )
     */
    public static $roomSizeRoomTypesMap = array(1 => array(1), 2 => array(2, 3), 3 => array(5), 4 => array(6));
    /** @var array mapping from Hotel Book size id to amount of adults into apt */
    public static $roomSizeIdCountMap = array(1=>1,2=>2,3=>2,4=>1,5=>3,6=>4,7=>1,8=>2);
    public $sizeId;
    public $sizeName;
    public $typeId;
    public $typeName;
    public $viewId;
    public $viewName;
    public $mealId;
    public $mealName;
    public $mealBreakfastId;
    public $mealBreakfastName;
    public $roomName;
    public $sharingBedding;
    public $cotsCount;
    public $childCount;
    public $childAges = array();

    public function __construct($params)
    {
        $attrs = get_object_vars($this);
        foreach($attrs as $attrName=>$attrVal){
            if(isset($params[$attrName])){
                $this->{$attrName} = $params[$attrName];
            }
        }
    }

    public function getAdults()
    {
        return self::$roomSizeIdCountMap[$this->sizeId];
    }

    public function getKey()
    {
        return $this->sizeId.'|'.$this->typeId.'|'.$this->viewId.'|'.$this->mealId.'|'.$this->mealBreakfastId.'|'.$this->sharingBedding.'|'.$this->childCount.'|'.$this->cotsCount;
    }

    public function getJsonObject()
    {
        /*
        public $sizeId;
        public $sizeName;
        public $typeId;
        public $typeName;
        public $viewId;
        public $viewName;
        public $mealId;
        public $mealName;
        public $mealBreakfastId;
        public $mealBreakfastName;
        public $sharingBedding;
        public $cotsCount;
        public $childCount;
        public $childAges = array();
       */
        $ret = array('size' => $this->sizeName,
            'type'=>$this->typeName,
            'view'=>$this->viewName,
            'meal'=>$this->mealName,
            'mealBreakfast' => $this->mealBreakfastName,
            'cotsCount' => $this->cotsCount,
            'childCount' => $this->childCount,
            'childAges' => $this->childAges
        );

        return $ret;
    }

    /**
     * @static
     * @param $str
     * @param $words
     * @return bool
     */
    public static function stripWords(&$str,$words){
        //$replaced = false;
        $startLen = mb_strlen($str);

        $str = str_replace($words,'',$str);

        $endLen = mb_strlen($str);

        return ($endLen < $startLen);
    }

    /**
     * @static
     * @param $str
     * @param $words
     * @return bool
     */
    public static function findWords($str,$words){
        $find = false;
        if(is_array($words))
        {
            foreach($words as $word){
                if(mb_strpos($str,$word) !== false){
                    $find = true;
                    break;
                }
            }
        }
        elseif(is_string($words))
        {
            if(mb_strpos($str,$words) !== false){
                $find = true;
            }
        }

        return $find;
    }

    public static function parseRoomName($roomName){
        $roomInfo = array(
            'sizeId'=>null,
            'typeId'=>null,
            'typeName'=>null,
            'view'=>null,
            'breakfast'=>null,
            'refundable'=>null,
            'roomNameCanonical'=>null
        );
        /* TODO: функцию можно сильно ускорить если разбить всю roomName на слова,
         * и вначале проверять на налчие того, или иного слова
         * */
        $roomName = mb_convert_case($roomName, MB_CASE_LOWER, "UTF-8");
        /*if(self::stripWords($roomName,array(' standard','standard'))){

        }*/
       /* if(self::stripWords($roomName,array(' 1 bedroom',' one bedroom'))){

        }*/
        self::stripWords($roomName,array(' room'));
        //self::stripWords($roomName,array(' classic','classic',' offer',' offer-','offer','offer-'));


        if(self::findWords($roomName,array(' 2 bedroom',' two bedroom',' 3 bedroom'))){
            $roomInfo['typeName'] = 'suite senior';
        }
        if(self::findWords($roomName,array(' 2 people',' capacity 2',' dbl', ' double','dbl','double',' twin','twin'))){
            $roomInfo['sizeId'] = 2;
        }
        if(self::stripWords($roomName,array(' non refundable',' non-refundable','non refundable','standard-non-refundable','non-refundable','not refundable','not-refundable'))){
            $roomInfo['refundable'] = false;
        }
        if(self::stripWords($roomName,array(' refundable','refundable'))){
            $roomInfo['refundable'] = true;
        }
        $roomName = str_replace('apartments','apartment',$roomName);
        if(self::findWords($roomName,array('deluxe','de luxe'))){
            $roomInfo['typeName'] = 'deluxe';
        }
        if(self::stripWords($roomName,array(' seaview',' sea view','seaview','sea view'))){
            $roomInfo['view'] = 'sea';
        }
        if(self::findWords($roomName,'view')){
            $views = array(
                'ocean',
                'pyramid',
                'nile',
                'city',
                'canal',
                'park',
                'lagoon',
                'river',
                'garden',
                'castle',
                'pool',
                'acropolis'
            );
            foreach($views as $view){
                if(self::stripWords($roomName,array(' '.$view.'view',$view.' view'))){
                    $roomInfo['view'] = $view;
                    break;
                }
            }
        }
        if(self::stripWords($roomName,array(' + breakfast',' +breakfast',' with breakfast','+breakfast','breakfast'))){
            $roomInfo['breakfast'] = 'breakfast';
        }

        if(self::findWords($roomName,array('studio'))){
            $roomInfo['typeName'] = 'studio';
        }
        if(self::findWords($roomName,'junior suite')){
            $roomInfo['typeName'] = 'junior suite';
        }
        $roomInfo['roomNameCanonical'] = $roomName;
        return $roomInfo;
    }
}
