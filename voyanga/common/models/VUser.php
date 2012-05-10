<?php
/**
 * User: Kuklin Mikhail (kuklin@voyanga.com)
 * Company: Easytrip LLC
 * Date: 10.05.12
 * Time: 12:08
 */
class User extends AUser
{
    /**
     * Returns the static model of the specified AR class.
     * @param string $className active record class name.
     * @return Route the static model class
     */
    public static function model($className=__CLASS__)
    {
        return parent::model($className);
    }

    public function tableName()
    {
        return 'user';
    }

    public function attributeLabels()
    {
        return array(
            'name' => Yii::t('admin', 'Имя'),
            'password' => Yii::t('admin', 'Пароль'),
            'email' => Yii::t('admin', 'e-mail'),
        );
    }
}
