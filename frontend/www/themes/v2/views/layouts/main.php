<?php
$cs = Yii::app()->getClientScript();
$cs->reset();
$images = Yii::app()->assetManager->getPublishedUrl(Yii::getPathOfAlias('frontend.www.themes.v2.assets'));
$theme = Yii::app()->theme->baseUrl;
Yii::app()->clientScript->registerPackage('appCss');
Yii::app()->clientScript->registerPackage('appJs');
Yii::app()->clientScript->registerScriptFile('/js/runApp.js');
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<link rel="shortcut icon" href="<?= $theme ?>/images/favicon.png" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <title>Voyanga v.0.1 - Trip Flight Rework</title>
    <script type="text/javascript"
            src="http://maps.googleapis.com/maps/api/js?key=AIzaSyBdPg3WqRnITMLhY4OeXyk4bCa4qBEdF8U&sensor=false">
    </script>
</head>
<body data-bind="css: {fixed: in1}">
<?php echo $content; ?>
<div class="wrapper" data-bind="css: {'scroll-none': in1}">
    <div class="head" id="header">
        <!-- CENTER BLOCK -->
        <div class="center-block">
            <a href="/" class="logo">Voyanga</a>
            <a href="javascript:void(0)" onclick="openPopUpProj()" class="about">О проекте</a>

            <div class="telefon">
                <span class="prefix">+7 (499)</span> 533-09-33
            </div>
            <div class="slide-turn-mode">
                <div class="switch"><span class="l"></span><span class="c"></span><span class="r"></span></div>
                <div class="bg-mask"></div>

                <ul>
                    <li id="h-tours-slider" class="planner btn"  data-bind="click: slider.click"><a href="#tours">Планировщик</a></li>
                    <li id="h-avia-slider" class="aviatickets btn" data-bind="click: slider.click"><a href="#avia">Авиабилеты</a>
                    </li>
                    <li id="h-hotels-slider" class="hotel btn" data-bind="click: slider.click"><a href="#hotels">Отели</a></li>
                </ul>
            </div>

            <div class="login-window full" style="display:none;">
                <a href="#">
                    <span class="text">Регистрация и вход</span>
                    <span class="point"></span>
                </a>
            </div>
        </div>
        <!-- END CENTER BLOCK -->
    </div>
    <!-- END HEAD -->
    <!--====**********===-->

    <!-- BOARD IF WE ARE AT THE MAIN -->
    <!-- ko if:in1 -->
    <div class="panel-index">
    	<h1 class="title"><span data-bind="html: fakoPanel().mainLabel"></span></h1>
        <div class="board" data-bind="style: {height: fakoPanel().height}">
            <!-- ko if:fakoPanel().template=='tour-panel-template' -->
                <div class="constructor">
                    <!-- BOARD CONTENT -->
                        <div class="board-content" data-bind="template: { name: fakoPanel().template, data: fakoPanel(), afterRender: fakoPanel().afterRender }"></div>
                    <!-- END BOARD CONTENT -->
                    <div data-bind="attr: {class: fakoPanel().icon}"></div>
                </div>
            <!-- /ko -->
            <!-- ko if:fakoPanel().template!='tour-panel-template' -->
                <div class="sub-head" data-bind="css: {calSelectedPanelActive: !fakoPanel().calendarHidden()}">
                    <!-- CENTER BLOCK -->
                    <div class="center-block">
                        <!-- PANEL -->
                        <div class="panel"
                             data-bind="template: { name: fakoPanel().template, data: fakoPanel, afterRender: fakoPanel().afterRender }">
                        </div>
                        <!-- END PANEL -->
                    </div>
                    <div data-bind="attr: {class: fakoPanel().icon}"></div>
                </div>
            <!-- /ko -->
            <!-- END CONSTRUCTOR -->
            <div class="leftPageBtn" data-bind="swapPanel: {to: fakoPanel().prevPanel}"></div>
            <div class="rightPageBtn" data-bind="swapPanel: {to: fakoPanel().nextPanel}"></div>
        </div>
        <!-- CALENDAR -->
        <div class="calenderWindow z-indexTop" data-bind="template: {name: 'calendar-template-hotel', afterRender: reRenderCalendar}" style="top: -302px; height: 0;"></div>
        <!-- END CALENDAR -->
    </div>
    <!-- /ko -->

    <!-- SUB HEAD IF WE NOT ON THE MAIN -->
    <!-- ko ifnot: in1 -->
    <div class="sub-head" data-bind="css: {calSelectedPanelActive: !fakoPanel().calendarHidden()}">
        <!-- CENTER BLOCK -->
            <div class="center-block">
                <!-- PANEL -->
                <div class="panel"
                     data-bind="template: { name: fakoPanel().template, data: fakoPanel, afterRender: fakoPanel().afterRender }">
                </div>
                <!-- END PANEL -->
            </div>
            <!-- END CENTER BLOCK -->
	    <div class="calenderWindow z-indexTop" data-bind="template: {name: 'calendar-template', afterRender: reRenderCalendar}" 	
             style="top: 64px; display: none;"></div>
        <!--====**********===-->
    </div>
    <!-- /ko -->
    <!-- END SUB HEAD -->
    <!--====**********===-->
    <!-- ALL CONTENT -->
    <!-- ko ifnot: in1 -->
    <div class="center-block"
         data-bind="template: {name: activeView(), data: viewData(), afterRender: contentRendered}">
    </div>
    <!-- /ko -->
    <!-- SLIDE TOURS -->
    <!-- ko if:in1 -->
        <div class="slideTours" data-bind="template: {name: 'event-index', data: events, afterRender: mapRendered}"></div>
    <!-- /ko -->
    <!-- END SLIDE TOURS -->
    <!-- FOOTER -->
    <div class="footer">
        <div class="center-block">
            <ul class="foot-menu">
                <li><a href="javascript:void(0)" onclick="openPopUpProj()">О проекте</a></li>
                <li><a href="/faq">Вопросы и ответы</a></li>
                <li><a href="javascript:void(0)" onclick="openPopUpContact()">Контакты</a></li>
            </ul>
        </div>
    </div>
    <!-- END FOOTER-->

