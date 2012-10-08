STARS_VERBOSE = ['one', 'two', 'three', 'four', 'five']

class Room
  constructor: (data) ->
    @name = data.showName
    @nameNemo = data.roomNemoName
    if !@nameNemo || data.roomName
      @nameNemo = data.roomName
    if @nameNemo != '' and typeof @nameNemo != 'undefined'
      @haveNemoName = true
    else
      @haveNemoName = false
      @nameNemo = ''

    @meal = data.meal
    if data.mealName
      @meal = data.mealName
    #if data.mealBreakfast != '' and typeof data.mealBreakfast != 'undefined'
    #  @meal = data.mealBreakfast
    if typeof @meal == "undefined" || @meal == ''
      @meal = 'Не известно'
    #console.log(@meal)
    @hasMeal = (@meal != 'Без питания' && @meal != 'Не известно')

class RoomSet
  constructor: (data, @parent, duration = 1) ->
    @price = Math.ceil(data.rubPrice)
    # Used in tours
    @savings = 0

    @pricePerNight =  Math.ceil(@price / duration)
    @visible = ko.observable(true)


    @rooms = []
    for room in data.rooms
      @rooms.push new Room room
    @selectedCount = ko.observable 0
    @selectedCount.subscribe (newValue)=>
      @checkCount(newValue)

    @selectText = ko.computed =>
      if !@parent.tours
        return "Забронировать"
      if @parent.activeResultId()
        return 'Выбран'
      else
        return 'Выбрать'

  checkCount: (newValue)=>
    count = parseInt(newValue)
    if count < 0 || isNaN(count)
      @selectedCount(0)
    else
      @selectedCount(count)

  plusCount: =>
    @selectedCount(@selectedCount() + 1)

  minusCount: =>
    if @selectedCount() > 0
      @selectedCount(@selectedCount() - 1)

  #price: ->
  #  console.log prm
  #  console.log 'tt'
  #  return 22
