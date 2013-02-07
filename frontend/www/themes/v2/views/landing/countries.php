<div class="headBlockOne">
<div class="center-block">
    <h1>Туры по всему миру!</h1>

</div>
<?php
    $firstHalf = round(count($countries)/2);
    $secondHalf = count($countries) - $firstHalf;?>
<table class="tableFlight first up">
    <tbody>
    <?php
    $i =0;
    foreach($countries as $country):
        $i++;
        if($i < $firstHalf):
        ?>
        <tr class="select">
            <td class="tdEmpty">

            </td>
            <td class="tdFlight">
                <div><?php echo $country->localRu;?></div>
            </td>
            <td class="tdPrice">
                <a href="/land/<?php echo $country->code;?>/hotels">отели</a>
            </td>
            <td class="tdPrice">
                <a href="/land/<?php echo $country->code;?>">перелеты</a>
            </td>
        </tr>
        <?php
        else:
            break;
        endif;
    endforeach;?>
    </tbody>
</table>
<table class="tableFlight second up">
    <tbody>
    <?php
    $i =0;
    foreach($countries as $country):
        $i++;
        if($i >= $firstHalf):
            ?>
        <tr class="select">
            <td class="tdEmpty">

            </td>
            <td class="tdFlight">
                <div><?php echo $country->localRu;?></div>
            </td>
            <td class="tdPrice">
                <a href="/land/hotels/<?php echo $country->code;?>">отели</a>
            </td>
            <td class="tdPrice">
                <a href="/land/<?php echo $country->code;?>">перелеты</a>
            </td>
        </tr>
            <?php
        endif;
    endforeach;?>
    </tbody>
</table>
<div class="clear"></div>

</div>

<div class="headBlockTwo" style="margin-bottom: 60px">
    <div class="center-block textSeo">
        <h2>Что такое Voyanga</h2>
        <p>Voyanga.com — это самый простой, удобный и современный способ поиска и покупки авиабилетов. Мы постоянно работаем над развитием и улучшением сервиса. Наш сайт подключен сразу к нескольким системам бронирования, что позволяет сравнивать тарифы и подбирать наиболее выгодные и удобные тарифы и рейсы.</p>
        <p>Наша компания официально аккредитована в Международной ассоциации авиаперевозчиков (IATA) и в российской транспортной клиринговой палате (ТКП). Мы прошли все необходимые процедуры для оформления электронных билетов на рейсы российских и зарубежных авиакомпаний.</p>
        <p>Помимо сайта у нас есть собственная служба бронирования, которая находится в нашем офисе. Всегда можно позвонить и вам помогут и ответят на все вопросы. Офис компании находится в Санкт-Петербурге.</p>
        <h2>Как посетить 10 стран по цене Айфона</h2>
        <p>Voyanga.com — это самый простой, удобный и современный способ поиска и покупки авиабилетов. Мы постоянно работаем над развитием и улучшением сервиса. Наш сайт подключен сразу к нескольким системам бронирования, что позволяет сравнивать тарифы и подбирать наиболее выгодные и удобные тарифы и рейсы.</p>
        <p>Наша компания официально аккредитована в Международной ассоциации авиаперевозчиков (IATA) и в российской транспортной клиринговой палате (ТКП). Мы прошли все необходимые процедуры для оформления электронных билетов на рейсы российских и зарубежных авиакомпаний.</p>
        <p>Помимо сайта у нас есть собственная служба бронирования, которая находится в нашем офисе. Всегда можно позвонить и вам помогут и ответят на все вопросы. Офис компании находится в Санкт-Петербурге.</p>

    </div>
</div>
<div class="clear"></div>