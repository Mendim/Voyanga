<?php
/**
 * User: Kuklin Mikhail (kuklin@voyanga.com)
 * Company: Easytrip LLC
 * Date: 12.12.12
 * Time: 9:17
 */
class UserController extends CController
{
    public $layout = 'static';

    public function filters()
    {
        return array(
            'accessControl', // perform access control for CRUD operations
        );
    }

    public function accessRules()
    {
        return array(
            array('allow', 'actions' => array('createTestUser', 'newPassword', 'login')),
            array('allow', 'actions' => array('orders', 'logout'), 'users' => array('@')),
            array('deny'),
        );
    }

    public function actionCreateTestUser($email)
    {
        /* add demo users */
        $demoUser = new FrontendUser();
        $demoUser->username = "mihan007";
        $demoUser->email = $email;
        $password = $email . '123';
        $demoUser->password = $password;
        $demoUser->save();
        echo 'Ошибки:';
        VarDumper::dump($demoUser->errors);
        if (sizeof($demoUser->errors) == 0)
        {
            echo '<h1>Новый пользователь успешно создан</h1>';
            echo '<h2>Логин:' . $email . '</h2>';
            echo '<h2>Пароль:' . $password . '</h2>';
        }
    }

    public function actionNewPassword($key = false)
    {
        if ($key)
        {
            $user = FrontendUser::model()->findByAttributes(array('recover_pwd_key' => $key));
            if (($user) && (time() < strtotime($user->recover_pwd_expiration)))
            {
                $model = new NewPasswordForm();
                if (isset($_POST['NewPasswordForm']))
                {
                    $model->attributes = $_POST['NewPasswordForm'];
                    if ($model->validate())
                    {
                        $user->password = $model->password;
                        $user->recover_pwd_key = '';
                        $user->recover_pwd_expiration = date('Y-m-d h:i:s', time() - 1);
                        if ($user->save())
                            Yii::app()->user->setFlash('success', 'Вы успешно изменили ваш пароль и теперь можете войти на сайт, используя его.');
                        else
                            $model->addErrors($user->errors);
                    }
                }
                $this->render('newPassword', array('model' => $model));
            }
            else
            {
                throw new CHttpException(404, 'Not found or this link already expired');
            }
        }
        else
        {
            $model = new ForgotPasswordForm();
            if (isset($_POST['ForgotPasswordForm']))
            {
                $model->attributes = $_POST['ForgotPasswordForm'];
                if ($model->validate())
                {
                    $user = FrontendUser::model()->findByAttributes(array('email' => $model->email));
                    if ($user)
                    {
                        Yii::app()->user->setFlash('success', 'Вы получите письмо с инструкциями как восстановить ваш пароль.');
                        EmailManager::sendRecoveryPassword($user);
                        $this->refresh();
                    }
                    else
                        $model->addError('email', 'Email address not found');
                }
            }
            $this->render('recoveryPassword', array('model' => $model));
        }
    }

    public function actionOrders()
    {
        echo 'Тут будут заказы';
    }

    /**
     * Displays the login page
     */
    public function actionLogin()
    {
        $model = new LoginForm;

        // if it is ajax validation request
        if (isset($_POST['ajax']) && $_POST['ajax'] === 'login-form')
        {
            echo CActiveForm::validate($model);
            Yii::app()->end();
        }

        // collect user input data
        if (isset($_POST['LoginForm']))
        {
            $model->attributes = $_POST['LoginForm'];
            // validate user input and redirect to the previous page if valid
            if ($model->validate() && $model->login())
                $this->redirect(Yii::app()->user->returnUrl);
        }
        // display the login form
        $this->render('login', array('model' => $model));
    }

    /**
     * Logs out the current user and redirect to homepage.
     */
    public function actionLogout()
    {
        Yii::app()->user->logout();
        $this->redirect('/');
    }
}
