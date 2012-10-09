class SpRoom
  constructor: (@parent) ->
    @adults = ko.observable(1).extend({integerOnly: {min: 1, max:4}})
    @children = ko.observable(0).extend({integerOnly: {min: 0, max:4}})
    @ages = ko.observableArray()

    @adults.subscribe (newValue)=>
      if newValue + @children() > 4
        @adults 4 - @children()
      if (@parent.overall() - @adults() + newValue) > 9
        @adults  9 - @parent.overall() + @adults()

    @children.subscribe (newValue)=>
      if newValue + @adults() > 4
        newValue = 4 - @adults()
        @children newValue
      if (@parent.overall() - @children() + newValue) > 9
        @children  9 - @parent.overall() + @children()


      if @ages().length == newValue
        return
      if @ages().length < newValue
        for i in [0..(newValue-@ages().length-1)]
          @ages.push {age: ko.observable(12).extend {integerOnly: {min: 12, max:17}}}
      else if @ages().length > newValue
        @ages.splice(newValue)
      ko.processAllDeferredBindingUpdates()

  fromList: (item) ->
    parts = item.split(':')
    @adults parts[0]
    @children parts[1]
    # FIXME: FIXME FIXME
#    for i in [0..@children]
#      @ages.push {age: ko.observable(parts[2+i]).extend {integerOnly: {min: 12, max:17}}}

  fromObject: (item) ->
    @adults +item.adultCount
    @children +item.childCount

  getHash: =>
    parts = [@adults(), @children()]
    for age in @ages()
      parts.push age
    return parts.join(':')

  getUrl: (i)=>
    # FIXME FIMXE FIMXE
    return "rooms[#{i}][adt]=" + @adults() + "&rooms[#{i}][chd]=" + @children() + "&rooms[#{i}][chdAge]=0&rooms[#{i}][cots]=0"

class HotelsSearchParams
  constructor: ->
    @city = ko.observable('')
    @checkIn = ko.observable(false)
    @checkOut = ko.observable(false)
    @rooms = ko.observableArray [new SpRoom(@)]
    @overall = ko.computed =>
      result = 0
      for room in @rooms()
        result += room.adults()
        result += room.children()
      return result
        
  getHash: =>
    parts =  [@city(), moment(@checkIn()).format('D.M.YYYY'), moment(@checkOut()).format('D.M.YYYY')]
    for room in @rooms()
      parts.push room.getHash()
    hash = 'hotels/search/' + parts.join('/') + '/'
    window.voyanga_debug "Generated hash for hotels search", hash
    return hash

  fromList: (data)=>
    # FIXME looks too ugly to hit production, yet does not support RT
    @city data[0]
    @checkIn moment(data[1], 'D.M.YYYY').toDate()
    @checkOut moment(data[2], 'D.M.YYYY').toDate()
    @rooms.splice(0)
    rest = data[3].split('/')
    for item in rest
      if item
        r = new SpRoom(@)
        r.fromList(item)
        @rooms.push r

  fromObject: (data)=>
    @city data.city
    @checkIn moment(data.checkIn, 'YYYY-M-D').toDate()
    @checkOut moment(data.checkIn, 'YYYY-M-D').add('days',data.duration).toDate()
    @rooms.splice(0)
    for item in data.rooms
      r = new SpRoom(@)
      r.fromObject(item)
      @rooms.push r

  url: =>
    result = "hotel/search?city=" + @city()
    result += '&checkIn=' + moment(@checkIn()).format('YYYY-M-D')
    result += '&duration=' + moment(@checkOut()).diff(moment(@checkIn()), 'days')
    for room, i in @rooms()
      result += '&' + room.getUrl(i)
    return result
