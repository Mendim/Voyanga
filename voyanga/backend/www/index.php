<?php
defined('YII_DEBUG') or define('YII_DEBUG',true);
defined('YII_TRACE_LEVEL') or define('YII_TRACE_LEVEL',3);
header("Content-type:text/html;charset=utf-8");
// On dev display all errors
if(YII_DEBUG) {
    error_reporting(-1);
    ini_set('display_errors', true);
}

date_default_timezone_set('UTC');

chdir (dirname(__FILE__).'/../..');

$root=dirname(__FILE__).'/..';
$common=$root.'/../common';

$config='backend/config/main.php';
require_once('common/components/Yii.php');
require_once('common/components/WebApplication.php');
require_once('common/lib/global.php');
require_once('common/packages/packages.php');

Yii::createApplication('WebApplication',$config)->run();