<?php

class Hotel extends CApplicationComponent
{
    //type for saving to basket
    const TYPE = 2;

    const STARS_ONE = 1;
    const STARS_TWO = 2;
    const STARS_THREE = 3;
    const STARS_FOUR = 4;
    const STARS_FIVE = 5;
    const STARS_UNDEFINDED = 0;

    public static $categoryIdHotelbook = array(1=>'5*',2=>'3*',3=>'4*',4=>'2*',5=>'1*',6=>'-');
    public static $categoryIdMapHotelbook = array(6=>0,5=>1,4=>2,2=>3,3=>4,1=>5);
    public static $categoryWord = array('none','one','two','three','four','five');
    public static $compereDesc = "";

    /** @var string hotelBook search identifier */
    public $searchId;

    /** @var int unique hotel id */
    public $hotelId;

    /** @var string hotel name */
    public $hotelName;

    /** @var string one hotel search result among whole search request */
    public $resultId;

    /** @var int one of STARS_* - star rating of hotel */
    public $categoryId;

    /** @var string date of hotel check in (should be 'Y-m-d') */
    public $checkIn;

    /** @var int */
    public $cityId;

    /** @var int count of nights inside hotel */
    public $duration;

    /** @var string human readable star rating */
    public $categoryName;

    /** @var string hotel address */
    public $address;

    /** @var string type of confirmation. We use only online confirmation now. */
    public $confirmation;

    /** @var float whole cost in local currency */
    public $price;

    /** @var string local hotel currency */
    public $currency;

    /** @var float cost of whole booking into RUR */
    public $rubPrice;

    /** @var int amount of apartment with same type */
    public $countNumbers = 1;

    /** @var float cost of whole booking into RUR */
    public $comparePrice;

    public $markupPrice;

    /** @var int is it special offer */
    public $specialOffer;

    /** @var string internal provider of that hotel */
    public $providerId;

    /** @var int default distance from city center */
    public $centerDistance  = PHP_INT_MAX;

    /** @var float hotel latitude */
    public $latitude;

    /** @var float hotel longtitude */
    public $longitude;

    /** @var string internal hotel code unique for each hotel provider */
    public $providerHotelCode;

    //todo: convert it to class
    /** @var array charges that we get cancelling hotel*/
    public $cancelCharges;

    /** @var int timestamp when first charge applied */
    public $cancelExpiration;

    /** @var int bitmask for hotel (1st bit for the best price) */
    public $bestMask = 0;

    /** @var HotelRoom[] */
    public $rooms;

    /** @var where do we get if from */
    public $cacheId;

    public $groupKey;

    /** @var hotel rating */
    private $_rating;

    /** @var City */
    private $_city;

    private $internalId;



    //implementation of ICartPosition
    public function getId()
    {
        return 'hotel_key'.$this->cacheId.'_'.$this->searchId.'_'.$this->resultId;
    }

    /**
     * @return float price
     */
    public function getPrice()
    {
        return DiscountManager::calculateHotelPrice($this->rubPrice);
    }

    public function getDiscountPrice()
    {
        return DiscountManager::calculateDiscountHotelPrice($this->rubPrice);
    }

    /**
     * @return float price
     */
    public function getOriginalPrice()
    {
        return $this->rubPrice;
    }

    //implementation of IOrderElement
    public function getIsValid()
    {
        $request = new HotelBookClient();
        return $request->checkHotel($this);
    }

    public function getIsPayable()
    {
        return true;
    }

    public function saveToOrderDb()
    {
        $key = $this->getId();
        $order = OrderHotel::model()->findByAttributes(array('key' => $key));
        if (!$order)
            $order = new OrderHotel();
        $order->key = $key;
        $order->checkIn = $this->checkIn;
        $order->duration = $this->duration;
        $city = City::model()->getCityByHotelbookId($this->cityId);
        $order->cityId = $city->id;
        $order->object = serialize($this);

        if ($order->save())
        {
            $this->internalId = $order->id;
            return $order;
        }
        return false;
    }

    public function saveReference($order)
    {
        $orderHasHotel = OrderHasHotel::model()->findByAttributes(array('orderId'=>$order->id, 'orderHotel'=>$this->internalId));
        if (!$orderHasHotel)
        {
            $orderHasHotel = new OrderHasHotel();
            $orderHasHotel->orderId = $order->id;
            $orderHasHotel->orderHotel = $this->internalId;
            $orderHasHotel->save();
            if (!$orderHasHotel->save())
                throw new CException(VarDumper::dumpAsString($orderHasHotel->errors));
        }
    }

