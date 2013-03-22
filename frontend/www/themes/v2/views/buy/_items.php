<!--=== ===-->
<div class="oneBlock buyTicket">
    <!--=== ===-->
    <div class="paybuyContent">
        <h1>Оформление заказа &#8470;<?php echo $orderId; ?></h1>
        <!-- ALL TICKETS DIV -->
        <div class="allTicketsDIV">
            <span data-bind="template: {name: 'items', data: itemsToBuy}"></span>
            <span class="lv"></span>
            <span class="rv"></span>
            <span class="lt"></span>
            <span class="rt"></span>
        </div>
        <!-- END ALL TICKETS DIV -->
        <div class="theSum">
            <div class="left"><span data-bind="text: itemsToBuy.flightCounterWord()"></span><span data-bind="text: itemsToBuy.hotelCounterWord()"></span></div>
            <div class="right">
                Итоговая стоимость <div class="price"><span data-bind="text: Utils.formatPrice(itemsToBuy.totalCost)">37 500</span><span class="rur">o</span></div>
            </div>
        </div>
        <!-- END -->
    </div>
    <!--=== ===-->
</div>
<!--=== ===-->
