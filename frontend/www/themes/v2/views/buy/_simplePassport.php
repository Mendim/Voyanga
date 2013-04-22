<div class="oneBlock">
<!--=== ===-->
<div class="paybuyContent" id="tableStartRun">
<h2>2. <?php echo $header ?></h2>
<table class="infoPassengers">
<thead>
<?php $currentRoomId = 0; $currentRoomAdults = 0; $currentRoomChild = 0; ?>
<?php if ($roomCounters): ?>
<tr>
    <td colspan="7"><h3>Номер <?php echo $currentRoomId + 1 ?>
            : <?php echo $roomCounters[$currentRoomId]['label'] ?></h3></td>
</tr>
<tr>
    <td class="tdName">
        Имя
    </td>
    <td class="tdLasname">
        Фамилия
    </td>
    <td class="tdSex">
        Пол
    </td>
    <td class="tdBirthday">

    </td>
    <td class="tdNationality">

    </td>
    <td class="tdDocumentNumber">
    </td>
    <td class="tdDuration">
    </td>
</tr>
</thead>
<?php else: ?>
    <thead>
    <tr>
        <td class="tdName">
            Имя
        </td>
        <td class="tdLasname">
            Фамилия
        </td>
        <td class="tdSex">
            Пол
        </td>
        <td class="tdBirthday">
            <span class="tooltipClose"
                  rel="Введите дату рождения пассажира в формате ДД/ММ/ГГГГ, например 05/02/1985">Дата рождения</span>
        </td>
        <td class="tdNationality">
            Гражданство
        </td>
        <td class="tdDocumentNumber">
                    <span class="tooltipClose"
                          rel="Для перелетов по России необходим российский или загранпаспорт (для детей — свидетельство о рождении или загранпаспорт). Для зарубежных перелетов необходим загранпаспорт.">Серия и № документа</span>
        </td>
        <td class="tdDuration">
                    <span class="tooltipClose"
                          rel="Срок дейсвия документа необходимо заполнять в случае, если вы указываете в качестве типа документа загранпаспорт.">Срок действия</span>
        </td>
    </tr>
    </thead>
