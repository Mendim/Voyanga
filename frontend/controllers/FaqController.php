<?php
/**
 * Created by JetBrains PhpStorm.
 * User: oleg
 * Date: 12.11.12
 * Time: 16:14
 * To change this template use File | Settings | File Templates.
 */
class FaqController extends FrontendController
{
    public function actionIndex()
    {
        $this->assignTitle('faq');
        $this->layout = 'static';
        $this->render('faq');
    }
}
