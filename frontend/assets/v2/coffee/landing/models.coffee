class landBestPriceBack
  constructor: (data,@parent) ->
    @price = parseInt(data.price)
    @showPrice = ko.computed =>
      return (@price - @parent.showPrice())
    @showPriceText = ko.computed =>
      return Utils.formatPrice(@showPrice())
    @showWidth = ko.computed =>
      if (@parent.backMaxPrice() - @parent.backMinPrice())
        #console.log('sp',@showPrice(),'pmBP',@parent.minBestPrice().showPrice(),'pp',@parent.minBestPrice())
        k = 10 + Math.ceil( (@showPrice() - @parent.backMinPrice()) / (@parent.backMaxPrice() - @parent.backMinPrice()) * 90 )
        #console.log('k back is',k,((k == 0) ? 1 : k))
        return k
      else
        #console.log('no maxPrice')
        return 50
    @backDate = moment(data.dateBack)
    @selected = ko.observable(false)

  selectThis: =>
    @parent.setActiveBack(@backDate.format('YYYY-MM-DD'))
    @parent.selectThis()

class landBestPrice
  constructor: (data,@parent) ->
    @minPrice = ko.observable(parseInt(data.price) * 2 + 5)
    @date = moment(data.date)
    @_results = {}
    @backMaxPrice = ko.observable(1)
    @backMinPrice = ko.observable(@minPrice())
    @showPrice = ko.computed =>
      return Math.ceil(@minPrice() / 2)
    @showPriceText = ko.computed =>
      return Utils.formatPrice(@showPrice())
    @showWidth = ko.computed =>
      if (@parent.maxPrice() - @parent.minPrice())
        #console.log('sp',@showPrice(),'pmBP',@parent.minBestPrice().showPrice(),'pp',@parent.minBestPrice())
        k = 10 + Math.ceil( (@showPrice() - @parent.minPrice()) / (@parent.maxPrice() - @parent.minPrice()) * 90 )
        return k
      else
        #console.log('no maxPrice')
        return 50
    @results = ko.computed =>
      ret = []
      if @parent.datesArr()
        for obj in @parent.datesArr()
          ret.push {date:obj.date,landBP:@_results[obj.date]}
      return ret

    @selected = ko.observable(false)
    @selBack = ko.observable(null)
    @active = ko.observable(null)
    @addBack(data)

  addBack: (data)=>
    if data.dateBack
      back = new landBestPriceBack(data,@)
      if back.price < @minPrice()
        @minPrice(back.price)
        if @selBack()
          @selBack().selected(false)
        back.selected(true)
        @selBack(back)
        @active(back)
      if(back.showPrice() > @backMaxPrice())
        @backMaxPrice(back.showPrice())
      if(back.showPrice() < @backMinPrice())
        @backMinPrice(back.showPrice())
      @_results[data.dateBack] = back

  setActiveBack: (date)=>
    @active().selected(false)
    @active(@_results[date])
    @active().selected(true)

  selectThis: =>

    @parent.setActive(@date.format('YYYY-MM-DD'))
    console.log('selectThis',@date,@date.format('YYYY-MM-DD'))
    setDepartureDate(@date.format('YYYY-MM-DD'))

    if @active()
      setBackDate(@active().backDate.format('YYYY-MM-DD'))
      @setActiveBack(@active().backDate.format('YYYY-MM-DD'))


class landBestPriceSet
  constructor: (allData) ->
    @_results = {}
    @dates = {}
    @datesArr = ko.observableArray([])
    #console.log(allData)
    @directBestPrice = ko.observable(null)
    @directBestPriceData = ko.observable(null)
    @minBestPrice = ko.observable(null)
    @maxPrice = ko.observable(1)
    @minPrice = ko.observable(9999999)
    @active = ko.observable(null)
    for key,data of allData
      #console.log(key,data)
      if !@dates[data.date]
        @dates[data.date] = true
      if data.dateBack
        if !@dates[data.dateBack]
          @dates[data.dateBack] = true
      if @_results[data.date]
        @_results[data.date].addBack(data)
      else
        @_results[data.date] = new landBestPrice(data,@)
      if(!@minBestPrice() || @_results[data.date].minPrice() < @minBestPrice().minPrice())
        @minBestPrice(@_results[data.date])
        console.log('set new minBestPrice',@minBestPrice())
    for key,landBP of @_results
      if( landBP.showPrice() > @maxPrice() )
        @maxPrice(landBP.showPrice())
      if( landBP.showPrice() < @minPrice() )
        @minPrice(landBP.showPrice())




    for dataKey,empty of @dates
      @datesArr.push {date:dataKey,landBP:@_results[dataKey],monthName:'',monthChanged: false,dateText:'',today:false}
    @datesArr.sort(
      (objDateLeft,objDateRight)->
        l = moment(objDateLeft.date).unix()
        r = moment(objDateRight.date).unix()
        if l < r
          return -1
        else if r < l
          return 1
        return 0
    )
    firstElem = true
    today = moment().format("YYYY-MM-DD")
    for dataObj in @datesArr()
      mom = moment(dataObj.date)
      if firstElem
        monthChanged = false
        prevMonth = mom.month()
        monthName = ACC_MONTHS[mom.month()]
      else
        if mom.month() != prevMonth
          monthName = ACC_MONTHS[mom.month()]
          monthChanged = true
        else
          monthName = ''
          monthChanged = false

      dataObj.monthName = monthName
      dataObj.monthChanged = monthChanged
      dataObj.dateText = SHORT_WEEKDAYS[( (mom.day()+6) % 7)]+'<br><span>'+mom.format('DD')+'</span>'
      dataObj.today = dataObj.date == today
      console.log('date',dataObj.date, today,dataObj.date == today)
      if firstElem
        firstElem = false
      prevMonth = mom.month()
      #@datesArr.push {date:dataKey,landBP:@_results[dataKey]}
    console.log('dates',@datesArr())

    @active(@minBestPrice())
    @active().selected(true)
    @selectedPrice = ko.computed =>
      if @directBestPrice()
        price = @directBestPrice()
      else
        if price = @active().active()
          price = @active().active().price
        else
          if @active()
            price = @active().showPrice()
          else
            console.log('active not set',@active())

      return Utils.formatPrice(price)
    @bestDate = ko.computed =>
      if @directBestPriceData()
        dateFrom = moment(@directBestPriceData().date)
        console.log(dateFrom)
        strDate = dateUtils.formatDayMonthYear(dateFrom._d)
        return strDate
      return false



  bestDateClick: =>
    if @directBestPriceData()
      if !@directBestPrice()
        @directBestPrice(@directBestPriceData().price)
      if @directBestPriceData().date
        setDepartureDate(moment(@directBestPriceData().date).format('YYYY-MM-DD'))
      if @directBestPriceData().dateBack
        setBackDate(moment(@directBestPriceData().dateBack).format('YYYY-MM-DD'))
      if @active()
        console.log('yes have active',@active())
        @active().selected(false)
        if @active().active()
          @active().active().selected(false)
        else
          console.log('not have active',@active())

  setActive: (date)=>
    @active().selected(false)
    @active(@_results[date])
    @active().selected(true)
    @directBestPrice(null)

  setDirectBestPrice: (data)=>
    console.log('DIRECCCCTTTTTT')
    @directBestPrice(data.price)
    @directBestPriceData(data)
    if @active()
      console.log('yes have active',@active())
      @active().selected(false)
      if @active().active()
        @active().active().selected(false)
    else
      console.log('not have active',@active())