<?php endif ?>
<tbody>
<?php foreach ($passportForms as $i => $model): ?>
    <?php
    if ($roomCounters) {
        if (($roomCounters[$currentRoomId]['adult'] == $currentRoomAdults) and ($roomCounters[$currentRoomId]['child'] == $currentRoomChild)) {
            $currentRoomId++;
            $currentRoomAdults = 0;
        } elseif ($model instanceof FlightAdultPassportForm)
            $currentRoomAdults++; elseif ($model instanceof FlightChildPassportForm)
            $currentRoomChild++;
    }
    ?>
    <?php if ($roomCounters and ($currentRoomAdults == 0)): ?>
        <tr>
            <td colspan="7"><h3>Номер <?php echo $currentRoomId + 1 ?>
                    (<?php echo $roomCounters[$currentRoomId]['label'] ?>)</h3></td>
        </tr>
    <?php endif ?>

    <tr>
        <td class="tdName">
            <script type="text/javascript">
                $(function () {
                    $('#syncTranslitFirstName<?php echo $i ?>').syncTranslit({destination: 'syncTranslitFirstName<?php echo $i ?>'});
                    $('#syncTranslitLastName<?php echo $i ?>').syncTranslit({destination: 'syncTranslitLastName<?php echo $i ?>'});
                });
            </script>
            <?php echo CHtml::activeTextField($model, "[$i]firstName", array('id' => 'syncTranslitFirstName' . $i, 'placeholder' => 'IVAN')); ?>
        </td>
        <td class="tdLastname">
            <?php echo CHtml::activeTextField($model, "[$i]lastName", array('id' => 'syncTranslitLastName' . $i, 'placeholder' => 'PETROV')); ?>
        </td>
        <td class="tdSex hotel">
            <label class="male <?php if ($hide) echo 'inactive' ?>" for="male<?php echo $i ?>">
                <input type="radio" name="<?php echo get_class($model) ?>[<?php echo $i ?>][genderId]" id="male<?php echo $i ?>"
                       value="<?php echo BaseFlightPassportForm::GENDER_MALE?>"
                    <?php if ($model->genderId == BaseFlightPassportForm::GENDER_MALE) echo 'checked="checked"' ?>>
            </label>
            <label class="female <?php if ($hide) echo 'inactive' ?>" for="female<?php echo $i ?>">
                <input type="radio" name="<?php echo get_class($model) ?>[<?php echo $i ?>][genderId]"
                       id="female<?php echo $i ?>"
                       value="<?php echo BaseFlightPassportForm::GENDER_FEMALE?>"
                    <?php if ($model->genderId == BaseFlightPassportForm::GENDER_FEMALE) echo 'checked="checked"' ?>>
            </label>
        </td>
        <td class="tdBirthday">
            <?php if (!$roomCounters): ?>
                <div class="divInputBirthday <?php if ($hide) echo 'active' ?>">
                    <?php echo CHtml::activeTextField($model, "[$i]birthdayDay", array(
                        "placeholder" => "ДД",
                        "class" => "dd next",
                        "maxlength" => "2"
                    )); ?>
                    <?php echo CHtml::activeTextField($model, "[$i]birthdayMonth", array(
                        "placeholder" => "ММ",
                        "class" => "mm next",
                        "maxlength" => "2"
                    )); ?>
                    <?php echo CHtml::activeTextField($model, "[$i]birthdayYear", array(
                        "placeholder" => "ГГГГ",
                        "class" => "yy",
                        "maxlength" => "4"
                    )); ?>
                </div>
            <?php else: ?>
                <?php echo CHtml::activeHiddenField($model, "[$i]birthdayDay", array('value'=>'01')); ?>
                <?php echo CHtml::activeHiddenField($model, "[$i]birthdayMonth", array('value'=>'01')); ?>
                <?php echo CHtml::activeHiddenField($model, "[$i]birthdayYear", array('value'=>'1980')); ?>
            <?php endif ?>
        </td>
        <td class="tdNationality <?php if ($hide) echo "inactive" ?>">
            <?php if (!$roomCounters): ?>
                <?php if ($hide): ?>
                    <input type='text' disabled="disabled"
                           value="<?php $c = Country::model()->findByPk($model->countryId); echo CHtml::value($c, 'localRu') ?>">
                <?php else: ?>
                    <?php echo CHtml::activeDropDownList(
                        $model,
                        "[$i]countryId",
                        Country::model()->findAllOrderedByPopularity(),
                        array(
                            'data-placeholder' => "Страна...",
                            'class' => "chzn-select",
                            'style' => "width:120px;",
                        )
                    ); ?>
                <?php endif ?>
            <?php else: ?>
                <input type='hidden' name="<?php echo get_class($model)."[$i][countryId]" ?>" value="174">
            <?php endif ?>
        </td>
        <td class="tdDocumentNumber">
            <?php if (!$roomCounters): ?>
                <?php echo CHtml::activeTextField($model, "[$i]seriesNumber", array("placeholder" => "4008123456")); ?>
            <?php else: ?>
                <?php echo CHtml::activeHiddenField($model, "[$i]seriesNumber", array('placeholder' => '4008123456', 'value'=>'123')); ?>
            <?php endif ?>
        </td>
        <td class="tdDuration">
            <?php if (!$roomCounters): ?>
                <div class="divInputBirthday checkOn <?php if ($hide) echo 'active' ?>">
                    <?php echo CHtml::activeTextField($model, "[$i]expirationDay", array(
                        "placeholder" => "ДД",
                        "class" => "expiration dd next",
                        "maxlength" => "2"
                    )); ?>
                    <?php echo CHtml::activeTextField($model, "[$i]expirationMonth", array(
                        "placeholder" => "ММ",
                        "class" => "expiration mm next",
                        "maxlength" => "2"
                    )); ?>
                    <?php echo CHtml::activeTextField($model, "[$i]expirationYear", array(
                        "placeholder" => "ГГГГ",
                        "class" => "expiration yy",
                        "maxlength" => "4"
                    )); ?>
                </div>
            <?php endif; ?>
        </td>
    </tr>
    <?php if ((!$hide) && (!$roomCounters)): ?>
        <tr class="trDurationPadding">
            <td class="tdName" colspan="2">
                <input type="checkbox" data-bind="checkbox:{label: 'Есть бонусная карта<?php echo ''.($alliance ? ' '.$alliance->name.' альянса' :' авиакомпании');?>', checked: 0}">
            </td>
            <td class="tdSex"></td>
            <td class="tdBirthday"></td>
            <td class="tdNationality"></td>
            <td class="tdDocumentNumber"></td>
            <td class="tdDuration">

                <input type="hidden" value="0"
                       name="<?php echo get_class($model) ?>[<?php echo $i;?>][srok]">
                <input type="checkbox" data-bind="checkbox:{label: 'Без срока', checked: 0}"
                       name="<?php echo get_class($model) ?>[<?php echo $i;?>][srok]" id="srok<?php echo $i;?>">
            </td>
        </tr>

        <tr>
            <td class="tdBonus" colspan="7">
                <?php if($valAirline): ?>
                    <?php $model->bonusCardAirlineCode = $valAirline->code;?>
                    <div class="breakDownMenu">
                        <?php echo CHtml::activeDropDownList(
                        $model,
                        "[$i]bonusCardAirlineCode",
                        $allianceAirlines,
                        array(
                            'data-placeholder' => "Авиакомпания...",
                            'class' => "chzn-select",
                            'style' => "width:207px;",
                            'disabled' => (count($allianceAirlines) > 1 ? '' : 'disabled'),
                            'value' => $valAirline->code
                        )
                    ); ?>
                </div>
                <div class="inputBonus">
                    <input type="text" placeholder="Номер карты" name="<?php echo get_class($model) ?>[<?php echo $i;?>][bonusCard]" >
                </div>
                <?php endif; ?>


            </td>
        </tr>
    <?php else: ?>
        <tr style="display: none">
           <td colspan="7">
               <input type="hidden" value="1" name="<?php echo get_class($model) ?>[<?php echo $i;?>][srok]">
           </td>
        </tr>

    <?php endif ?>
<?php endforeach; ?>
<!-- NEW USER -->
</tbody>
</table>
</div>
<!--=== ===-->
</div>
