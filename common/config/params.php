<?php

$root=realpath(dirname(__FILE__).'/../..');
Yii::setPathOfAlias('site',$root);

/**
 * Parameters shared by all applications.
 * Please put environment-sensitive parameters in params-env.php
 */
$commonParamsLocal = require('common/config/params-local.php');
$commonParamsEnv = require('common/config/environments/params-'.$commonParamsLocal['env.code'].'.php');

return CMap::mergeArray(array(

    'flight_search_cache_time' => 15*60, //seconds before show notification message for flight page + cache expiration time
    //Price factor for flight optimal
    'flight_price_factor' => 100,
    //Time factor for flight optimal
    'flight_time_factor' => 70,
    'flight_repeat_time' => 120,

    'airport_codes_cache' => 365 * 24 * 3600,

    'aPassegerTypes' => array(1 => 'ADT', 2 => 'CNN', 3 => 'INN'),
    'GDSNemo' => array(
        'wsdlUri' => 'http://109.120.157.20:10002/Flights.asmx?wsdl',
        'uri' => 'http://109.120.157.20:10002/Flights.asmx',
        'trace'   => (int)(defined(YII_DEBUG)),
        'login' => 'webdev012',
        'password' => 'HHFJGYU3*^H',
        'userId' => 15,
        'agencyWsdlUri' => 'http://sys.nemo-ibe.com/nemoflights/wsdl.php?for=',
        'agencyId' => '120',
        'agencyApiKey' => '85C46C441F08204652F2DFADC3DE05CD'
    ),
    'hotel_search_cache_time' => 60 * 60, //seconds before show notification message for hotel page + cache expiration time
    'hotel_payment_time' => 600,
    'time_for_payment' => 600,
    'hotel_repeat_time' => 120,

    'HotelBook' => array(
        'uri' => 'http://test.hotelbook.vsespo.ru/xml/',
        'login' => 'voyanga',
        'password' => 'vLP1xe',
        'room' => array(
            'DBL' => 10,
            'TWIN' => 20,
            'STD' => array(10, 12900),
        ),
        'distanceFromCityCenter' => 5000,

    ),
    'autocompleteLimit' => 10,
    'autocompleteCacheTime' => 3600,

    'cache.core'=>extension_loaded('apc') ?
		array(
			'class' => 'CApcCache',
		) :
		array(
			'class' => 'CDbCache',
			'connectionID' => 'db',
			'autoCreateCacheTable' => true,
			'cacheTableName' => 'cache',
		),
	'cache.content' => array(
		'class' => 'CDbCache',
		'connectionID' => 'db',
		'autoCreateCacheTable' => true,
		'cacheTableName' => 'cache',
	),
	
	'php.exePath' => '/usr/bin/php',

    'app.api.flightSearchUrl' => 'http://api.voyanga.com/v1/flight/search/BE',
    'app.api.hotelSearchUrl' => 'http://api.voyanga.com/v1/hotel/search',

    'hotel.markupPercentage' => 10,

    'salt' => 'ofuihnaser@#$@#Rwergvnw2342',

    'adminEmail' => 'support@voyanga.com',
    'adminEmailName' => 'Voyanga',
    'smtp.host' => 'smtp.yandex.ru',
    'smtp.username' => 'support@voyanga.com',
    'smtp.password' => 'supportteam',
    'smtp.port' => 25,

    'autoAssignCurrentOrders' => true,

), CMap::mergeArray( $commonParamsEnv, $commonParamsLocal));