</div>
<div class="gShL"></div>
<div class="gShR"></div>


<!-- END WRAPPER -->
<!-- MAPS -->
<!-- FIXME -->
<span data-bind="template: {if: in1, name: 'event-map', data: events, afterRender: events.afterRender}"></span>
<!-- END MAPS -->
<div id="loadWrapBg" class="loadWrapBg" style='display: none;'>
    <div id="loadContentWin">
        <div id="loadGIF"><img src="/themes/v2/images/loading-5frame.gif"></div>
        <div id="loadTXT">
            Voyanga ищет <br> лучшие предложения...<br>
            <ul id="loadLight">
                <li class=""></li>
                <li class=""></li>
                <li class=""></li>
                <li class=""></li>
                <li class="active"></li>
            </ul>
            <div id="changeText"></div>
        </div>
    </div>
</div>
<div id="loadWrapBgMin" class="loadWrapBg" style='display: none;'>
    <div id="loadContentWinMin"></div>
</div>
<div class="mainWrapBg" style='display: none;'>
    <div class="wrapDiv">
        <div class="projectPopUp">

                <div class="centerImg">

                </div>
                <div class="centerText">
                    <div class="itemsProj">

                    </div>
                    <!-- ДЛЯ ЖЕНИ -->
                    <ul class="textSlideProj">
                        <li class="items" rel="<?= $theme ?>/images/about01.jpg">
                            <h3>Это - сервис индивидуальных путешествий</h3>
                            <p>Voyanga любит тебя сильнее, чем твоя бабушка, и найдет для тебя самые
                               лучшие авиабилеты и гостиницы!
                               <br><br>Мы знаем как найти лучший отель в городе, как купить самый недорогой
                               авиабилет и спланировать всю поездку. Мы сделали лучший сервис по самому
                               быстрому и удобному способу организации путешествий,
                               объединив продажу ключевых услуг в рамках единого online-сервиса.
                               </p>
                        </li>
                        <li class="items" rel="<?= $theme ?>/images/about02.jpg">
                            <h3>Планировщик поездки</h3>
                            <p>С помощью планировщика можно быстро и легко составить свою поездку, объединив разные
                               города, даты, гостиницы и авиабилеты (а скоро добавим ещё ЖД, страхование,
                               аренду авто и экскурсии).
                               <br><br>Делись составленным путешествием с друзьями, оплачивай всё в один клик!</p>
                        </li>
                        <li class="items" rel="<?= $theme ?>/images/about07.jpg">
                            <h3>Автоматический подбор поездки</h3>
                            <p>Мы заранее знаем сколько будут стоить разные варианты поездки по выбранному направлению
                               и с любовью подготовили для вас несколько готовых
                               вариантов, соответствующих разным критериям бюджета и уровня комфорта.</p>
                        </li>
                        <li class="items" rel="<?= $theme ?>/images/about03.jpg">
                            <h3>Календарь поездки</h3>
                            <p>Все элементы составленной поезки удобным образом отображены на календаре,
                               который наглядно покажет весь план путешествия: гостиницы, в которых вы
                               забронировали номер, и выбранные перелеты.</p>
                        </li>
                        <li class="items" rel="<?= $theme ?>/images/about05.jpg">
                            <h3>Скидки за комплексные покупки</h3>
                            <p>За бронирование комплексных поездок (авиабилет плюс гостиница) мы даём скидки до 10%.
                               Покупая у нас всю поездку целиком, вы экономите не только время,
                               но и свои деньги, которые можно потратить на новые яркие впечателния.
                               </p>
                        </li>
                        <li class="items" rel="<?= $theme ?>/images/about04.jpg">
                            <h3>Идеи для путешествий</h3>
                            <p>Мы регулярно публикуем интересные идеи для путешествий, будь то романтическая поездка на
                               выходные в Париж, или фестиваль джаза в Лондоне. Каждый элемент готовой поездки всегда можно
                               поменять на свой вкус.
                               <br><br> А ещё, наш робот Вояша постоянно проверяет наличие
                               билетов и поддерживает цены, котрые мы показываем, всегда актуальными. </p>
                        </li>
                        <li class="items" rel="<?= $theme ?>/images/about09.jpg">
                            <h3>Поиск авиабилетов</h3>
                            <p>Благодаря разработанному нами интеллектуальному алгоритму поиска
                               мы предложим самую лучшую цену на авиабилеты. Мы работаем с более чем 500
                               авиакомпаниями, тремя системами бронирования, группируем схожие рейсы, подбираем удобные
                               пересадки и показываем
                               только честную и конечную цену.
                               <br><br>Самые низкие тарифы, никаких дополнительных сборов, деньги с вас
                               списывает сама авиакомпания.</p>
                        </li>
                        <li class="items" rel="<?= $theme ?>/images/about08.jpg">
                            <h3>График динамики цен</h3>
                            <p>Цены на авиабилеты меняются постоянно и могут существенно зависить от дат вашей поездки.
                               График динамики цен позволяет более удобно спланировать путешествие.
                               <br><br>Динамика цен основана на данных, полученных посредством запросов пользователей к нашей
                               системе за последние несколько часов, дней.
                               </p>
                        </li>
                        <li class="items" rel="<?= $theme ?>/images/about10.jpg">
                            <h3>Бронирование гостиниц</h3>
                            <p>В нашей базе поиска содержится порядка 200 тысяч отелей по всему миру. Мы берем информацию по
                               отелям от десятка различных поставщиков, подбираем самые лучшие цены, собираем отзывы о
                               гостиницах,
                               формируя рейтинги из множества различных факторов, аккуратно структурируя и
                               представляя информацию в максимально удобном виде.</p>
                        </li>
                        <li class="items" rel="<?= $theme ?>/images/about06.jpg">
                            <h3>Безопасность платежей</h3>
                            <p>К оплате принимаются банковские карты международных платежных систем Visa
                               (в том числе и Electron), Mastercard и Maestro.
                               <br><br>Наш сайт полностью отвечает требованиям безопасности платежных систем и все данные
                               передаются в зашифрованном виде по защищенному протоколу. Мы работаем с
                               одним из лучших в мире процессинговых центров.
                               Вся оплата производится прямо на нашем сайте.</p>
                        </li>

                    </ul>

                <div class="counters">
                    <div class="bgCount">

                    </div>
                </div>
            </div>
            <div class="boxClose" onclick="closePopUpProj()" ></div>
        </div>
        <div class="naviProj">
            <div class="left" onclick="ClikLeftProj()"></div>
            <div class="right" onclick="ClikRightProj()"></div>
        </div>
    </div>
