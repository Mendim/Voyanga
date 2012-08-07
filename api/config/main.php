<?php

$root = dirname(__FILE__) . '/../..';
$params = require('api/config/params.php');
$routes = require('api/config/routes.php');

// We need to set this path alias to be able to use the path of alias
// some of this may not be nescessary now, as now the directory is changed to projects root in the bootstrap script
Yii::setPathOfAlias('root', $root);
Yii::setPathOfAlias('common', $root . '/common');
Yii::setPathOfAlias('www', $root . '/api/www');
Yii::setPathOfAlias('backend', $root . '/backend');
Yii::setPathOfAlias('frontend', $root . '/frontend');
Yii::setPathOfAlias('api', $root . '/api');


$backendMainLocal = file_exists('api/config/main-local.php') ? require('api/config/main-local.php') : array();

return CMap::mergeArray(
    require_once ('common/config/main.php'),
    array(
        'id' => 'api.voyanga.com',
        'name' => 'Voyanga',
        'basePath' => 'api',
        'params' => $params,
        'language' => 'ru',

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
        ),

        'modules' => array(
            'v1' => array(
                'class' => 'application.modules.v1.VersionOneModule',
                'modules' => array(
                    'avia',
                    'hotel',
                    'tour'
                )
            )
        ),

        // application components
        'components' => array(
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

            'errorHandler' => array(
                // use 'site/error' action to display errors
                'errorAction' => 'error/default'
            ),

            'log' => array(
                'class' => 'CLogRouter',
                'routes' => array(
                    array(
                        'class' => 'CWebLogRoute',
                        'levels' => 'error, warning',
                        'categories' => 'application',
                        'levels' => 'error, warning, trace, profile, info'
                    ),

                    array(
                        'class' => 'CFileLogRoute',
                        'levels' => 'trace, info',
                        'categories' => 'application.*'
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
                        'emails' => 'backend-reports@voyanga.com'
                    )
                )
            ),

            'urlManager' => array(
                'urlFormat' => 'path',
                'showScriptName' => false,
                'rules' => $routes,
            ),
        ),
    )
);