class TourEntry
  constructor: ->
    # Mix in events
    _.extend @, Backbone.Events

  isAvia: =>
    return @avia

  isHotel: =>
    return @hotels

  price: =>
    if @selection() == null
      return 0
    @selection().price

  priceHtml: =>
    if @selection() == null
      return "Не выбрано"
    return @price() + '<span class="rur">o</span>'


  minPriceHtml: =>
    @minPrice() + '<span class="rur">o</span>'

  maxPriceHtml: =>
    @maxPrice() + '<span class="rur">o</span>'

  savings: =>
    if @selection() == null
      return 0

    return 555

  rt: =>
    false

  beforeRender: =>

class ToursAviaResultSet extends TourEntry
  constructor: (raw, sp)->
    super
    @api = new AviaAPI
    @template = 'avia-results'
    @overviewTemplate = 'tours-overview-avia-no-selection'
    @panel = new AviaPanel()
    @panel.handlePanelSubmit = @doNewSearch
    @panel.sp.fromObject sp
    @panel.original_template = @panel.template
    @results = ko.observable()
    @selection = ko.observable null
    @newResults raw, sp
    @data = {results: @results}

  newResults: (raw, sp)=>
    @rawSP = sp
    result = new AviaResultSet raw
    result.injectSearchParams sp
    result.postInit()
    result.recommendTemplate = 'avia-tours-recommend'
    result.tours = true
    result.select = (res)=>
      @select res, result
      @trigger 'next'
    @avia = true
    @results result

  select: (res)=>
    # FIXME looks retardely stupid
    if res.ribbon
      #it is actually recommnd ticket
      res = res.data
    @results().selected_key res.key
    res.parent.filtersConfig = res.parent.filters.getConfig()
    @results().selected_best res.best | false
    @overviewTemplate = 'tours-overview-avia-ticket'
    @selection(res)

  toBuyRequest: =>
    result = {}
    result.type = 'avia'
    result.searchId = @selection().cacheId
    # FIXME FIXME FXIME
    result.searchKey = @selection().flightKey()
    result.adults = @rawSP.adt
    result.children = @rawSP.chd
    result.infants = @rawSP.inf
    return result

  doNewSearch: =>
    @api.search @panel.sp.url(), (data)=>
      @newResults data.flights.flightVoyages, data.searchParams

  # Overview VM
  overviewText: =>
    "Перелет " + @results().departureCity + ' &rarr; ' + @results().arrivalCity

  overviewPeople: =>
    sum = @panel.sp.adults()+@panel.sp.children()+@panel.sp.infants()
    Utils.wordAfterNum(sum,'человек','человека','человек')


  numAirlines: =>
    # FIXME FIXME FIXME
    @results().filters.airline.options().length

  minPrice: =>
    cheapest = _.reduce @results().data,
      (el1, el2)->
        if el1.price < el2.price then el1 else el2
      ,@results().data[0]
    cheapest.price

  maxPrice: =>
    mostExpensive = _.reduce @results().data,
      (el1, el2)->
        if el1.price > el2.price then el1 else el2
      ,@results().data[0]
    mostExpensive.price
    

  # End overview VM

  destinationText: =>
    "<span class='left-avia-city'>" + @results().departureCity + "&rarr;</span> " + "<span class='left-avia-city'>" + @results().arrivalCity + "</span>"

  additionalText: =>
    if @selection() == null
      return ""
    if @rt()
      ""
    else
      ", " + @selection().departureTime() + ' - ' + @selection().arrivalTime()

  dateClass: =>
    if @rt() then 'blue-two' else 'blue-one'

  dateHtml: (startonly=false)=>
    # FIXME SEARCH PARAMS
    source = @selection()
    if source == null
      source = @results().data[0]
    result = '<div class="day">'
    result+= dateUtils.formatHtmlDayShortMonth source.departureDate()
    result+='</div>'
    if startonly
      return result
    if @rt()
      result+= '<div class="day">'
      result+= dateUtils.formatHtmlDayShortMonth source.rtDepartureDate()
      result+= '</div>'
    return result

  timelineStart: =>
    source = @selection()
    if source == null
      source = @results().data[0]
    source.departureDate()

  rtTimelineStart: =>
    source = @selection()
    if source == null
      source = @results().data[0]
    source.rtDepartureDate()

  rt: =>
    source = @selection()
    if source == null
      source = @results().data[0]
    source.roundTrip

  timelineEnd: =>
    source = @selection()
    if source == null
      source = @results().data[0]
    source.arrivalDate()
        
  rt: =>
    @results().roundTrip

  beforeRender: =>
    if @results().selectedKey
      @results().filters.getConfig(@results().filtersConfig)

  afterRender: =>
    if @results()
      console.log('avia after rend')
      if @results().selected_key
        console.log('Yes, have selected')
        window.setTimeout(
          =>
            if $('.ticket-content .btn-cost.selected').parent().parent().parent().parent().length
              Utils.scrollTo($('.ticket-content .btn-cost.selected').parent().parent().parent().parent())

          , 50
        )

       
