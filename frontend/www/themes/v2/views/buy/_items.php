<!--=== ===-->
<div class="oneBlock">
    <!--=== ===-->
    <div class="paybuyContent">
        <h1>Ваши покупки</h1>
        <!-- ALL TICKETS DIV -->
        <div class="allTicketsDIV">
            <span data-bind="template: {name: 'items', data: itemsToBuy}"></span>
        </div>
        <!-- END ALL TICKETS DIV -->
        <div class="theSum">
            <div class="left"><span data-bind="text: itemsToBuy.flightCounterWord()"></span><span data-bind="text: itemsToBuy.hotelCounterWord()"></span></div>
            <div class="right">
                Итоговая стоимость <div class="price"><span data-bind="text: itemsToBuy.totalCost">37 500</span><span class="rur">o</span></div>
            </div>
        </div>
        <!-- END -->
    </div>
    <!--=== ===-->
</div>
<!--=== ===-->