#
# Stacked hotel, FIXME can we use this as roomset ?
#
class HotelResult
  constructor: (data, parent, duration = 1) ->
    # Mix in events
    _.extend @, Backbone.Events
    @tours = parent.tours
    @hotelId = data.hotelId
    @activeResultId = ko.observable 0 
    @hotelName = data.hotelName
    @address = data.address
    @description = data.description
    # FIXME check if we can get diffirent photos for different rooms in same hotel
    @photos = data.images
    @numPhotos = 0
    @parent = parent
    # FIXME trollface
    @frontPhoto =
      smallUrl: 'http://upload.wikimedia.org/wikipedia/en/thumb/7/78/Trollface.svg/200px-Trollface.svg.png'
      largeUrl: 'http://ya.ru'
    if @photos && @photos.length
      @frontPhoto = @photos[0]
      @numPhotos = @photos.length

    # for popup
    @activePhoto = @frontPhoto['largeUrl']
    # FIXME check if categoryId matches star rating
    @stars = STARS_VERBOSE[data.categoryId-1]
    @rating = data.rating
    if @rating == '-'
      @rating = 0
    # coords
    @lat = data.latitude / 1
    @lng = data.longitude / 1
    @distanceToCenter = Math.ceil(data.centerDistance/1000)
    if @distanceToCenter > 30
      @distanceToCenter = 30

    @duration = duration
    console.log('duration:'+duration)
    @haveFullInfo = ko.observable false

    @selectText = ko.computed =>
      if !@tours
        return "Забронировать"
      if @activeResultId()
        return 'Выбран'
      else
        return 'Выбрать'



    @hasHotelServices = if data.hotelServices then true else false
    @hotelServices = data.hotelServices
    @hasHotelGroupServices = if data.hotelGroupServices then true else false
    @hotelGroupServices = []
    if data.hotelGroupServices
      for groupName,elements of data.hotelGroupServices
        @hotelGroupServices.push {groupName: groupName,elements: elements}
    #if @hasHotelServices
    #  for service in @hotelServices
    #    if service == 'Фитнесс-центр'
    #      service = 'Фитнесс'
    @hasRoomAmenities = if data.roomAmenities then true else false
    @roomAmenities = data.roomAmenities
    @roomSets = []
    @visible = ko.observable(true)
    @push data

  push: (data) ->
    set = new RoomSet data, @, @duration
    set.resultId = data.resultId
    if @roomSets.length == 0
      @cheapest = set.price
      @cheapestSet = set  
      @minPrice = set.pricePerNight
      @maxPrice = set.pricePerNight
    else
      @cheapest = if set.price < @cheapest then set.price else @cheapest
      @cheapestSet = if set.price < @cheapest then set else @cheapestSet 
      @minPrice = if set.pricePerNight < @minPrice then set.pricePerNight else @minPrice
      @maxPrice = if set.pricePerNight > @maxPrice then set.pricePerNight else @maxPrice
    @roomSets.push set
    @roomSets = _.sortBy @roomSets, (entry)-> entry.price

  showPhoto: =>
    new PhotoBox(@photos)


  # FIXME copy-pasted from avia
  # Shows popup with detailed info about given result
  showDetails: (data, event)=>
    # If user had clicked read-more link
    @readMoreExpanded = false
    new GenericPopup '#hotels-body-popup', @
    SizeBox('hotels-body-popup')
    ResizeBox('hotels-body-popup')
    sliderPhoto('.photo-slide-hotel')
    # FIXME explicitly call tab handler here ?
    $(".description .text").dotdotdot({watch: 'window'})

    # If we initialized google map already
    @mapInitialized = false

  showMapDetails: (data, event)=>
    @showDetails(data, event)
    @showMap()

  # FIXME refactor
  showMapInfo: (context, event)=>
    # FIXME FIXME FIMXE why this code navigates if we wont stop default?
    event.preventDefault()
    el = $('#hotel-info-tumblr-map')
    if el.hasClass('active')
      return
    $('.place-buy .tmblr li').removeClass('active')
    el.addClass('active')
    $('#descr').hide()
    $('#map').show()
    if ! @mapInitialized
      coords = new google.maps.LatLng(@lat, @lng)
      mapOptions =
        center: coords
        zoom: 12
        mapTypeId: google.maps.MapTypeId.ROADMAP
      map = new google.maps.Map $('#hotel-info-gmap')[0], mapOptions
      marker = new google.maps.Marker
        position: coords
        map: map
        title: @hotelName
      @mapInitialized = true

  showDescriptionInfo: (context, event) ->
    el = $('#hotel-info-tumblr-description')
    if el.hasClass('active')
      return
    $('.place-buy .tmblr li').removeClass('active')
    el.addClass('active')
    $('#map').hide();
    $('#descr').show()
    $(".description .text").dotdotdot({watch: 'window'})
    $('#boxContent').css 'height', 'auto'

  # Click handler for map/description in popup
  showMap: (context, event) =>
    el = $('#hotels-popup-tumblr-map')
    if el.hasClass('active')
      return
    $('.place-buy .tmblr li').removeClass('active')
    el.addClass('active')
    $('.tab').hide();
    $('#hotels-popup-map').show()
    $('#boxContent').css 'height', $('#hotels-popup-map').height() + $('#hotels-popup-header1').height() + $('#hotels-popup-header2').height() + 'px'
    if ! @mapInitialized
      coords = new google.maps.LatLng(@lat, @lng)
      mapOptions =
        center: coords
        zoom: 12
        mapTypeId: google.maps.MapTypeId.ROADMAP
      map = new google.maps.Map $('#hotels-popup-gmap')[0], mapOptions
      marker = new google.maps.Marker
        position: coords
        map: map
        title: @hotelName
      @mapInitialized = true
    SizeBox 'hotels-popup-body'

  showDescription: (context, event) ->
    el = $('#hotels-popup-tumblr-description')
    if el.hasClass('active')
      return
    $('.place-buy .tmblr li').removeClass('active')
    el.addClass('active')
    $('.tab').hide();
    $('#hotels-popup-description').show()
    $(".description .text").dotdotdot({watch: 'window'})
    $('#boxContent').css 'height', 'auto'
    SizeBox 'hotels-popup-body'

  initFullInfo: =>
    @roomCombinations = ko.observableArray([])
    @combinedPrice = ko.computed =>
      res = 0
      for roomSet in @roomCombinations()
        if roomSet.selectedCount()
          res += roomSet.selectedCount()*roomSet.price
      return res

    @combinedButtonLabel = ko.computed =>
      if @combinedPrice() > 0
        return @selectText()
      else
        return 'Не выбраны номера'

  getFullInfo: ()=>
    if !@haveFullInfo()
      api = new HotelsAPI
      url = 'hotel/search/info/?hotelId='+@hotelId
      url += '&cacheId='+@parent.cacheId
      console.log @parent.cacheId
      api.search url, (data)=>
        #adding info to elements
        window.voyanga_debug 'searchInfo',data
        @initFullInfo()
        for ind,roomSet of data.hotel.details
          set = new RoomSet roomSet, @, @duration
          set.resultId = roomSet.resultId
          @roomCombinations.push set
        @haveFullInfo(true)
        console.log(@roomCombinations())

  combinationClick: =>
    console.log 'combination click'

  #mapTumbler: (context, event) =>
  #  el = $(event.currentTarget)
  #  if ! el.hasClass('active')
  #    var_nameBlock = el.attr('href')
  #    var_nameBlock = var_nameBlock.slice(1)
  #    $('.place-buy .tmblr li').removeClass('active')
  #    el.parent().addClass('active')
  #    $('.tab').hide();
  #    $('#'+var_nameBlock).show()

