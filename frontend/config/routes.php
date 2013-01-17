<?php
/*
 * Routes for CUrlManager
 */
return array(
    'land'=>'landing/countries',
    'land/hotels/<countrycode:\w+>/<citycode:\w+>'=>'landing/hotels/countryCode/<countrycode>/cityCode/<citycode>',
    'land/<countrycode:\w+>'=>'landing/country/countryCode/<countrycode>',
    'land/<countrycode:\w+>/<citycode:\w+>'=>'landing/city/countryCode/<countrycode>/cityCode/<citycode>',
    'land/<countrycode:\w+>/<citycode:\w+>/<citycodeto:\w+>'=>'landing/rtflight/countryCode/<countrycode>/cityCodeFrom/<citycode>/cityCodeTo/<citycodeto>',
    'land/<countrycode:\w+>/<citycode:\w+>/<citycodeto:\w+>/trip/OW'=>'landing/owflight/countryCode/<countrycode>/cityCodeFrom/<citycode>/cityCodeTo/<citycodeto>',
    '<controller:\w+>/<id:\d+>'=>'<controller>/view',
    '<controller:\w+>/<action:\w+>/<id:\d+>'=>'<controller>/<action>',
    '<controller:\w+>/<action:\w+>'=>'<controller>/<action>',
    '<action:(agreement_avia|agreement_hotel|iata|agreement)>' => 'site/<action>',
);