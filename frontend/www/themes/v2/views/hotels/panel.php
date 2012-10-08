<script type="text/html" id="hotels-panel-template">
  <table class="hotelTable panelTable">
    <tr>
      <td class="tdCity">
        <div class="data" data-bind="css: {active: haveDates}">
            <input class="input-path" tabindex="-1" type="text" data-bind="autocomplete: {source:'city/hotel_req/1', iata: city, readable: cityReadable, readableAcc: cityReadableAcc, readableGen: cityReadableGen}">
            <input class="second-path" type="text" placeholder="Город" data-bind="autocomplete: {source:'city/hotel_req/1', iata: city, readable: cityReadable, readableAcc: cityReadableAcc, readableGen: cityReadableGen}">
            <div class="date" style="right:35px;" data-bind="click: showCalendar, html:checkInHtml()">
            </div>
            <div class="date" data-bind="click: showCalendar, html:checkOutHtml()">
            </div>
        </div>
      </td>
      <td class="tdPeopleHotel">
        <span data-bind="template: {name: peopleSelectorVM.template, data: peopleSelectorVM}"></span>
      </td>
      <td class="btnTD">
        <a class="btn-find" data-bind="click: navigateToNewSearch, visible: formFilled">Найти</a>
      </td>
    </tr>
  </table>
</script>
