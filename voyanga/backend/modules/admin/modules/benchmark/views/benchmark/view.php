<?php
/**
 * Displays information for a particular {@link ABenchmark} model
 * @var ABenchmark $model The ABenchmark model to show
 * @var CActiveDataProvider $dataProvider the data provider containing the results
 */
$this->breadcrumbs = array(
    'Benchmarks' => array('index'),
    $model->getUrl(),
);
$this->beginWidget("AAdminPortlet", array(
    "menuItems" => array(
        array(
            "label" => "Run",
            "url" => array("/admin/benchmark/benchmark/run", "id" => $model->id),
        ),
        array(
            "label" => "Edit",
            "url" => array("/admin/benchmark/benchmark/update", "id" => $model->id),
        ),
        array(
            "label" => "Delete",
            "url" => "#",
            'linkOptions' => array(
                'class' => 'delete',
                'submit' => array('delete', 'id' => $model->id),
                'confirm' => 'Are you sure you want to delete this item?'
            ),
        )
    ),
    "title" => "Benchmark: " . $model->getUrl(),
));
?>


<?php $this->widget('bootstrap.widgets.BootDetailView', array(
    'data' => $model,
    'attributes' => array(
        'url',
        'route',
        array(
            'value' => print_r($model->params, true),
            'name' => 'params',
        )

    ),
));

$rpsData = array();
$loadData = array();
$sparklines = array();
$seriesLabels = array();
$today = date("Y-m-d");
foreach (array_reverse($dataProvider->getData()) as $result)
{
    $rpsData[] = (float)$result->requestsPerSecond;
    $loadData[] = (float)$result->finalLoadAverage;
    $timeAdded = strtotime($result->timeAdded);
    if (date("Y-m-d", $timeAdded) == $today)
    {
        $seriesLabels[] = Yii::app()->format->time($timeAdded);
    }
    else
    {
        $seriesLabels[] = Yii::app()->format->date($timeAdded);
    }

}

$this->widget("packages.plotcharts.APlotChartWidget",
    array(
        "data" => array($rpsData, $loadData),
        "plugins" => array(
            "canvasTextRenderer",
            "canvasAxisTickRenderer",
            "canvasAxisLabelRenderer",
            "categoryAxisRenderer",
        ),
        "options" => array(
            "title" => "Page Performance",
            "axesDefaults" => array(
                "tickRenderer" => "js:jQuery.jqplot.CanvasAxisTickRenderer",
                "tickOptions" => array(
                    "angle" => -45,
                )
            ),
            "series" => array(
                array(
                    "label" => "Requests Per Second<br />(higher is better)<br /><br />"
                ),
                array(
                    "label" => "System Load<br />(lower is better)<br /><br />",
                    "yaxis" => "y2axis",
                )
            ),
            "legend" => array(
                "show" => true,
                "location" => "nw",
            ),
            "axes" => array(
                "xaxis" => array(
                    "ticks" => $seriesLabels,
                    "renderer" => "js:jQuery.jqplot.CategoryAxisRenderer",

                ),
                "yaxis" => array(
                    "label" => "Requests Per Second",
                    "labelRenderer" => "js:jQuery.jqplot.CanvasAxisLabelRenderer",
                ),
                "y2axis" => array(
                    "tickOptions" => array(
                        "showGridline" => false,
                    ),
                    "label" => "System Load",
                    "labelRenderer" => "js:jQuery.jqplot.CanvasAxisLabelRenderer",
                )
            ),
        )
    ));

$this->widget('bootstrap.widgets.BootGridView', array(
    'id' => 'abenchmark-result-grid',
    'type' => 'striped',
    'dataProvider' => $dataProvider,
    'columns' => array(

        'concurrency',
        'requestsPerSecond',
        'duration',
        'completedRequests',
        'failedRequests',
        'totalTransferred',
        'timePerRequest',
        'longestRequest',
        'transferRate',
        'timeAdded'
    )
));
$this->endWidget();
?>