    public static function getFromCache($cacheId, $hotelId, $resultId)
    {
        $request = Yii::app()->cache->get('hotelResult'.$cacheId);
        $foundHotel = false;
        if (!isset($request['hotels']))
            return false;
        foreach ($request['hotels'] as $unique=>$hotel)
        {
            if ($hotel->resultId==$resultId)
                $foundHotel = $hotel;
        }
        return $foundHotel;
    }

    public function __construct($params)
    {
        $attrs = get_object_vars($this);
        $exclude = array('rooms', 'categoryId');
        foreach($attrs as $attrName=>$attrVal)
        {
            if(!in_array($attrName, $exclude))
            {
                if(isset($params[$attrName])){
                    $this->{$attrName} = $params[$attrName];
                }
            }
        }
        if(isset($params['rooms']))
        {
            foreach($params['rooms'] as $roomParams)
            {
                if($this->specialOffer){
                    $roomParams['specialOffer'] = true;
                    if(isset($params['offerText'])){
                        $roomParams['offerText'] = $params['offerText'];
                    }
                }

                $hotelRoom = new HotelRoom($roomParams);
                $hotelRoom->providerId = $this->providerId;
                $this->rooms[] = $hotelRoom;

            }
        }
        if(isset($params['categoryId']))
        {
            $this->categoryId = isset(self::$categoryIdMapHotelbook[intval($params['categoryId'])]) ? self::$categoryIdMapHotelbook[intval($params['categoryId'])]  : self::STARS_UNDEFINDED;
        }
        if(isset($params['category']))
        {
            $this->categoryId = intval($params['category']);
            //echo "checkIn is :".$this->checkIn;
            //print_r($params);die();
        }

        if(isset($params['rating']))
        {
            $this->_rating = $params['rating'];
        }
        if($this->hotelName){
            $normName = mb_convert_case($this->hotelName,MB_CASE_TITLE, "UTF-8");
            $this->hotelName = $normName;
        }
    }

    public function addRoom($room)
    {
        if($room instanceof HotelRoom){
            $this->rooms[] = $room;
        }else{
            $hotelRoom = new HotelRoom($room);
            if($hotelRoom){
                $this->rooms[] = $hotelRoom;
            }
        }
    }

    public function addCancelCharge($cancelParams)
    {
        $params = array();
        $params['price'] = isset($cancelParams['price']) ? $cancelParams['price'] * ($this->rubPrice / $this->price) : 0;
        if(isset($cancelParams['from']))
        {
            $time = strtotime($cancelParams['from']);
            $params['fromTimestamp'] = $time;
            $params['charge'] = $cancelParams['charge'] == 'false' ? false : true;
            $params['denyChanges'] = $cancelParams['denyChanges'] == 'false' ? false : true;
            if($params['charge'] == true)
            {
                if(!$this->cancelExpiration){
                    $this->cancelExpiration = strtotime($this->checkIn);
                }
                if($this->cancelExpiration > $params['fromTimestamp'])
                {
                    $this->cancelExpiration = $params['fromTimestamp'];
                }
                $find = false;
                if($this->cancelCharges){
                    foreach($this->cancelCharges as $charge){
                        if($charge == $params){
                            $find = true;
                            break;
                        }
                    }
                }
                if(!$find)
                    $this->cancelCharges[] = $params;
            }
        }elseif(!$this->cancelCharges){

            $params['fromTimestamp'] = time();
            $params['charge'] = $cancelParams['charge'] == 'false' ? false : true;
            $params['denyChanges'] = $cancelParams['denyChanges'] == 'false' ? false : true;
            if($params['charge'] == true)
            {
                if(!$this->cancelExpiration){
                    $this->cancelExpiration = strtotime($this->checkIn);
                }
                if($this->cancelExpiration > $params['fromTimestamp'])
                {
                    $this->cancelExpiration = $params['fromTimestamp'];
                }
                $find = false;
                if($this->cancelCharges){
                    foreach($this->cancelCharges as $charge){
                        if($charge == $params){
                            $find = true;
                            break;
                        }
                    }
                }
                if(!$find)
                    $this->cancelCharges[] = $params;
            }
        }
    }