class ToursHotelsResultSet extends TourEntry
  constructor: (raw, sp)->
    super
    @api = new HotelsAPI
    @panel = new HotelsPanel()
    @panel.handlePanelSubmit = @doNewSearch
    @panel.sp.fromObject sp
    @panel.original_template = @panel.template
    @overviewTemplate = 'tours-overview-hotels-no-selection'
    @template = 'hotels-results'

    @activeHotel = ko.observable 0
    @selection = ko.observable null
    @results = ko.observable()
    @data = {results: @results}

    @newResults raw, sp

  newResults: (data, sp)=>
    @rawSP = sp
    result = new HotelsResultSet data, sp, @activeHotel
    result.tours true
    result.postInit()
    result.select = (hotel) =>
      hotel.parent = result
      hotel.oldPageTop = $("html").scrollTop() | $("body").scrollTop()
      hotel.off 'back'
      hotel.on 'back', =>
        @trigger 'setActive', @, false, false,hotel.oldPageTop, =>
          if !hotel.parent.showFullMap()
            Utils.scrollTo('#hotelResult'+hotel.hotelId)
          else
            hotel.parent.showFullMapFunc(null,null,true)
      hotel.off 'select'
      hotel.on 'select', (roomData) =>
        @select roomData
        @trigger 'next'
      @trigger 'setActive', {'data':hotel, template: 'hotels-info-template', 'parent':@}
    result.selectFromPopup = (hotel) =>
      hotel.parent = result
      hotel.activePopup.close()
      hotel.oldPageTop = $("html").scrollTop() | $("body").scrollTop()
      hotel.off 'back'
      hotel.on 'back', =>

        @trigger 'setActive', @, false, false, hotel.oldPageTop,=>
          if !hotel.parent.showFullMap()
            Utils.scrollTo('#hotelResult'+hotel.hotelId)
      hotel.off 'select'
      hotel.on 'select', (roomData) =>
        @select roomData
        @trigger 'next'
      @trigger 'setActive', {'data':hotel, template: 'hotels-info-template', 'parent':@}
    # FIXME WTF
    @hotels = true
    @selection null
    @results result

  select: (roomData)=>
    hotel = roomData.hotel
    hotel.parent = @results()
    @activeHotel  hotel.hotelId
    @overviewTemplate = 'tours-overview-hotels-ticket'
    @selection roomData
    hotel.parent.filtersConfig = hotel.parent.filters.getConfig()
    hotel.parent.pagesLoad = hotel.parent.showParts()


  toBuyRequest: =>
    result = {}
    result.type = 'hotel'
    result.searchId = @selection().hotel.cacheId
    # FIXME FIXME FXIME
    result.searchKey = @selection().roomSet.resultId
    result.adults = 0
    result.age = false
    result.cots = 0
    for room in @rawSP.rooms
      result.adults += room.adultCount*1
      # FIXME looks like this could be array
      if room.childAge
        result.age = room.childAgeage
      
      result.cots += room.cots*1
    return result


  doNewSearch: =>
    @api.search @panel.sp.url(), (data)=>
      data.searchParams.cacheId = data.cacheId
      @newResults data, data.searchParams

  # Overview VM
  overviewText: =>
    @destinationText()

  overviewPeople: =>
    sum = @panel.sp.overall()
    Utils.wordAfterNum(sum,'человек','человека','человек') + ', ' + @results().wordDays

  numHotels: =>
    @results().data().length

  minPrice: =>
    @results().minPrice

  maxPrice: =>
    @results().maxPrice

  # end Overview VM

  # tours overview
  destinationText: =>
    "<span class='hotel-left-long'>Отель в " + @rawSP.cityFull.casePre + "</span><span class='hotel-left-short'>" + @rawSP.cityFull.caseNom + "</span>"

  price: =>
    if @selection() == null
      return 0

    @selection().roomSet.price

