<?php

$root = dirname(__FILE__) . '/../..';
$params = require('frontend/config/params.php');
$routes = require('frontend/config/routes.php');

// We need to set this path alias to be able to use the path of alias
// some of this may not be nescessary now, as now the directory is changed to projects root in the bootstrap script
Yii::setPathOfAlias('root', $root);
Yii::setPathOfAlias('common', $root . '/common');
Yii::setPathOfAlias('backend', $root . '/common');
Yii::setPathOfAlias('www', $root . '/frontend/www');
Yii::setPathOfAlias('frontend', $root . '/frontend');
Yii::setPathOfAlias('uploads', $root . '/frontend/www/uploads');

$frontendMainLocal = file_exists('frontend/config/main-local.php') ? require('frontend/config/main-local.php') : array();

return CMap::mergeArray(
    require_once ('common/config/main.php'),
    array(
        'id' => 'frontend.voyanga.com',
        'name' => 'Voyanga',
        'basePath' => 'frontend',
        'params'  => $params,
        'language' => 'ru',
        'theme' => 'v1',
        'defaultController' => 'booking',
        'preload' => array(
            'log',
            'bootstrap'
        ),

        // autoloading model and component classes
        'import' => array(
            'site.common.extensions.*',
            'site.common.components.*',
            'site.common.models.*',
            'application.components.*',
            'application.controllers.*',
            'application.models.*',
            'application.helpers.*',
            'site.common.components.shoppingCart.*',
            'site.common.extensions.order.*',
            'site.backend.extensions.bootstrap.widgets.*',
            'site.common.extensions.yiidebugtb.*', //our extension
        ),

        'modules' => array(
            'gii' => array(
                'class' => 'system.gii.GiiModule',
                'password' => 'a1a2a3a4',
                // If removed, Gii defaults to localhost only. Edit carefully to taste.
                'ipFilters' => array(
                    '192.168.0.74',
                    '192.168.0.8',
                    '*',
                    '::1'
                )
            ),
            'gds' => array(
                'class' => 'site.common.modules.gds.GdsModule',
            ),
            'booking' => array(),
            'tour' => array(),
        ),

        // application components
        'components' => array(
            'bootstrap' => array(
                'class' => 'site.backend.extensions.bootstrap.components.Bootstrap', // assuming you extracted bootstrap under extensions
                'responsiveCss' => true,
                'debug' => true
            ),

            'user' => array(
                // enable cookie-based authentication
                'allowAutoLogin' => true
            ),

            'urlManager' => array(
                'urlFormat' => 'path',
                'showScriptName' => false,
                'rules' => $routes,
            ),

            'cache' => array(
                'class' => 'CMemCache',
                'servers' => array(
                    array(
                        'host' => 'localhost',
                        'port' => 11211,
                        'weight' => 60
                    )
                )
            ),

            'gdsAdapter' => array(
                'class' => 'GDSAdapter'
            ),

            'errorHandler' => array(
                // use 'site/error' action to display errors
                'errorAction' => 'site/error'
            ),

            'sharedMemory' => array(
                'class' => 'application.components.SharedMemory',
                'maxSize' => 2*1024*1024,
            ),

            'payments' => array(
                'class' => 'common.extensions.payments.PaymentsComponent',
                'merchantId' => '8234784606-1636',
                'password' => '9UfgieYI6vuTit12NHp1w5Ld9MSIhIph7gf8pVqrmW9mXx24WLPnJAnW8FmS8YMq2bWaeMtTYvHdfsXM',
            ),

            'hotelsRating'=>array(
                'class'=>'HotelsRatingComponent'
            ),

            'log' => array(
                'class' => 'CLogRouter',
                'routes' => array(
                    array(
                        'class' => 'CWebLogRoute',
                        'categories' => 'application, nemo',
                        'levels' => 'error, warning, trace, profile, info'
                    ),

                    array(
                        'class' => 'CFileLogRoute',
                        'levels' => 'trace, info',
                        'categories' => 'application'
                    ),
                    array(
                        'class' => 'CFileLogRoute',
                        'levels' => 'trace, info',
                        'categories' => 'nemo',
                        'logFile' => 'nemo.log'
                    ),

                    array(
                        'class' => 'CDbLogRoute',
                        'levels' => 'info',
                        'categories' => 'system.*',
                        'connectionID' => 'logdb',
                        'autoCreateLogTable' => true,
                        'logTableName' => 'log_table'
                    ),

                    array(
                        'class' => 'CProfileLogRoute',
                        'levels' => 'profile',
                        'enabled' => true
                    ),

                    array(
                        'class' => 'CEmailLogRoute',
                        'levels' => 'error, warning',
                        'emails' => 'maximov@danechka.com'
                    ),

                   array( // configuration for the toolbar
                        'class'=>'XWebDebugRouter',
                        'config'=>'alignLeft, opaque, runInDebug, fixedPos, collapsed, yamlStyle',
                        'levels'=>'error, warning, trace, profile, info',
                        //'categories' => 'HotelBookerComponent.*, application.simpleWorkflow',
                        'allowedIPs'=>array('192.168.0.8','192.168.0.74'),
                    ),
                )
            ), 
        ),
        'controllerMap' => array(
            'payments'=>array(
                'class'=>'common.extensions.payments.PaymentsTestController'
            )
        ),
    )
);