</div>
<div class="contentWrapBg" style='display: none;'>
    <div class="wrapDiv">
    <div class="wrapContent">
        <h2>Контактная информация</h2>
        <div class="textBlock telefon">
            <div class="floatLeft">Служба<br> поддержки</div>
            <div class="floatRight">+7 (499) 533-09-33</div>
        </div>
        <div class="textBlock hEmail">
            <div class="floatLeft">
                По вопросам бронирования и<br>
                возврата</div>
            <div class="floatRight"><a href="mailto:support@voyanga.com">support@voyanga.com</a></div>
        </div>
        <div class="textBlock oEmail">
            <div class="floatLeft">
                По любым вопросам,<br>
                мы всегда открыты</div>
            <div class="floatRight"><a href="mailto:hello@voyanga.com">hello@voyanga.com</a></div>
        </div>
        <div class="shadowContact"></div>
        <div class="textBlock ">
            <div class="floatLeft">
                Представительства<br>
                в трех городах</div>
            <div class="floatRight lh28">
                Москва, ул. Профсоюзная 26/44<br>
                С-Петербург, 7-ая линия 76, оф. 419<br>
                Н-Новгород, ул. Б.Покровская 62/5, оф. 501
            </div>
        </div>
        <div class="shadowContact"></div>
        <div class="textBlock ">
            <div class="floatLeft">
                Представительства<br>
                в социальных сетях</div>
            <div class="floatRight lh28">
                <img src="<?= $theme ?>/images/ico-vk-small.png" alt="vk.com/voyanga" > <a href="http://vk.com/voyanga" target="_blank">vk.com/voyanga</a><br>
                <img src="<?= $theme ?>/images/ico-fb-small.png" alt="facebook.com/voyanga" > <a href="http://facebook.com/voyanga" target="_blank">facebook.com/voyanga</a>
            </div>
        </div>
        <div class="shadowContact"></div>
        <div class="textBlock ">
            <div class="floatLeft">Реквизиты</div>
            <div class="floatRight lh28">
                ООО «Изитрип»<br>
                ИНН 7728799455<br>
                ОГРН 1127746124373
            </div>
        </div>
        <div class="boxClose" onclick="closePopUpContact()" ></div>
    </div>
    </div>
    </div>
</div>
<?php
$templates = Yii::app()->params['frontend.app.templates'];
foreach ($templates as $template)
{
    echo "<!-- START OF TEMPLATE $template -->\n";
    $this->renderPartial('www.themes.v2.views.' . $template);
    echo "<!-- END OF TEMPLATE $template -->\n";
}
?>
</body>
</html>
