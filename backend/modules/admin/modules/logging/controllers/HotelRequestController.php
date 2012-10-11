<?php
/**
 * Created by JetBrains PhpStorm.
 * User: oleg
 * Date: 30.05.12
 * Time: 14:55
 * To change this template use File | Settings | File Templates.
 */
class HotelRequestController extends Controller
{
    /**
     * Displays a particular model.
     * @param integer $id the ID of the model to be displayed
     */
    public function actionView($id)
    {
        $this->render('view',array(
            'model'=>$this->loadModel($id),
        ));
    }

    /**
     * Lists all models.
     */
    public function actionIndex()
    {
        $dataProvider=new EMongoDocumentDataProvider(
            'HotelRequest',
            array(
                'criteria' => array(
                    'select' => array('requestNum', 'methodName', 'timestamp', 'requestDescription', 'executionTime')
                ),
                'sort'=>array(
                    'defaultOrder'=>'timestamp desc'
                ),
                'pagination' => array(
                    'pageSize' => 100
                )
            )
        );
        $this->render('index',array(
            'dataProvider'=>$dataProvider,
        ));
    }

    public function actionGetInfo($id)
    {
        $model = HotelRequest::model()->findByPk(new MongoID($id));
        //echo 1;die();
        $retArr = array();
        $widget = new CTextHighlighter();
        $widget->language = 'xml';
        $retArr['methodName'] = $model->methodName;
        $retArr['requestXml'] = $widget->highlight($model->requestXml);
        if(strlen($model->responseXml) < 7500)
        {
            $retArr['responseXml'] = $widget->highlight($model->responseXml);
        }else{
            $retArr['responseXml'] = htmlspecialchars($model->responseXml);
        }
        $retArr['requestUrl'] = $model->requestUrl;
        $retArr['timestamp'] = date("Y-m-d H:i:s",$model->timestamp);
        $retArr['executionTime'] = Yii::app()->format->formatNumber($model->executionTime);
        $retArr['errorDescription'] = $model->errorDescription;

        //$retArr['responseXml'] = $model->responseXml;


        //echo $model->requestXml);
        echo json_encode($retArr);die();
    }

    /**
     * Manages all models.
     */
    public function actionAdmin()
    {
        $model=new Event('search');
        $model->unsetAttributes();  // clear any default values
        if(isset($_GET['Event']))
            $model->attributes=$_GET['Event'];

        $this->render('admin',array(
            'model'=>$model,
        ));
    }

    /**
     * Returns the data model based on the primary key given in the GET variable.
     * If the data model is not found, an HTTP exception will be raised.
     * @param integer the ID of the model to be loaded
     */
    public function loadModel($id)
    {
        $model=HotelRequest::model()->findByPk(new MongoID($id));

        if($model===null)
            throw new CHttpException(404,'The requested page does not exist.');
        return $model;
    }

    /**
     * Performs the AJAX validation.
     * @param CModel the model to be validated
     */
    protected function performAjaxValidation($model)
    {
        if(isset($_POST['ajax']) && $_POST['ajax']==='event-form')
        {
            echo CActiveForm::validate($model);
            Yii::app()->end();
        }
    }

}
