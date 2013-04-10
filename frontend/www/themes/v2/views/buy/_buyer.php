<div class="clear" id="paybuyContent"></div>
<div class="oneBlock">
    <!--=== ===-->
    <div class="paybuyContent">
        <h2>3. Данные покупателя</h2>
        <table class="dopInfoPassengers">
            <thead>
            <tr>
                <td>Адрес электронной почты</td>
                <td>Номер телефона</td>
                <td></td>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td class="tdEmail">
                    <?php echo CHtml::activeEmailField($model, "contactEmail", array('id' => 'contactEmail', 'placeholder' => 'example@mail.ru')); ?>
                </td>
                <td class="tdTelefon">
                    <div class="divInputTelefon <?php if ($hide) echo "inactive" ?>">

                        <?php echo CHtml::activeTextField($model, "contactPhone", array('id' => 'contactPhone', 'placeholder' => '+7 (910) 123-45-67 ')); ?>
                    </div>
                </td>
                <td class="tdText">
                    На адрес электронной почты будут высланы билеты, а по указанному номеру мы отправим смс с подтверждением
                </td>
            </tr>
            </tbody>
        </table>
    </div>
    <!--=== ===-->
</div>
