<?php
if (isset($_GET['test']))
{
    var_dump($_SERVER);
    die();
}
$debug = true;
$prodServers = array('api.voyanga.com');
if ((isset($_SERVER['HTTP_HOST'])) && (in_array($_SERVER['HTTP_HOST'], $prodServers)))
    $debug = false;
defined('YII_DEBUG') or define('YII_DEBUG', $debug);
// On dev display all errors
if (YII_DEBUG)
{
    defined('YII_TRACE_LEVEL') or define('YII_TRACE_LEVEL', 3);
    error_reporting(-1);
    ini_set('display_errors', true);
}

date_default_timezone_set('Europe/Moscow');
header("Access-Control-Allow-Origin: *");

chdir(dirname(__FILE__) . '/../..');

$root = dirname(__FILE__) . '/..';
$common = $root . '/../common';

$config = 'api/config/main.php';
require_once('common/components/Yii.php');
require_once('common/components/WebApplication.php');
require_once('common/lib/global.php');
require_once('common/packages/packages.php');
require_once('common/components/shortcuts.php');

$app = Yii::createApplication('WebApplication', $config);
$app->run();