#  overviewPriceHtml: =>
#    result =', ' + @selection().hotel.wordDays
#    result += @price() + '<span class="rur">o</span>'
#    return result
    
  additionalText: =>
    if @selection() == null
      return ""
    ", " + @selection().hotel.hotelName

  dateClass: =>
    'orange-two'

  dateHtml: (startOnly=false)=>
    result = '<div class="day">'
    result+= dateUtils.formatHtmlDayShortMonth @results().checkIn
    result+='</div>'
    if startOnly
      return result
    result+= '<div class="day">'
    result+= dateUtils.formatHtmlDayShortMonth @results().checkOut
    result+= '</div>'

  timelineStart: =>
    @results().checkIn

  timelineEnd: =>
    @results().checkOut

  beforeRender: =>
    console.log('beforeRender hotels')
    if @results()
      @results().toursOpened = true
      if @activeHotel()
        @results().filters.setConfig(@results().filtersConfig)
        @results().showParts(@results().pagesLoad)
      else
        @results().postFilters()

  afterRender: =>
    if @results()
      if @activeHotel()
        window.setTimeout(
          =>
            if $('.hotels-tickets .btn-cost.selected').parent().parent().parent().parent().length
              Utils.scrollTo($('.hotels-tickets .btn-cost.selected').parent().parent().parent().parent())

          , 50
        )


