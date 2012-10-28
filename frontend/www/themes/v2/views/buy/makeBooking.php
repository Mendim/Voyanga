<div id="content">
        <?php $this->renderPartial('_items'); ?>
        <form method="post" id="passport_form">
            <?php if($ambigousPassports): ?>
                <?php $this->renderPartial('_ambigousPassports', array('passportForms'=>$passportForms)); ?>
            <?php else: ?>
                <?php $this->renderPartial('_simplePassport', array('passportForms'=>$passportForms)); ?>
            <?php endif;?>
            <?php $this->renderPartial('_buyer', array('model'=>$bookingForm)); ?>
            <div class="paybuyEnd">
                <div class="btnBlue" onclick="$('#passport_form').submit()">
                    <span>OK</span>
                </div>
                <div class="clear"></div>
            </div>
        </form>
		<!--=== ===-->
		<div class="payCardPal">
			&nbsp;
		</div>
		<div class="paybuyEnd">
			<div class="info">После нажатия кнопки «Купить» данные пассажиров попадут в систему бронирования, билет будет оформлен и выслан вам на указанный электронный адрес в течение нескольких минут. Нажимая «Купить», вы соглашаетесь с условиями использования, правилами IATA и правилами тарифов.</div>
			<div class="clear"></div>
		</div>
		<div class="paybuyEnd">
				<div class="btnBlue">
					<span>Забронировать</span>&nbsp;&nbsp;
					<span class="price">33 770</span> 
					<span class="rur">o</span>
					
					<span class="l"></span>
				</div>
			<div class="clear"></div>
		</div>
		<div class="paybuyEnd">
			<div class="armoring">
				<div class="btnBlue">
					<span>Бронирование</span>
					<div class="dotted"></div>
					<span class="l"></span>
				</div>
				<div class="text">
					Процесс бронирования может занять до 45 секунд...
				</div>
			</div>
			<div class="clear"></div>
		</div>
</div>