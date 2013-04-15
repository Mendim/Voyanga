###
SEARCH controller, should be splitted once we will get more actions here
###
class HotelsController
  constructor: (@searchParams) ->
    @api = new HotelsAPI
    @routes =
      '/search/*rest': @searchAction
#      '/info/:cacheId/:hotelId/': @infoAction,
      '/timeline/': @timelineAction,
      '': @indexAction

    @results = ko.observable()

    # Mix in events
    _.extend @, Backbone.Events

  searchAction: (args)=>
    @searchParams.fromString args

    if @searchParams.urlChanged()
      window.VisualLoaderInstance.start(@api.loaderDescription)
      @api.search  @searchParams.url(), @handleSearch

    else
      if @searchParams.hotelChanged()
        #action

        if @searchParams.hotelId()
          hotelObj = @results()._results[@searchParams.hotelId()]
          if hotelObj
            @results().select(hotelObj,null)
            @searchParams.lastHotel = hotelObj
          else
            backUrl = window.location.hash
            urls = backUrl.split('hotelId')
            @searchParams.hotelId(false)
            window.app.navigate (urls[0])
        else
          @searchParams.lastHotel.back()
      else
        window.VisualLoaderInstance.start(@api.loaderDescription)
        @api.search  @searchParams.url(), @handleSearch

  handleSearch: (data)=>
    try
      stacked = @handleResults data
    catch err
      window.VisualLoaderInstance.hide()
      if err=='e404'
        new ErrorPopup 'hotels404'
        return
      new ErrorPopup 'e500'
      return

    @results stacked
    GAPush ['_trackEvent', 'Hotel_show_search_results', @searchParams.GAKey(),  @searchParams.GAData(), stacked.data().length]

    @render 'results', {'results' : @results}
    if @searchParams.hotelId()
      hotelObj = @results()._results[@searchParams.hotelId()]
      if hotelObj
        @results().select(hotelObj,null)
        @searchParams.lastHotel = hotelObj
      else
        backUrl = window.location.hash
        urls = backUrl.split('hotelId')
        @searchParams.hotelId(false)
        window.app.navigate (urls[0])


  handleResults: (data) =>
    # FIXME REALLY RETARDED
    stacked = new HotelsResultSet data, data.searchParams
    stacked.postInit()
    stacked.checkTicket = @checkTicketAction
    return stacked
    
  checkTicketAction: (roomSet, resultDeferred)=>
    now = moment()
    diff = now.diff(@results().creationMoment, 'seconds')
    if diff < HOTEL_TICKET_TIMELIMIT
      resultDeferred.resolve(roomSet)
      return

    window.VisualLoaderInstance.start("Идет проверка выбранных выриантов<br>Это может занять от 5 до 30 секунд")

    @api.search  @searchParams.url(), (data)=>
      try
        stacked = @handleResults(data)
      catch err
        window.VisualLoaderInstance.hide()
        throw new Error("Unable to bould HotelResultSet from api response. Check ticket.")
      result = stacked.findAndSelect(roomSet)
      if result
        window.VisualLoaderInstance.hide()
        resultDeferred.resolve(result)
      else
        window.VisualLoaderInstance.hide()
        new ErrorPopup 'hotelsNoTicketOnValidation', false,  ->
        @results stacked


  indexAction: =>
    @render 'index', {}

 
  timelineAction: =>
    @render 'timeline-template'
    window.setTimeout(
      ()=>
        VoyangaCalendarTimeline.calendarEvents = [
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
        ];
        VoyangaCalendarTimeline.calendarEvents = [
          {dayStart: Date.fromIso('2012-11-29'),dayEnd: Date.fromIso('2012-11-29'),type:'flight',color:'red',description:'Москва || Санкт-Петербург',cityFrom:'MOW',cityTo:'LED'},
          {dayStart: Date.fromIso('2012-11-29'),dayEnd: Date.fromIso('2012-12-01'),type:'hotel',color:'red',description:'Californication Hotel2',city:'LED'},
        ];
        VoyangaCalendarTimeline.init()
      ,1000
    )

  render: (view, data) ->
    @trigger "viewChanged", view, data