class ToursResultSet
  constructor: (raw, @searchParams)->
    # Mix in events
    _.extend @, Backbone.Events

    @data = ko.observableArray()
    for variant in raw.allVariants
      if !variant
        continue
      if variant.flights
        result =  new ToursAviaResultSet variant.flights.flightVoyages, variant.searchParams
      else
        variant.searchParams.cacheId = variant.cacheId
        result = new ToursHotelsResultSet variant, variant.searchParams
      @data.push result
      result.on 'setActive', (entry, beforeRender = true, afterRender = true, scrollTo = 0,callback = null)=>
        @setActive entry, beforeRender, afterRender, scrollTo, callback
      result.on 'next', (entry)=>
        @nextEntry()

    @timeline = new Timeline(@data)
    @selection = ko.observable @data()[0]
    @panel = ko.computed 
      read: =>
        if @selection().panel
          @panelContainer = @selection().panel
        @panelContainer.timeline = @timeline
        @panelContainer.setActiveTimelineAvia = @setActiveTimelineAvia
        @panelContainer.setActiveTimelineHotels = @setActiveTimelineHotels
        
        if !@panelContainer.onlyTimeline
          @panelContainer.onlyTimeline = false
        else
          @panelContainer.timeline.termsActive = false
        @panelContainer.selection = @selection
        @panelContainer.template = 'tours-panel-template'

        return @panelContainer

    @price = ko.computed =>
      sum = 0
      for item in @data()
        sum += item.price()
      return sum

    @savings = ko.computed =>
      sum = 0
      for item in @data()
        sum += item.savings()
      return sum

    @someSegmentsSelected= ko.computed =>
      for x in @data()
        if x.selection()
          return true
      return false

    @someSegmentsSelected.subscribe (newValue)=>
      if newValue
        $('#tour-buy-btn').show 'fast'
      else
        $('#tour-buy-btn').hide 'fast'
      
    @vm = new ToursOverviewVM @

    # FIXME have to resorn after their run
    # set of predefined algoriths for tour selection
    @voyashki = []
    @voyashki.push new VoyashaCheapest @
    @voyashki.push new VoyashaOptima @
    @voyashki.push new VoyashaRich @
  setActive: (entry,beforeRender = true, afterRender = true,scrollTo = 0,callback = null)=>
    $('#loadWrapBgMin').show()
    if entry.overview
      $('.btn-timeline-and-condition').hide()
      window.toursOverviewActive = true
    else
      window.toursOverviewActive = false
    console.log('br',beforeRender,afterRender)
    if entry.beforeRender && beforeRender
      console.log('brin')
      entry.beforeRender()
    @trigger 'inner-template', entry.template
    # FIXME 
    window.setTimeout =>
      if entry.afterRender && afterRender
        console.log('arin')
        entry.afterRender()
      @selection entry
      ko.processAllDeferredBindingUpdates()
      ResizeAvia()
      $('#loadWrapBgMin').hide()
      if !(scrollTo == false)
        Utils.scrollTo(scrollTo,false)
      if callback
        callback()
    , 100


  setActiveTimelineAvia: (entry)=>
    @setActive entry.avia.item

  setActiveTimelineHotels: (entry)=>
    @setActive entry.hotel.item

  nextEntry: =>
    for x in @data()
      if !x.selection()
        @setActive x
        return
    return @showOverview()

  removeItem: (item, event)=>
    event.stopPropagation()
    if @data().length <2
      return
    idx = @data.indexOf(item)

    if idx ==-1
      return
    @data.splice(idx, 1)
    if item == @selection()
      @setActive @data()[0]

  showOverview: =>
    # FIXME FIXME FIXME
    dummyPanel =
      onlyTimeline: true
      calendarHidden: -> true
      calendarValue: ko.observable {values: []}
    @setActive {template: 'tours-overview', data: @, overview: true, panel: dummyPanel}
    do ResizeAvia
    window.setTimeout(
      ()=>
        console.log('after render tours all tour page')
        console.log(@data());
        calendarEvents = []
        for resSet in @data()
          if resSet.isAvia()
            console.log('avia',resSet.data.results(),resSet.rawSP);
            flights = []
            for dest in resSet.rawSP.destinations
              flight = {type: 'flight',description:  dest.departure+' || ' + dest.arrival, cityFrom: dest.departure_iata, cityTo: dest.arrival_iata}
              flight.dayStart = moment(dest.date)._d
              flight.dayEnd = moment(dest.date)._d
              flights.push flight

            if resSet.selection()
              console.log('select:',resSet.selection())
              aviaRes = resSet.selection()
              flights[0].dayEnd = aviaRes.arrivalDate();
              if aviaRes.roundTrip
                flights[1].dayEnd = aviaRes.rtArrivalDate();
              console.log('city:',aviaRes.arrivalCity(),'date:',aviaRes.arrivalDate());
            for flight in flights
              calendarEvents.push flight
          if resSet.isHotel()
            console.log('hotel',resSet.data.results(),resSet.rawSP);
            checkIn = moment(resSet.rawSP.checkIn).add('h',8);
            checkOut = moment(resSet.rawSP.checkIn).add('d',resSet.rawSP.duration);

            hotelEvent = {dayStart: checkIn._d,dayEnd: checkOut._d,type: 'hotel',description:  '', city: resSet.rawSP.city}
            if resSet.selection()
              console.log('select:',resSet.selection())
              hotelEvent.description = resSet.selection().hotel.hotelName

            calendarEvents.push hotelEvent
        calendarEvents.sort(
          (left,right)->
            if left.dayStart > right.dayStart
              return 1
            if left.dayStart < right.dayStart
              return -1
            return 0
        )
        console.log(calendarEvents)


        ###VoyangaCalendarTimeline.calendarEvents = [
          {dayStart: Date.fromIso('2012-10-23'),dayEnd: Date.fromIso('2012-10-23'),type:'flight',color:'red',description:'Москва || Санкт-Петербург',cityFrom:'MOW',cityTo:'LED'},
          {dayStart: Date.fromIso('2012-10-23'),dayEnd: Date.fromIso('2012-10-28'),type:'hotel',color:'red',description:'Californication Hotel2',city:'LED'},
          {dayStart: Date.fromIso('2012-10-28'),dayEnd: Date.fromIso('2012-10-28'),type:'flight',color:'red',description:'Санкт-Петербург || Москва',cityFrom:'LED',cityTo:'MOW'},
          {dayStart: Date.fromIso('2012-10-28'),dayEnd: Date.fromIso('2012-10-28'),type:'flight',color:'red',description:'Москва || Санкт-Петербург',cityFrom:'MOW',cityTo:'LED'},
          {dayStart: Date.fromIso('2012-11-21'),dayEnd: Date.fromIso('2012-11-22'),type:'flight',color:'red',description:'Санкт-Петербург || Москва',cityFrom:'LED',cityTo:'MOW'},
          {dayStart: Date.fromIso('2012-11-21'),dayEnd: Date.fromIso('2012-11-28'),type:'hotel',color:'red',description:'Californication Hotel',city:'MOW'},
          {dayStart: Date.fromIso('2012-11-28'),dayEnd: Date.fromIso('2012-11-28'),type:'flight',color:'red',description:'Москва || Санкт-Петербург',cityFrom:'MOW',cityTo:'LED'},
          {dayStart: Date.fromIso('2012-11-28'),dayEnd: Date.fromIso('2012-11-28'),type:'flight',color:'red',description:'Санкт-Петербург || Амстердам',cityFrom:'LED',cityTo:'AMS'},
          {dayStart: Date.fromIso('2012-11-28'),dayEnd: Date.fromIso('2012-11-28'),type:'flight',color:'red',description:'Амстердам || Санкт-Петербург',cityFrom:'AMS',cityTo:'LED'},
          {dayStart: Date.fromIso('2012-11-28'),dayEnd: Date.fromIso('2012-11-28'),type:'flight',color:'red',description:'Санкт-Петербург || Москва',cityFrom:'LED',cityTo:'MOW'},
        ]###
        VoyangaCalendarTimeline.calendarEvents = calendarEvents;
        VoyangaCalendarTimeline.jObj = '#voyanga-calendar-timeline'
        VoyangaCalendarTimeline.init()
      ,1000
    )

  buy: =>
    toBuy = []
    for x in @data()
      if x.selection()
        toBuy.push {module: 'Tours'}
        toBuy.push x.toBuyRequest()

    Utils.toBuySubmit toBuy
  