    public function getKey()
    {
        $sKey = $this->hotelId.'|'.$this->categoryId.'|'.$this->price.$this->currency.'|'.$this->providerId;
        foreach($this->rooms as $room)
            $sKey .= '|'.$room->key;

        return md5($sKey);
    }

    public function getRoomNames()
    {
        $roomNames = array();
        //foreach($this->rooms as $room)
        //    $sKey .= '|'.$room->key;

        //return md5($sKey);
    }

    public function getValueOfParam($paramName)
    {
        switch ($paramName)
        {
            case "price":
                $sVal = intval($this->price);
                break;
            case "hotelId":
                $sVal = intval($this->hotelId);
                break;
            case "categoryId":
                $sVal = intval($this->categoryId);
                break;
            case "providerId":
                $sVal = intval($this->providerId);
                break;
            case "rubPrice":
                $sVal = intval($this->rubPrice);
                break;
            case "roomSizeId":
                $sVal = intval($this->getRoomsAttributeForSort('sizeId'));
                break;
            case "roomTypeId":
                $sVal = intval($this->getRoomsAttributeForSort('typeId'));
                break;
            case "roomViewId":
                $sVal = intval($this->getRoomsAttributeForSort('viewId'));
                break;
            case "roomMealId":
                $sVal = intval($this->getRoomsAttributeForSort('mealId'));
                break;
            case "roomShowName":
                $sVal = $this->getRoomsAttributeForSort('showName');
                break;
            case "centerDistance":
                $sVal = intval($this->centerDistance);
                break;
        }
        return $sVal;
    }

    /**
     * Function need for sorting hotels by room attributes
     * @param $attrName
     */
    public function getRoomsAttributeForSort($attrName)
    {
        $ret = '';
        foreach($this->rooms as $room)
        {
            $ret .= $room->{$attrName}.'0';
        }
        return $ret;
    }

    public function getJsonObject()
    {
        /*
        public $searchId;
        public $hotelId;
        public $resultId;
        public $categoryId;
        public $checkIn;
        public $duration;
        public $categoryName;
        public $address;
        public $confirmation;
        public $price;
        public $currency;
        public $rubPrice;
        public $comparePrice;
        public $specialOffer;
        public $providerId;
        public $providerHotelCode;
        public $cancelCharges;
        public $cancelExpiration;
        */
        $ret = array(
            'key' => $this->getId(),
            'hotelId' => $this->hotelId,
            'hotelName' => $this->hotelName,
            'searchId'=>$this->searchId,
            'resultId'=>$this->resultId,
            'countNumbers'=>$this->countNumbers,
            'category'=>$this->categoryName,
            'centerDistance' => $this->centerDistance,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'currency' => $this->currency,
            'price' => $this->rubPrice,
            'rubPrice' => $this->getPrice(),
            'discountPrice' => $this->getDiscountPrice(),
            'bestMask' => $this->bestMask,
            'categoryId' => $this->categoryId,
            'checkIn' => $this->checkIn,
            'checkOut' => $this->getCheckOut(),
            'duration' => $this->duration,
            'city' => ($this->city) ? $this->city->localRu : '',
            'cityCode' => ($this->city) ? $this->city->code : '',
            'cityId' => ($this->city) ? $this->city->id : '',
            'rating' => $this->rating,
            'groupKey'=>$this->groupKey,
            'rooms' => array()
        );

        foreach ($this->rooms as $room)
        {
            $ret['rooms'][] = $room->getJsonObject();
        }
        return $ret;
    }

    public function getCheckOut()
    {
        if (!$this->checkIn)
            return null;
        if (!$this->duration)
            return null;
        $checkInInternal = DateTime::createFromFormat('Y-m-d', $this->checkIn);
        $checkOutInternal = $checkInInternal->add(new DateInterval('P'.$this->duration.'D'));
        return $checkOutInternal->format('Y-m-d');
    }

    /**
     * @return float user rating
     */
    function getRating()
    {
        return $this->_rating?$this->_rating:'-';
    }

    function setRating($val)
    {
        $this->_rating = $val;
    }

    /**
     * Return array of passports. If no passport needs so it should return false. If we need passports but they not provided return an empty array.
     * Array = array of classes derived from BasePassportForm (e.g. BaseFlightPassportForm)
     *
     * @return HotelPassportForm
     */
    public function getPassports()
    {
    }