#    sliderPhoto('.photo-slide-hotel');
#    $('a.photo').click(function(e) {
#      e.preventDefault();
#      createPhotoBox(this);
#    });
#    $(".description .text").dotdotdot({watch: 'window'});


  # Click handler for read more button in popup
  readMore: (context, event)->
    el = $(event.currentTarget)
    text_el = el.parent().find('.text')

    if ! el.hasClass('active')
      var_heightCSS = el.parent().find('.text').css('height');
      var_heightCSS = Math.abs(parseInt(var_heightCSS.slice(0,-2)));
      text_el.attr('rel',var_heightCSS).css('height','auto');
      text_el.dotdotdot({watch: 'window'});
      text_el.css('overflow','visible');
      el.text('Свернуть');
      el.addClass('active');
    else
      rel = el.parent().find('.text').attr('rel');
      text_el.css('height', rel+'px');
      el.text('Подробнее');
      el.removeClass('active');
      text_el.dotdotdot({watch: 'window'});
      text_el.css('overflow','hidden');
    #FIXME should not be called on details page
    SizeBox('hotels-popup-body')

  # click handler, notify parent container that we want to go back
  back: =>
    @trigger 'back'

  select: (room) =>
    # it is actually cheapest click
    if room.roomSets
      room = room.roomSets[0]
    if @tours
      @activeResultId room.resultId

    @trigger 'select', {roomSet: room, hotel: @}

  smallMapUrl: =>
      base = "http://maps.googleapis.com/maps/api/staticmap?zoom=13&size=310x259&maptype=roadmap&markers=color:red%7Ccolor:red%7C"
      base += "%7C"
      base += @lat + "," + @lng
      base += "&sensor=false"
      return base



