<script type="text/html" id="hotels-panel-template">
    <table class="panelTable hotel">
        <tr>
            <td class="tdCityStart" data-bind='css: {zero: !$root.in1()}'>
                <span data-bind="html: prefixText"></span>
            </td>
            <td class="tdCity">
                <div class="data" data-bind="css: {active: haveDates()}">
                    <div class="bgInput">
                        <div class="left"></div>
                        <div class="center"></div>
                        <div class="right"></div>
                    </div>
                    <input class="input-path" tabindex="-1" type="text">
                    <input class="second-path" type="text" placeholder="Куда едем?" data-bind="autocomplete: {source:'city/hotel_req/1', iata: city, readable: cityReadable, readableAcc: cityReadableAcc, readableGen: cityReadableGen, showCode: false}">
                    <div class="date" data-bind="click: showCalendar, html:checkInHtml()">
                    </div>
                    <div class="date" data-bind="click: showCalendar, html:checkOutHtml()">
                    </div>
                </div>
            </td>
            <td class="tdPeople">
                <span data-bind="template: {name: peopleSelectorVM.template, data: peopleSelectorVM}"></span>
            </td>
            <td class="tdButton">
                <a class="btn-find" data-bind="click: navigateToNewSearch, css: {inactive: formNotFilled}">Найти</a>
            </td>
        </tr>
    </table>
</script>