    public function getTime()
    {
        return strtotime($this->checkIn);
    }

    public function getWeight()
    {
        return 2;
    }

    public function getMergeMetric(Hotel $otherHotel)
    {
        $metrica = 0;
        $coef = ($this->rubPrice / $otherHotel->rubPrice);
        if($coef < 1) $coef = 1/$coef;
        $metrica += $coef * 945;
        //echo "firstValue: {$metrica}";
        foreach($this->rooms as $roomKey=>$thisRoom){
            if(isset($otherHotel->rooms[$roomKey])){
                $otherRoom = $otherHotel->rooms[$roomKey];
                /*if($thisRoom->showName != $otherRoom->showName){
                    $metrica+=3000;
                    //echo "others name";
                }else{
                    $metrica= $metrica/1.1;
                }*/
                if($thisRoom->roomInfo['roomNameCanonical'] != $otherRoom->roomInfo['roomNameCanonical']){
                    $metrica+=400;
                    //echo "others name";
                }else{
                    $metrica= $metrica/1.1;
                }
                //if()
                /*if($thisRoom->sizeName != $otherRoom->sizeName){
                    $metrica+=200;
                }else{
                    $metrica= $metrica/1.1;
                }*/
                if($thisRoom->typeName != $otherRoom->typeName){
                    $metrica+=200;
                }else{
                    $metrica= $metrica/1.1;
                }
                if($thisRoom->mealName != $otherRoom->mealName){
                    $metrica+=200;
                }else{
                    $metrica= $metrica/1.1;
                }
                if($thisRoom->viewName != $otherRoom->viewName){
                    $metrica+=200;
                }else{
                    $metrica= $metrica/1.1;
                }
                if($thisRoom->roomInfo['refundable'] !== null && $otherRoom->roomInfo['refundable'] !== null){
                    if($thisRoom->roomInfo['refundable'] != $otherRoom->roomInfo['refundable']){
                        $metrica+=200;
                    }else{
                        $metrica= $metrica/1.1;
                    }
                }
                if($thisRoom->roomInfo['offer'] !== null && $otherRoom->roomInfo['offer'] !== null){
                    if($thisRoom->roomInfo['offer'] != $otherRoom->roomInfo['offer']){
                        $metrica+=200;
                    }else{
                        $metrica= $metrica/1.1;
                    }
                }
                if($thisRoom->roomInfo['breakfast'] !== null && $otherRoom->roomInfo['breakfast'] !== null){
                    if($thisRoom->roomInfo['breakfast'] != $otherRoom->roomInfo['breakfast']){
                        $metrica+=200;
                    }else{
                        $metrica= $metrica/1.1;
                    }
                }
                if($thisRoom->roomInfo['smoke'] !== null && $otherRoom->roomInfo['smoke'] !== null){
                    if($thisRoom->roomInfo['smoke'] != $otherRoom->roomInfo['smoke']){
                        $metrica+=200;
                    }else{
                        $metrica= $metrica/1.1;
                    }
                }
                if($thisRoom->roomInfo['sizeId'] !== null && $otherRoom->roomInfo['sizeId'] !== null){
                    if($thisRoom->roomInfo['sizeId'] != $otherRoom->roomInfo['sizeId']){
                        $metrica+=200;
                    }else{
                        $metrica= $metrica/1.1;
                    }
                }


            }

        }

        return $metrica;
    }

