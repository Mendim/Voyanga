<script id="avia-cheapest-result" type="text/html">
  <div class="recommended-ticket">
    <div class="ticket-items">
      <div class="ribbon-cheapest"></div>
      <div class="content">
        <div class="airlines-line">
          <img data-bind="attr: {'src': '/img/airline_logos/' + airline +'.png'}" >
          <span data-bind="text:airlineName">Россия</span>
        </div>
        <div class="date-time-city">
          <div class="start">
            <div class="date" data-bind="text: departureDayMo()">
              28 мая
            </div>
            <div class="time" data-bind="text: departureTime()">
              21:20
            </div>
            <div class="city" data-bind="text: departureCity()">Москва</div>
            <div class="airport" data-bind="text: departureAirport()">
              Домодедово
            </div>
          </div>
          <div class="how-long">
            <div class="path">
              В пути
            </div>
            <div class="ico-path" data-bind="html: recommendStopoverIco()"></div>
            <div class="time" data-bind="text: duration()">
              3 ч. 30 м.
            </div>
          </div>
          <div class="finish">
            <div class="date" data-bind="text: arrivalDayMo()">
              29 мая
            </div>
            <div class="time" data-bind="text: arrivalTime()">
              00:50
            </div>
            <div class="city" data-bind="text:arrivalCity()">Санкт-Петербург</div>
            <div class="airport" data-bind="text: arrivalAirport()">
              Пулково
            </div>
          </div>
          <div class="clear"></div>
        </div>
        <!-- END DATE -->
        <!-- ko if: stacked() -->
	<div class="other-time">
	  <div class="variation">
	    <ul class="minimize">
	      <li>
		Варианты вылета:
	      </li>
	      <!-- ko foreach: voyages -->
	      <li data-bind="css: {active: hash()==$parent.hash()}, click: $parent.chooseStacked, visible: visible">
		<input name="cheapest_stacked" type="radio"  data-bind="value: hash(), checked: $parent.hash()">
		<label><span data-bind="text:departureTime()">06:10</span></label>
	      </li>
	      <!-- /ko -->
	    </ul>
	  </div>
	  <a href="#" class="left" data-bind="css: {none: hash() == voyages[0].hash()}, click: choosePrevStacked"></a>
	  <a href="#" class="right" data-bind="css: {none: hash() == voyages[voyages.length-1].hash()}, click: chooseNextStacked"></a>
	</div>
	<!-- /ko -->
	
        <!-- ko if: roundTrip -->
        <div class="line-two-ticket">
          <span class="end"></span>
        </div>
        <div class="airlines-line">
          <img data-bind="attr: {'src': '/img/airline_logos/' + airline +'.png'}" >
          <span data-bind="text:airlineName">Россия</span>
        </div>
        <div class="date-time-city">
          <div class="start">
            <div class="date" data-bind="text: rtDepartureDayMo()">
              28 мая
            </div>
            <div class="time" data-bind="text: rtDepartureTime()">
              21:20
            </div>
            <div class="city" data-bind="text: rtDepartureCity()">
              Москва
            </div>
            <div class="airport" data-bind="text: rtDepartureAirport()">
              Домодедово
            </div>
          </div>
          <div class="how-long">
            <div class="path">
              В пути
            </div>
            <div class="ico-path" data-bind="html: rtRecommendStopoverIco()"></div>
            <div class="time" data-bind="text: rtDuration()">
              3 ч. 30 м.
            </div>
          </div>
          <div class="finish">
            <div class="date" data-bind="text: rtArrivalDayMo()">
              29 мая
            </div>
            <div class="time" data-bind="text: rtArrivalTime()">
              00:50
            </div>
            <div class="city" data-bind="text: rtArrivalCity()">
              Санкт-Петербург
            </div>
            <div class="airport" data-bind="text: rtArrivalAirport()">
              Пулково
            </div>
          </div>
          <div class="clear"></div>
        </div>
        <!-- /ko -->
        <!-- END DATE -->
	
	<!-- ko if: rtStacked() -->
	<div class="other-time">
	  <div class="variation">
	    <ul class="minimize">
	      <li>
		Варианты вылета:
	      </li>
	      <!-- ko foreach: rtVoyages() -->
	      <li data-bind="css: {active: hash()==$parent.rtHash()}, click: $parent.chooseRtStacked, visible: visible">
		<input name="cheapest_rt_stacked" type="radio"  data-bind="value: hash(), checked: $parent.rtHash()">
		<label><span data-bind="text:departureTime()">06:10</span></label>
	      </li>
	      <!-- /ko -->
	    </ul>
	  </div>
	  <a href="#" class="left" data-bind="css: {none: rtHash() == rtVoyages()[0].hash()}, click: choosePrevRtStacked"></a>
	  <a href="#" class="right" data-bind="css: {none: rtHash() == rtVoyages()[rtVoyages().length-1].hash()}, click: chooseNextRtStacked"></a>
	</div>
	
	<!-- /ko -->

        <div class="line-dashed-ticket">
          <span class="end"></span>
        </div>
        <div class="details-selecte">
          <div class="details">
            <a data-bind="click: showDetails" href="#">Подробнее<br> о перелете</a>
          </div>
          <a href="#" class="btn-cost">
            <span class="l"></span>
            <span class="text">Выбрать</span>
            <span class="price" data-bind="text: price"></span>
            <span class="rur">o</span>
          </a>
        </div>
      </div>

      <span class="lt"></span>
      <span class="rt"></span>
      <span class="lv"></span>
      <span class="rv"></span>
      <span class="bh"></span>
    </div>
