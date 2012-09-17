<script type="text/html" id="hotels-info-template">
    <div class="title">
        <h1 data-bind="text: result.hotelName">Рэдиссон Соня Отель</h1>
        <div class="rating">
            <span class="value" data-bind="text: result.rating">4,5</span>
            <span class="text">рейтинг<br>отеля</span>
        </div>

        <div class="stars four" data-bind="attr: {class: 'stars ' + result.stars}"></div>

        <div class="clear"></div>
    </div>

    <div class="place-buy">
        <div class="street" data-bind="text: result.address">
            Санкт-Петербург, ул. Морская Набережная, д. 31/2
        </div>
        <ul class="tmblr">
            <li class="active"><span class="ico-descr"></span> <a href="#descr">Описание</a></li>
            <li><span class="ico-see-map"></span> <a href="#map">На карте</a></li>
        </ul>
        <div class="book">
            <div class="how-cost">
                от <span class="cost" data-bind="text: result.cheapest">5 200</span><span class="rur f21">o</span> / ночь
            </div>
            <a class="btn-cost" href="#"><span class="l"></span><span class="text">Забронировать</span></a>
        </div>
    </div>
    <!-- DESCR -->
    <div class="descr" id="descr">
        <div class="left">
            <div class="right">
                <div class="map-hotel">
                    <img src="images/pic-hotel-map.png">
                </div>
                Отель расположен в <span data-bind="text: result.distanceToCenter">10</span> км от центра
            </div>
            <!-- ko if: result.numPhotos > 0 -->
                <div class="photo-slide-hotel">

                    <ul data-bind="foreach: result.photos">
                        <li><a href="#" class="photo" data-bind="attr:{href: largeUrl}"><img src="#" data-bind="attr:{src: smallUrl}"></a></li>
                    </ul>

                    Фотографии предоставлены отелями(<span data-bind="text: result.numPhotos"></span>).
                </div>
            <!-- /ko -->

            <div class="descr-text">
                <h3>Описание отеля</h3> <a href="#" class="translate">Перевести</a>
                <div class="text" data-bind="text:result.description">
                    <p>Четырехзвёздочный отель «Рэдиссон Соня» оформлен по мотивам романа Достоевского «Преступление и наказание» — идеальный вариант для ценителей творчества знаменитого писателя и любителей изысканного отдыха. Персонал отеля возьмет на себя все заботы по организации для вас интересных экскурсий по Северной столице.
                    </p>
                </div>
                <a class="read-more">Подробнее</a>
            </div>
        </div>

    </div>
    <!-- END DESCR -->
    <!-- MAP -->
    <div class="descr" id="map">
        <div class="map-big">
            <img src="images/pic-big-map.png">
        </div>
        Отель расположен в 10 км от центра
    </div>
    <!-- END MAP -->
    <!-- SERVICE -->
    <!-- ko if: result.hasHotelServices -->
    <div class="service-in-hotel">
        <h3>Услуги в отеле</h3>
        <ul data-bind="foreach: result.hotelServices">
            <li><span class="ico-wi-fi"></span> <span data-bind="text: $data"></span></li>
        </ul>
    </div>
    <!-- /ko -->

    <div class="service-in-room">
        <h3>Услуги в номере</h3>
        <ul>
            <li><span class="ico-wi-fi"></span> бесплатный Wi-Fi</li>
            <li><span class="ico-wi-fi"></span> бесплатный Wi-Fi</li>
            <li><span class="ico-glass"></span> широкая коктейльная карта</li>
            <li><span class="ico-glass"></span> широкая коктейльная карта</li>
            <li><span class="ico-dog"></span> можно с пёсиком</li>
            <li><span class="ico-dog"></span> можно с пёсиком</li>
        </ul>
    </div>
    <!-- END SERVICE -->
    <!-- INFO TRIP -->
    <div class="info-trip">
        <div class="date-trip">
            26 мая - 27 мая
        </div>
        <h2>Номера в <span data-bind="text: result.hotelName">Рэдиссон Соня Отель</span></h2>
        <h3>Рекомендуемые сочетания по вашему запросу</h3>
        <!-- ko foreach: result.roomSets -->
        <div class="block-trip">
            <table>
                <tbody>
                <tr>
                    <td class="name">
                        <ul data-bind="foreach: rooms">
                            <li><span class="text" data-bind="text: name">Стандартный двухместный номер</span> <span data-bind="if: hasMeal"><span class="ico-breakfast"></span> <span data-bind="text: meal">Завтрак «шведский стол»</span></span></li>
                        </ul>
                        <a href="#">Условия отмены бронирования</a>
                    </td>
                    <td class="button"><a class="btn-cost" href="#"><span class="l"></span><span class="text">Забронировать</span><span class="cost" data-bind="text: price">14 200</span><span class="rur f21">o</span></a></td>
                </tr>
                </tbody>
            </table>
        </div>
        <!-- /ko -->
        <h3>Или подберите свое сочетание из всех возможных вариантов</h3>
        <div class="block-trip">
            <table>
                <tbody>
                <tr>
                    <td class="name">
                        <div class="items">
                            <ul>
                                <li>
                                    <table>
                                        <tr>
                                            <td><span class="text">Трехместный номер люкс</span> <span class="ico-breakfast"></span> Завтрак «шведский стол»<br><a href="#">Условия отмены бронирования</a></td>
                                            <td class="change">

                                                <div class="change-people">
                                                    <div class="minus"></div>
                                                    <div class="value">
                                                        <input type="text" value="0">
                                                    </div>
                                                    <div class="plus"></div>
                                                </div>

                                            </td>
                                        </tr>
                                    </table>
                                </li>
                            </ul>
                        </div>
                        <div class="items">
                            <ul>
                                <li>
                                    <table>
                                        <tr>
                                            <td><span class="text">Трехместный номер люкс</span> <span class="ico-breakfast"></span> Завтрак «шведский стол»<br><a href="#">Условия отмены бронирования</a></td>
                                            <td class="change">
                                                <div class="change-people">
                                                    <div class="minus"></div>
                                                    <div class="value">
                                                        <input type="text" value="0">
                                                    </div>
                                                    <div class="plus"></div>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>

                                </li>
                            </ul>
                        </div>
                        <div class="items">
                            <ul>
                                <li>
                                    <table>
                                        <tr>
                                            <td><span class="text">Трехместный номер люкс</span> <span class="ico-breakfast"></span> Завтрак «шведский стол»<br><a href="#">Условия отмены бронирования</a></td>
                                            <td class="change">
                                                <div class="change-people">
                                                    <div class="minus"></div>
                                                    <div class="value">
                                                        <input type="text" value="0">
                                                    </div>
                                                    <div class="plus"></div>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>

                                </li>
                            </ul>
                        </div>
                    </td>
                    <td class="button"><a class="btn-cost" href="#"><span class="l"></span><span class="text">Не выбраны номера</span></a></td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
    <!-- END INFO TRIP -->
    </div>
    </div>
</script>