#
# Result container
# Stacks them by price and company
#
class HotelsResultSet
  constructor: (rawHotels, @searchParams) ->
    @_results = {}
    @tours = false
    @checkIn = moment(@searchParams.checkIn)
    @checkOut = moment(@checkIn).add('days', @searchParams.duration)
    window.voyanga_debug('checkOut',@checkOut)
    @city = 0
    if @searchParams.duration
      duration = @searchParams.duration
    if duration == 0 || typeof duration == 'undefined'
      for hotel in rawHotels
        if typeof hotel.duration == 'undefined'
          checkIn = dateUtils.fromIso hotel.checkIn
          console.log checkIn
          checkOut = dateUtils.fromIso hotel.checkOut
          console.log hotel.checkOut
          console.log checkOut
          duration = checkOut.valueOf() - checkIn.valueOf()
          duration =  Math.floor(duration / (3600 * 24 * 1000))
        else
          duration = hotel.duration
          console.log('yes set')
        break
    console.log('MainDuration:'+duration)
    @minPrice = false
    @maxPrice = false
    for hotel in rawHotels
      key = hotel.hotelId
      if !@city
        @city = hotel.city
      if @_results[key]
        @_results[key].push hotel
        @minPrice = if @_results[key].minPrice < @minPrice then @_results[key].minPrice else @minPrice
        @maxPrice = if @_results[key].maxPrice > @maxPrice then @_results[key].maxPrice else @maxPrice
      else
        result =  new HotelResult hotel, @, duration
        @_results[key] = result
        if @minPrice == false
          @minPrice = @_results[key].minPrice
          @maxPrice = @_results[key].maxPrice
        else
          @minPrice = if @_results[key].minPrice < @minPrice then @_results[key].minPrice else @minPrice
          @maxPrice = if @_results[key].maxPrice > @maxPrice then @_results[key].maxPrice else @maxPrice

    # We need array for knockout to work right
    #@data = []
    @data = ko.observableArray()
    @numResults = ko.observable 0

    for key, result of @_results
      @data.push result

    @sortBy = ko.observable( 'minPrice')

    @sortByPriceClass = ko.computed =>
      ret = 'hotel-sort-by-item'
      if @sortBy() == 'minPrice'
        ret += ' active'
      return ret

    @sortByRatingClass = ko.computed =>
      ret = 'hotel-sort-by-item'
      if @sortBy() == 'rating'
        ret += ' active'
      return ret

    @data.sort (left, right)->
      if left.minPrice < right.minPrice
        return -1
      if left.minPrice > right.minPrice
        return  1
      return 0


  select: (hotel, event) =>
    window.voyanga_debug ' i wonna get hotel for you',hotel
    hotel.off 'back'
    hotel.on 'back', =>
      window.app.render({results: ko.observable(@)}, 'results')

    hotel.getFullInfo()
    window.app.render(hotel, 'info-template')

  getDateInterval: =>
    dateUtils.formatDayMonthInterval(@checkIn._d,@checkOut._d)

  sortByPrice:  =>
    if @sortBy() != 'minPrice'
      @sortBy('minPrice')
      @data.sort (left, right)->
        if left.minPrice < right.minPrice
          return -1
        if left.minPrice > right.minPrice
          return  1
        return 0
      #ko.processAllDeferredBindingUpdates()

  sortByRating:  =>
    if @sortBy() != 'rating'
      @sortBy('rating')
      @data.sort (left, right)->
        if left.rating > right.rating
          return -1
        if left.rating < right.rating
          return  1
        return 0
      #console.log(@data())
      #ko.processAllDeferredBindingUpdates()

  selectHotel: (hotel, event) =>
    @select(hotel, event)

  postInit: =>
    @filters = new HotelFiltersT @

  postFilters: =>
    console.log 'post filters'
    data = _.filter @data(), (el) -> el.visible()
    @numResults data.length

    console.log(@data)
    ko.processAllDeferredBindingUpdates()
    # FIXME
    #ResizeAvia()

class HotelsSearchParams
  constructor: ->
    @city = ko.observable('')
    @checkIn = ko.observable('')
    @checkOut = ko.observable('')

    @rooms = ko.observableArray [new Roomers()]
    @roomsView = ko.computed =>
      result = []
      current = []
      for item in @rooms()
        if current.length == 2
          result.push current
        current = []
        current.push item
        result.push current
      return result

  addRoom: =>
    if @rooms().length == 4
      return
    @rooms.push new Roomers()

  getHash: =>
    parts =  [@city(), moment(@checkIn()).format('D.M.YYYY'), moment(@checkOut()).format('D.M.YYYY')]
    for room in @rooms()
      parts.push room.getHash()
    hash = 'hotels/search/' + parts.join('/') + '/'
    window.voyanga_debug "Generated hash for hotels search", hash
    return hash

  fromList: (data)->
    # FIXME looks too ugly to hit production, yet does not support RT
    @city data[0]
    @checkIn moment(data[1], 'D.M.YYYY').toDate()
    @checkOut moment(data[2], 'D.M.YYYY').toDate()
    @rooms.splice(0)
    rest = data[3].split('/')
    for item in rest
      if item
        @rooms.push new Roomers(item)

  url: =>
    result = "hotel/search?city=" + @city()
    result += '&checkIn=' + moment(@checkIn()).format('YYYY-M-D')
    result += '&duration=' + moment(@checkOut()).diff(moment(@checkIn()), 'days')
    for room, i in @rooms()
      result += '&' + room.getUrl(i)
    return result
