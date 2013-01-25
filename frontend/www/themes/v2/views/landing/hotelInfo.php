<div class="center-block" data-bind="template: {name: activeView(), data: viewData(), afterRender: contentRendered}">
<div class="main-block" style="width: 935px; margin-left: auto; margin-right: auto;">
<div id="content" data-bind="template: {name: 'hotels-info-inner', data: $data}" style="width: 935px;">
<div class="title hotel">
    <h1 data-bind="text: hotelName">Максима Заря</h1>

    <div class="rating" data-bind="visible: rating" style="display: none;">
        <div class="textRating" onmouseover="ratingHoverActive(this)" onmouseout="ratingHoverNoActive(this)">
            <span class="value" data-bind="text: rating">0</span>
            <span class="text" data-bind="html: ratingName">рейтинг<br>отеля</span>
        </div>
        <div class="descrRating">
            <strong>4.5 из 5 баллов</strong>
            Рейтинг построен на основе анализа данных о качестве отеля и отзывах его посетителей.
        </div>
    </div>


    <div class="stars three" data-bind="attr: {'class': 'stars ' + stars}"></div>

    <div class="clear"></div>
</div>

<div class="place-buy">
    <div class="street" data-bind="text: address">Гостиничная улица, 4, корпус 9</div>
    <ul class="tmblr">
        <li class="active" id="hotel-info-tumblr-description"><span class="ico-descr"></span> <a href="#descr" data-bind="click: showDescriptionInfo">Описание</a></li>
        <li id="hotel-info-tumblr-map"><span class="ico-see-map"></span> <a href="#map" data-bind="click: showMapInfo">На карте</a></li>
    </ul>
    <div class="book">
        <div class="how-cost">
            от <span class="cost" data-bind="text: cheapestSet.pricePerNight">4389</span><span class="rur f21">o</span> / ночь
        </div>
        <a class="pressButton" href="#" data-bind="click:select, css: {selected: cheapestSet.resultId == activeResultId()}"><span class="l"></span><span class="text" data-bind="text: selectText">Забронировать</span></a>
    </div>
