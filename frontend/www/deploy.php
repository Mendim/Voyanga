<?php
$github_ips = array('207.97.227.253', '50.57.128.197', '108.171.174.178');

if (in_array($_SERVER['REMOTE_ADDR'], $github_ips))
{
    $dir = '/home/voyanga/app/';
    exec("cd $dir && git pull && $dir/yiic migrate --interactive=0");
    echo 'Done.';
}
else
{
    header('HTTP/1.1 404 Not Found');
    echo '404 Not Found.';
    exit;
}