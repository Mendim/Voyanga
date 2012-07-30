<?php
/**
 * PassportForm class
 * class for working with passort data in html forms
 * @author oleg
 *
 */
class AviaPassportForm extends BasePassportForm
{
    public $number;
    public $birthday;
    public $series;
    public $documentTypeId;
    public $countryId;
    public $genderId;

    /**
     * Declares the validation rules.
     */
    public function rules()
    {
        return CMap::mergeArray(parent::rules(), array(
            // first_name, last_name, number, birthday, document_type_id, gender_id are required
            array(
                'firstName, lastName, number, birthday, documentTypeId, genderId, countryId',
                'required'),
            // email has to be a valid birthday format
            array(
                'birthday',
                'date', 'format' => 'dd.MM.yyyy'),
            array(
                'series',
                'safe')
        ));
    }

    /**
     * Declares customized attribute labels.
     * If not declared here, an attribute would have a label that is
     * the same as its name with the first letter in upper case.
     */
    public function attributeLabels()
    {
        return CMap::mergeArray(parent::attributeLabels(), array(
            'number' => 'Номер документа',
            'birthday' => 'Дата рождения (ДД.ММ.ГГГГ)',
            'documentTypeId' => 'Тип документа',
            'genderId' => 'Пол',
            'series' => 'Серия документа',
            'countryId' => 'Гражданство')
        );
    }
}