</div>
<!-- DESCR -->
<div class="descr" id="descr">
    <div class="left">
        <div class="right">
            <div class="map-hotel">
                <img src="http://maps.googleapis.com/maps/api/staticmap?zoom=13&amp;size=310x259&amp;maptype=roadmap&amp;markers=icon:http://test.voyanga.com/themes/v2/images/pin1.png%7Ccolor:red%7Ccolor:red%7C%7C55.84370040893555,37.58089828491211&amp;sensor=false" data-bind="attr:{src: smallMapUrl()}">
            </div>
            Отель расположен в <span data-bind="text: distanceToCenter">11</span> км от центра
        </div>
        <!-- ko if: numPhotos > 0 -->
        <div class="photo-slide-hotel">
            <ul data-bind="foreach: photos,photoSlider: photos">
                <li><a href="http://hotelbook.ru/photos/118/118/4/37/1296463b.jpg" class="photo" data-bind="attr:{href: largeUrl,'data-photo-index': $index()},click: $parent.showPhoto" data-photo-index="0"><img src="http://hotelbook.ru/photos/118/118/4/37/1296463b.jpg" data-bind="attr:{src: largeUrl}"></a></li>

                <li><a href="http://hotelbook.ru/photos/118/118/4/37/1296464b.jpg" class="photo" data-bind="attr:{href: largeUrl,'data-photo-index': $index()},click: $parent.showPhoto" data-photo-index="1"><img src="http://hotelbook.ru/photos/118/118/4/37/1296464b.jpg" data-bind="attr:{src: largeUrl}"></a></li>

                <li><a href="http://hotelbook.ru/photos/118/118/4/37/1296465b.jpg" class="photo" data-bind="attr:{href: largeUrl,'data-photo-index': $index()},click: $parent.showPhoto" data-photo-index="2"><img src="http://hotelbook.ru/photos/118/118/4/37/1296465b.jpg" data-bind="attr:{src: largeUrl}"></a></li>

                <li><a href="http://hotelbook.ru/photos/118/118/4/37/1296466b.jpg" class="photo" data-bind="attr:{href: largeUrl,'data-photo-index': $index()},click: $parent.showPhoto" data-photo-index="3"><img src="http://hotelbook.ru/photos/118/118/4/37/1296466b.jpg" data-bind="attr:{src: largeUrl}"></a></li>

                <li><a href="http://hotelbook.ru/photos/118/118/4/37/1296467b.jpg" class="photo" data-bind="attr:{href: largeUrl,'data-photo-index': $index()},click: $parent.showPhoto" data-photo-index="4"><img src="http://hotelbook.ru/photos/118/118/4/37/1296467b.jpg" data-bind="attr:{src: largeUrl}"></a></li>

                <li><a href="http://hotelbook.ru/photos/118/118/4/37/1296468b.jpg" class="photo" data-bind="attr:{href: largeUrl,'data-photo-index': $index()},click: $parent.showPhoto" data-photo-index="5"><img src="http://hotelbook.ru/photos/118/118/4/37/1296468b.jpg" data-bind="attr:{src: largeUrl}"></a></li>

                <li><a href="http://hotelbook.ru/photos/118/118/4/37/1296469b.jpg" class="photo" data-bind="attr:{href: largeUrl,'data-photo-index': $index()},click: $parent.showPhoto" data-photo-index="6"><img src="http://hotelbook.ru/photos/118/118/4/37/1296469b.jpg" data-bind="attr:{src: largeUrl}"></a></li>

                <li><a href="http://hotelbook.ru/photos/118/118/4/37/1296470b.jpg" class="photo" data-bind="attr:{href: largeUrl,'data-photo-index': $index()},click: $parent.showPhoto" data-photo-index="7"><img src="http://hotelbook.ru/photos/118/118/4/37/1296470b.jpg" data-bind="attr:{src: largeUrl}"></a></li>

                <li><a href="http://hotelbook.ru/photos/118/118/4/37/1296471b.jpg" class="photo" data-bind="attr:{href: largeUrl,'data-photo-index': $index()},click: $parent.showPhoto" data-photo-index="8"><img src="http://hotelbook.ru/photos/118/118/4/37/1296471b.jpg" data-bind="attr:{src: largeUrl}"></a></li>
            </ul><div class="left-navi" style="display: none;"></div><div class="right-navi" style=""></div>
            <div class="photoNumb">Фотографии предоставлены отелями.</div>
        </div>
        <!-- /ko -->
        <div class="descr-text">
            <h3>Описание отеля</h3>
            <div class="text">
                <span data-bind="html: limitDesc.startText">Гостиница Максима Заря - одна из самых известных трехзвездочных гостиниц в Москве. Основанная в 1956 году, после капитальной реконструкции она входит в состав сети</span>
                <span data-bind="visible: limitDesc.isBigText &amp;&amp; showMoreDesc()">...</span>
            <span class="endDesc" data-bind="html: limitDesc.endText" style="display: none"> "Максима Хотелс" (Maxima Hotels) с 2004 года. Гостиница Максима Заря удобно расположена недалеко от центра в тихом и экологически чистом районе рядом с Останкинским парком и его ближайшими городскими достопримечательностями - ВВЦ, дворцом графа Шереметьева, Ботаническим садом, усадьбой Останкино, Останкинской телебашней. Путь до гостиницы "Максима Заря" от любого из вокзалов Москвы займет около получаса на автомобиле, от аэропортов Шереметьево и Домодедово - около сорока минут.<br>
одноместные и двухместные, бизнес-класс, люксы и полулюксы. Номера высших категорий имеют особый дизайн. Внешний вид и внутреннее устройство любого номера рассчитаны на самое комфортное пребывание в гостинице в любое время года. Особого внимания заслуживает оригинальное дизайнерское исполнение номера люкс, который оформлен в виде каюты морского лайнера.<br>
прачечная и химчистка, мини-бар в номере, платное телевидение, бесплатный WI-FI, вызов такси, заказ билетов на зрелищные мероприятия, доставка корреспонденции, визовая поддержка, камера хранения и сейфы, ресторан русской и европейской кухни, лобби-бар, конференц-зал, бизнес-центр и многое другое. Особая философия гостеприимства, качественное и внимательное отношение персонала сделает пребывание в гостинице Максима Заря комфортным и незабываемым.</span>
            </div>
            <a href="#" class="read-more" data-bind="visible: limitDesc.isBigText,click: readMore,text: showMoreDescText">Подробнее</a>
        </div>
    </div>
</div>
<!-- END DESCR -->
<!-- MAP -->
<div class="descr" id="map" style="display: none">
    <div class="map-big" id="hotel-info-gmap">
    </div>
    Отель расположен в <span data-bind="text: distanceToCenter">11</span> км от центра
</div>
<!-- END MAP -->
<!-- INFO TRIP -->
<div class="info-trip">