    public function getMergeMetricV2(Hotel $otherHotel)
    {
        //$same = true;

        if($this->hotelId != $otherHotel->hotelId){
            return false;
        }

        $isOtherProvider = $this->providerId != $otherHotel->providerId;

        foreach($this->rooms as $roomKey=>$thisRoom){
            if(isset($otherHotel->rooms[$roomKey])){
                $otherRoom = $otherHotel->rooms[$roomKey];
                /*if($thisRoom->showName != $otherRoom->showName){
                    $metrica+=3000;
                    //echo "others name";
                }else{
                    $metrica= $metrica/1.1;
                }*/
                if( ($thisRoom->rusNameFound && $otherRoom->rusNameFound) ){
                    if($thisRoom->showName != $otherRoom->showName){
                        //self::$compereDesc = "not same show names:".$thisRoom->showName." and ".$otherRoom->showName;
                        return false;
                    }else{
                        //more tests (DBL and Twin flag)
                        if($thisRoom->roomInfo['size'] != $otherRoom->roomInfo['size']){
                            //self::$compereDesc = "not same size:".$thisRoom->roomInfo['size']." and ".$otherRoom->roomInfo['size'];
                            return false;
                        }
                    }
                }else{
                    if($thisRoom->roomInfo['roomNameCanonical'] != $otherRoom->roomInfo['roomNameCanonical']){
                            //self::$compereDesc = "not same roomNameCanonical:".$thisRoom->roomInfo['roomNameCanonical']." and ".$otherRoom->roomInfo['roomNameCanonical'];
                            return false;
                    }
                }

                if($thisRoom->roomInfo['offer'] !== null && $otherRoom->roomInfo['offer'] !== null){
                    if($thisRoom->roomInfo['offer'] != $otherRoom->roomInfo['offer']){
                        //self::$compereDesc = "not same offer:".$thisRoom->roomInfo['offer']." and ".$otherRoom->roomInfo['offer'];

                        //Now special offer don't important. If important delete comment in 1 line down
                        //return false;
                    }else{

                    }
                }
                if($thisRoom->roomInfo['smoke'] !== null && $otherRoom->roomInfo['smoke'] !== null){
                    if($thisRoom->roomInfo['smoke'] != $otherRoom->roomInfo['smoke']){
                        //self::$compereDesc = "not same smoke:".$thisRoom->roomInfo['smoke']." and ".$otherRoom->roomInfo['smoke'];
                        return false;
                    }
                }
                if($thisRoom->roomInfo['view'] !== null && $otherRoom->roomInfo['view'] !== null){
                    if($thisRoom->roomInfo['view'] != $otherRoom->roomInfo['view']){
                        //self::$compereDesc = "not same view:".$thisRoom->roomInfo['view']." and ".$otherRoom->roomInfo['view'];
                        return false;
                    }
                }
                $thisFactor = 0;
                $otherFactor = 0;
                if($thisRoom->roomInfo['refundable'] !== null && $otherRoom->roomInfo['refundable'] !== null){
                    if($thisRoom->roomInfo['refundable'] != $otherRoom->roomInfo['refundable']){
                        //self::$compereDesc = "not same refundable:".$thisRoom->roomInfo['refundable']." and ".$otherRoom->roomInfo['refundable'];
                        if($thisRoom->roomInfo['refundable']){
                            $thisFactor++;
                        }else{
                            $otherFactor++;
                        }
                    }
                }



                $thisBreakfast = false;
                $otherBreakfast = false;
                if($thisRoom->mealName){
                    if(isset(HotelRoom::$showMealValue[$thisRoom->mealName])){
                        $thisBreakfast = HotelRoom::$showMealValue[$thisRoom->mealName];
                    }else{
                        $thisBreakfast = $thisRoom->mealName;
                    }
                }
                if($otherRoom->mealName){
                    if(isset(HotelRoom::$showMealValue[$otherRoom->mealName])){
                        $otherBreakfast = HotelRoom::$showMealValue[$otherRoom->mealName];
                    }else{
                        $thisBreakfast = $otherRoom->mealName;
                    }
                }

                if($thisBreakfast !== $otherBreakfast){
                    //self::$compereDesc = "not same meal:".$thisBreakfast." and ".$otherBreakfast;
                    //return false;
                    if(!$otherBreakfast){
                        $thisFactor++;
                    }elseif(!$thisBreakfast){
                        $otherFactor++;
                    }elseif($otherBreakfast == 'Завтрак'){
                        $thisFactor++;
                    }elseif($thisBreakfast == 'Завтрак'){
                        $otherFactor++;
                    }else{
                        return false;
                    }
                }
                if(($thisFactor > $otherFactor) && ($this->rubPrice > $otherHotel->rubPrice)){
                    return false;
                }elseif(($thisFactor < $otherFactor) && ($this->rubPrice < $otherHotel->rubPrice)){
                    return false;
                }
            }

        }

        return true;
    }

    /**
       Returns City object for given hotel
       @return City
     */
    public function getCity()
    {
        if (!$this->_city)
        {
            $this->_city = City::getCityByHotelbookId($this->cityId);
            if (!$this->_city) throw new CException(Yii::t('application', 'Hotel city not found. City with hotelbookId {city_id} not set in db.', array(
                '{city_id}' => $this->cityId)));
        }
        return $this->_city;
    }
}