# Models for tour search params,
class DestinationSearchParams
  constructor: ->
    @city = ko.observable ''
    @dateFrom = ko.observable ''
    @dateTo = ko.observable ''

class RoomsSearchParams
  constructor: ->
    @adt = ko.observable 2
    @chd = ko.observable 0
    @chdAge = ko.observable false
    @cots = ko.observable false

# Used in TourPanel and search controller
class TourSearchParams extends SearchParams
  constructor: ->
    super()
    @startCity = ko.observable 'LED'
    @destinations = ko.observableArray []
    # FIXME copy paste from hotel search params
    @rooms = ko.observableArray [new SpRoom(@)]
    @overall = ko.computed =>
      result = 0
      for room in @rooms()
        result += room.adults()
        result += room.children()
      return result

    @returnBack = ko.observable 1

  url: ->
    result = 'tour/search?'
    params = []
    params.push 'start=' + @startCity()
    _.each @destinations(), (destination, ind) =>
      params.push 'destinations[' + ind + '][city]=' + destination.city()
      params.push 'destinations[' + ind + '][dateFrom]=' + moment(destination.dateFrom()).format('D.M.YYYY')
      params.push 'destinations[' + ind + '][dateTo]=' + moment(destination.dateTo()).format('D.M.YYYY')

    _.each @rooms(), (room, ind) =>
      params.push room.getUrl(ind)

    result += params.join "&"
    window.voyanga_debug "Generated search url for tours", result
    return result

  key: ->
    key = @startCity()
    _.each @destinations(), (destination) ->
      key += destination.city() + destination.dateFrom() + destination.dateTo()
    _.each @rooms(), (room) ->
      key += room.getHash()
    return key

  getHash: ->
    parts =  [@startCity(), @returnBack()]
    _.each @destinations(), (destination) ->
      parts.push destination.city()
      parts.push moment(destination.dateFrom()).format('D.M.YYYY')
      parts.push moment(destination.dateTo()).format('D.M.YYYY')
    parts.push 'rooms'
    _.each @rooms(), (room) ->
      parts.push room.getHash()

    hash = 'tours/search/' + parts.join('/') + '/'
    window.voyanga_debug "Generated hash for tour search", hash
    return hash

  fromList: (data)->
    window.voyanga_debug "Restoring TourSearchParams from list"
    @startCity data[0]
    @returnBack data[1]
    # FIXME REWRITE ME
    doingrooms = false
    @destinations([])
    @rooms([])
    for i in [2..data.length] by 3
      if data[i] == 'rooms'
        break
      destination = new DestinationSearchParams()
      destination.city(data[i])
      destination.dateFrom(moment(data[i+1], 'D.M.YYYY').toDate())
      destination.dateTo(moment(data[i+2], 'D.M.YYYY').toDate())
      @destinations.push destination

    i = i + 1
    while i < data.length
      room = new SpRoom(@)
      room.fromList(data[i])
      @rooms.push room
      i++
    window.voyanga_debug 'Result', @

  fromObject: (data)->
    window.voyanga_debug "Restoring TourSearchParams from object"

    _.each data.destinations, (destination) ->
      destination = new DestinationSearchParams()
      destination.city(destination.city)
      destination.dateFrom(moment(destination.dateFrom, 'D.M.YYYY').toDate())
      destination.dateTo(moment(destination.dateTo, 'D.M.YYYY').toDate())
      @destinations.push destination

    _.each data.rooms, (room) ->
      room = new SpRoom(@)
      @rooms.push @room.fromObject(room)

    window.voyanga_debug 'Result', @

  removeItem: (item, event)=>
    event.stopPropagation()
    if @data().length <2
      return
    idx = @data.indexOf(item)

    if idx ==-1
      return
    @data.splice(idx, 1)
    if item == @selection()
      @setActive @data()[0]