<!-- ko if: false --><!-- /ko -->
</div>
<!-- END INFO TRIP -->
<!-- SERVICE -->
<!-- ko if: hasHotelGroupServices -->
<div class="service-in-hotel">
    <div class="shadowHotel"><img src="/themes/v2/images/shadow-hotel.png"></div>
    <h3>Услуги в отеле</h3>
    <!-- ko foreach: hotelGroupServices -->
    <table class="serviceInHotelTable">
        <tbody><tr>
            <td class="title">
                <h3><span class="icoService service" data-bind="attr: {'class': 'icoService '+groupIcon}"></span><span data-bind="text: groupName">Сервис</span></h3>
            </td>
            <td class="list">
                <ul data-bind="foreach: elements">
                    <li><span class="dotted"></span> <span data-bind="text: $data">Услуги прачечной</span></li>

                    <li><span class="dotted"></span> <span data-bind="text: $data">Уборка номеров</span></li>
                </ul>
            </td>
        </tr>
        </tbody></table>

    <table class="serviceInHotelTable">
        <tbody><tr>
            <td class="title">
                <h3><span class="icoService turist" data-bind="attr: {'class': 'icoService '+groupIcon}"></span><span data-bind="text: groupName">Туристам</span></h3>
            </td>
            <td class="list">
                <ul data-bind="foreach: elements">
                    <li><span class="dotted"></span> <span data-bind="text: $data">Аренда автомобиля</span></li>
                </ul>
            </td>
        </tr>
        </tbody></table>

    <table class="serviceInHotelTable">
        <tbody><tr>
            <td class="title">
                <h3><span class="icoService internet" data-bind="attr: {'class': 'icoService '+groupIcon}"></span><span data-bind="text: groupName">Интернет</span></h3>
            </td>
            <td class="list">
                <ul data-bind="foreach: elements">
                    <li><span class="dotted"></span> <span data-bind="text: $data">Интернет на территории отеля</span></li>

                    <li><span class="dotted"></span> <span data-bind="text: $data">Интернет в номере</span></li>
                </ul>
            </td>
        </tr>
        </tbody></table>

    <table class="serviceInHotelTable">
        <tbody><tr>
            <td class="title">
                <h3><span class="icoService dop" data-bind="attr: {'class': 'icoService '+groupIcon}"></span><span data-bind="text: groupName">Дополнительно</span></h3>
            </td>
            <td class="list">
                <ul data-bind="foreach: elements">
                    <li><span class="dotted"></span> <span data-bind="text: $data">Наличие номеров для некурящих</span></li>
                </ul>
            </td>
        </tr>
        </tbody></table>

    <table class="serviceInHotelTable">
        <tbody><tr>
            <td class="title">
                <h3><span class="icoService in-hotel" data-bind="attr: {'class': 'icoService '+groupIcon}"></span><span data-bind="text: groupName">В отеле</span></h3>
            </td>
            <td class="list">
                <ul data-bind="foreach: elements">
                    <li><span class="dotted"></span> <span data-bind="text: $data">Банкомат</span></li>
                </ul>
            </td>
        </tr>
        </tbody></table>
    <!-- /ko -->
</div>
<!-- /ko -->

<!-- END SERVICE -->
<div class="hotel-important-info">
    <div class="shadowHotel"><img src="/themes/v2/images/shadow-hotel.png"></div>
    <h3>Важная информация</h3>
    <ul>
        <li><span class="span">Время заселения:</span> <span data-bind="text: checkInTime">14:00</span></li>
        <!-- ko if: site --><!-- /ko -->
        <!-- ko if: phone -->
        <li><span class="span">Телефон:</span> <span data-bind="text: phone">7-495-7887272</span></li>
        <!-- /ko -->
        <!-- ko if: fax -->
        <li><span class="span">Факс:</span> <span data-bind="text: fax">7-495-4822076</span></li>
        <!-- /ko -->
        <!-- ko if: email --><!-- /ko -->
        <!-- ko if: metroList.length -->
        <li><span class="span">Ближайшее метро:</span> <span data-bind="foreach: metroList"><span data-bind="text: $index() != 0 ? ', '+$data : $data">Владыкино</span><span data-bind="text: $index() != 0 ? ', '+$data : $data">, Петровско-Разумовская</span></span></li>
        <!-- /ko -->
        <!-- ko if: locations.length -->
        <li><span class="span">Месторасположение:</span> <span data-bind="foreach: locations"><span data-bind="text: $index() != 0 ? ', '+$data : $data">Near Centre</span></span></li>
        <!-- /ko -->
        <!-- ko if: numberFloors -->
        <li><span class="span">Число этажей:</span> <span data-bind="text: numberFloors">5</span></li>
        <!-- /ko -->
        <!-- ko if: builtIn -->
        <li><span class="span">Год постройки:</span> <span data-bind="text: builtIn">1956</span></li>
        <!-- /ko -->
    </ul>
</div>

<div class="miniPopUp" data-bind="visible: showRulesPopup, html: activeRoomSet().cancelText" style="display: none;">Штраф взымается в размере 5933 руб с 10 февраля</div>
</div>
</div>
</div>