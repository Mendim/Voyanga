# Куда летим
class DestinationSearchParams
  constructor: ->
    @city = ko.observable ''
    @dateFrom = ko.observable ''
    @dateTo = ko.observable ''

# Кто летит
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
    voyanga_debug('CREATING TOURS SEARCH PARAMS!!!!!!!!!!')
    if(window.currentCityCode)
      @startCity = ko.observable window.currentCityCode
    else
      @startCity = ko.observable 'LED'
    @returnBack = ko.observable 1
    @destinations = ko.observableArray []
    # FIXME copy paste from hotel search params
    @rooms = ko.observableArray [new SpRoom(@)]
    @hotelId = ko.observable(false)
    @urlChanged = ko.observable(false)
    @hotelChanged = ko.observable(false)
    @overall = ko.computed =>
      result = 0
      for room in @rooms()
        result += room.adults()
        result += room.children()
      return result
    @adults = ko.computed =>
      result = 0
      for room in @rooms()
        result += room.adults()
      return result
    @children = ko.computed =>
      result = 0
      for room in @rooms()
        result += room.children()
      return result

  addSpRoom: =>
    @rooms.push new SpRoom(@)

  url: ->
    result = 'tour/search?'
    params = []
    params.push 'start=' + @startCity()
    params.push 'return=' + @returnBack()
    _.each @destinations(), (destination, ind) =>
      if moment(destination.dateFrom())
        dateFrom = moment(destination.dateFrom()).format('D.M.YYYY')
      else
        dateFrom = '1.1.1970'
      if moment(destination.dateTo())
        dateTo = moment(destination.dateTo()).format('D.M.YYYY')
      else
        dateTo = '1.1.1970'
      params.push 'destinations[' + ind + '][city]=' + destination.city()
      params.push 'destinations[' + ind + '][dateFrom]=' + dateFrom
      params.push 'destinations[' + ind + '][dateTo]=' + dateTo

    _.each @rooms(), (room, ind) =>
      params.push room.getUrl(ind)

    if(@eventId)
      params.push 'eventId='+@eventId
    if(@orderId)
      params.push 'orderId='+@orderId
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
    $.cookie 'currentTourHash', hash
    return hash

  fromList: (data)->
    beforeUrl = @url()
    hotelIdBefore = @hotelId()
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
    oldSelection = false
    while i < data.length
      if ((data[i] == 'eventId') || (data[i] == 'orderId') || (data[i] == 'flightHash'))
        toSaveIn = data[i]
        oldSelection = true
        break
      if ((data[i] == 'hotelId'))
        break
      room = new SpRoom(@)
      room.fromList(data[i])
      @rooms.push room
      i++
    if oldSelection
      i++;
      @[toSaveIn] = data[i]
    @hotelId(false)
    i = 0
    while i < data.length
      if ((data[i] == 'hotelId'))
        @hotelId(0)
      else
        if @hotelId() == 0
          @hotelId(data[i])
          break
      i++
    if beforeUrl == @url()
      @urlChanged(false)
      if hotelIdBefore == @hotelId()
        @hotelChanged(false)
      else
        @hotelChanged(true)
    else
      @urlChanged(true)
      @hotelChanged(false)

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

    if(data.eventId)
      @eventId = data.eventId

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

  GAKey: =>
    result = []
    for destination in @destinations()
      result.push destination.city()
    result.join '//'

  GAData: =>
    passangersData = "1"
    passangers = [0, 0, 0]
    for room in @rooms()
      passangers[0] += room.adults()
      passangers[1] += room.children()
      passangers[2] += room.infants()
    passangersData += ", " + passangers.join(" - ")

    result = []

    for destination in @destinations()
      stayData = passangersData + ", " + moment(destination.dateFrom()).format('D.M.YYYY') + ' - ' + moment(destination.dateTo()).format('D.M.YYYY')
      stayData += ", " + moment(destination.dateFrom()).diff(moment(), 'days') + " - " + moment(destination.dateTo()).diff(moment(destination.dateFrom()), 'days')
      result.push stayData
    result.join "//"