</div>

<div class="prices-of-3days">
    <div class="ticket">
        <div class="one-way">
            <ul class="schedule-of-prices">
                <li>
                    <div class="price" style="bottom: 80px">-100</div>
                    <div class="chart" style="background-position: center 55px;"></div>
                    <div class="week">пн</div>
                    <div class="date">16</div>
                </li>
                <li>
                    <div class="price" style="bottom: 55px">-100</div>
                    <div class="chart" style="background-position: center 80px;"></div>
                    <div class="week">вт</div>
                    <div class="date">17</div>
                </li>
                <li>
                    <div class="price" style="bottom: 75px">-100</div>
                    <div class="chart" style="background-position: center 60px;"></div>
                    <div class="week">ср</div>
                    <div class="date">18</div>
                </li>
                <li class="active">
                    <div class="price" style="bottom: 85px">3 250</div>
                    <div class="chart" style="background-position: center 50px;"></div>
                    <div class="week">чт</div>
                    <div class="date">19</div>
                </li>
                <li>
                    <div class="price" style="bottom: 75px">-100</div>
                    <div class="chart" style="background-position: center 60px;"></div>
                    <div class="week">пт</div>
                    <div class="date">20</div>
                </li>
                <li>
                    <div class="price" style="bottom: 110px">-100</div>
                    <div class="chart" style="background-position: center 25px;"></div>
                    <div class="week">сб</div>
                    <div class="date">21</div>
                </li>
                <li>
                    <div class="price" style="top: 45px">-100</div>
                    <div class="chart" style="background-position: center 60px;"></div>
                    <div class="week">вс</div>
                    <div class="date">22</div>
                </li>
            </ul>
            <div class="month">
                Май
            </div>
        </div>
        <div class="two-way" data-bind="visible: roundTrip">
            <ul class="schedule-of-prices">
                <li>
                    <div class="price" style="bottom: 80px">-100</div>
                    <div class="chart" style="background-position: center 55px;"></div>
                    <div class="week">пн</div>
                    <div class="date">16</div>
                </li>
                <li>
                    <div class="price" style="bottom: 55px">-100</div>
                    <div class="chart" style="background-position: center 80px;"></div>
                    <div class="week">вт</div>
                    <div class="date">17</div>
                </li>
                <li>
                    <div class="price" style="bottom: 75px">-100</div>
                    <div class="chart" style="background-position: center 60px;"></div>
                    <div class="week">ср</div>
                    <div class="date">18</div>
                </li>
                <li class="active">
                    <div class="price" style="bottom: 85px">3 250</div>
                    <div class="chart" style="background-position: center 50px;"></div>
                    <div class="week">чт</div>
                    <div class="date">19</div>
                </li>
                <li>
                    <div class="price" style="bottom: 75px">-100</div>
                    <div class="chart" style="background-position: center 60px;"></div>
                    <div class="week">пт</div>
                    <div class="date">20</div>
                </li>
                <li>
                    <div class="price" style="bottom: 110px">-100</div>
                    <div class="chart" style="background-position: center 25px;"></div>
                    <div class="week">сб</div>
                    <div class="date">21</div>
                </li>
                <li>
                    <div class="price" style="top: 45px">-100</div>
                    <div class="chart" style="background-position: center 60px;"></div>
                    <div class="week">вс</div>
                    <div class="date">22</div>
                </li>
            </ul>
            <div class="month">
                Май
            </div>
        </div>

        <div class="blockText">
        	<div class="txt">Данные получены на основании поисковых запросов и могут отличаться от актуальных значений</div>
        	<div class="txtCena" style="display:none">
	        	<div class="leftFloat">
	        		Итого <span class="price">4150</span> <span class="rur">o</span>
	        	</div>
	        	<div class="rightFloat">
	        		<a class="btnLook" href="#">Посмотреть</a>
	        	</div>
	            <div class="clear"></div>
            </div>
        </div>
        <span class="lt"></span>
        <span class="rt"></span>
        <span class="lv"></span>
        <span class="rv"></span>
        <span class="th"></span>
        <span class="bh"></span>
    </div>
</div>
    <div class="clear"></div>
</script>
