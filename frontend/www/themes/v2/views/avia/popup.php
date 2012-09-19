<script id="avia-popup" type="text/html">
<div id="avia-ticket-info-popup">
            <div class="tickets-details" style="margin-left: -21px; margin-top: -23px; margin-right: -19px; margin-bottom: -15px;">
              <div class="top-head-tickets">
                <div class="date" data-bind="text: departurePopup()">
                19 мая, Пн
                </div>
                <h3>Туда</h3>
                <div class="other-time">
                  <div class="variation">
                  <!-- if: stacked() -->
                    <ul class="minimize">
                      <li>
                        Варианты вылета:
                      </li>
                      <!-- ko template: {name: 'popup-departure-choices', foreach: voyages} -->
                      <!-- /ko -->
                    </ul>
                  <!-- /ko -->
                  </div>
                </div>
              </div>
              <div class="content" data-bind="template: {name: 'avia-popup-flight', foreach: activeVoyage().parts}">
              </div>
              <!-- ko if: roundTrip -->
              <div class="middle-head-tickets">
              <div class="date" data-bind="text: rtDeparturePopup()">
                19 мая, Пн
              </div>
              <h3>Обратно</h3>

              <div class="other-time">
                <div class="variation">
              <!-- ko if:rtStacked -->
                <ul class="minimize">
                    <li>
                        Варианты вылета:
                    </li>
                    <!-- ko template: {name: 'popup-departure-choices-rt', foreach: rtVoyages()} -->

                    <!-- /ko -->
                </ul>
            <!-- /ko -->
            </div>
        </div>
    </div>
              <div class="content" data-bind="template: {name: 'avia-popup-flight', foreach: activeVoyage().activeBackVoyage().parts}">
              </div>
              <!-- /ko -->
              <hr class="lines">
              <div class="finish">
              	<div class="floatLeft">
              		<div class="back">
              			<span class="ico-back no"></span>
              			<span>Билет возвратный</span>
              		</div>
              		<div class="boxKG">
              			<span class="box">45</span>
              			<span>Норма провоза бесплатного багажа у авиакомпании Aigle Azur в экономическом классе: Багаж не должен превышать по весу 40 кг и по сумме трех измерений 158 см на человека.</span>
              		</div>
              	</div>	
              	<div class="floatRight">
	              	<span style="color:#2e333b;" class="f14 bold">Оформить</span>
	              	<a class="btn-order" href="#">
	                	<span class="cost" data-bind="text: price">63 502</span> <span class="rur f26">o</span>
	                </a>
              	</div>
              </div>
            </div>
          </div>
</script>
<script id="avia-popup-flight" type="text/html">
        <div data-bind="css: {'start-path': $index()==0, 'end-path': $index()==($length()-1)}">
            <div class="information">
                <div class="start-fly" data-bind="css: {'no-way': $index()!=0}">
                    <div class="time" data-bind="text: departureTime()">
                        9:40
                    </div>
                    <div class="icon jet"></div>
                    <div class="place">
                        <span class="city" data-bind="text: departureCity">Санкт-Петербург,</span>,
                        <span class="airport" data-bind="text: departureAirport">Пулково-2</span>
                    </div>
                </div>
                <div class="time-fly">
                    <div class="icon wait"></div>
                    <div class="info">
                        Перелет продлится <span data-bind="text: duration()">1 ч. 50 м.<span>
                    </div>
                </div>
                <div class="finish-fly" data-bind="css: {'no-way': $index()!=($length()-1)}">
                    <div class="time" data-bind="text: arrivalTime()">
                        9:40
                    </div>
                    <div class="icon jet"></div>
                    <div class="place">
                        <span class="city" data-bind="text: arrivalCity">Санкт-Петербург</span>,
                        <span class="airport" data-bind="text: arrivalAirport">Пулково-2</span>
                    </div>
                </div>
            </div>
            <div class="aviacompany">
                <img data-bind="attr: {'src': '/img/airlines/' + transportAirline +'.png'}" ><br>
                Номер рейса: <span data-bind="text: flightCode"></span>
            </div>
        </div>
        <!-- ko if: $index() < ($length() - 1) -->
        <div class="transitum">
            Пересадка: между рейсами  <span data-bind="text: stopoverText()"></span>
        </div>
        <!-- /ko -->
</script>
<!-- FIXME -->
<script id="popup-departure-choices" type="text/html">
                    <li data-bind="css: {active: hash() == $parent.hash()}, click: $parent.chooseStacked">
                        <!-- FIXME Why this is radio? -->
                        <input type="radio" name="radio01" id="name01" checked="checked">
                        <label for="name01"><span data-bind="text:departureTime()">06:10</span></label>
                    </li>
</script>
<script id="popup-departure-choices-rt" type="text/html">
                    <li data-bind="css: {active: hash() == $parent.rtHash()}, click: $parent.chooseRtStacked">
                        <!-- FIXME Why this is radio? -->
                        <input type="radio" name="radio01" id="name01" checked="checked">
                        <label for="name01"><span data-bind="text:departureTime()">06:10</span></label>
                    </li>
</script>