# decoupling some presentation logic from resultset
class ToursOverviewVM
  constructor: (@resultSet)->

  startCity: =>
    firstResult = @resultSet.data()[0]
    if firstResult.isAvia()
      firstResult.results().departureCity
    else
      firstResult.results().city.caseNom


  dateClass: =>
    'blue-one'
  
  
  dateHtml: =>
    firstResult = @resultSet.data()[0]
    return firstResult.dateHtml(true)

  afterRender: =>

class TourTripResultSet
  constructor: (@resultSet) ->
    @items = ko.observableArray []
    @hasFlight = false
    @hasHotel = false
    @flightCounter = ko.observable 0
    @hotelCounter = ko.observable 0
    @flightCounterWord = ko.computed =>
      res = Utils.wordAfterNum  @flightCounter(), 'авивабилет', 'авиабилета', 'авиабилетов'
      if (@hotelCounter()>0)
        res = res + ', '
      return res
    @hotelCounterWord = ko.computed =>
      Utils.wordAfterNum  @hotelCounter(), 'гостиница', 'гостиницы', 'гостиниц'
    _.each @resultSet.items, (item) =>
      if (item.isFlight)
        @hasFlight = true
        @flightCounter(@flightCounter()+1)
        @roundTrip = item.flights.length == 2
        @items.push new Voyage(item.flights[0], item.valCompany)
        if @roundTrip
          @flightCounter(@flightCounter()+1)
          @items.push new Voyage(item.flights[1], item.valCompany)
      else if (item.isHotel)
        @hasHotel = true
        @hotelCounter(@hotelCounter()+1)
        @lastHotel = new HotelResult item, @, item.duration, item, item.hotelDetails
        console.log item
        @items.push(@lastHotel)
