###
SEARCH controller, should be splitted once we will get more actions here
###
class AviaController
  constructor: (@searchParams)->
    @api = new AviaAPI
    @routes =
      '/search/*rest': @searchAction
      '': @indexAction

    @results = do ko.observable 

    # Mix in events
    _.extend @, Backbone.Events

  searchAction: (args)=>
    # update search params with values in route
    @searchParams.fromString args
    window.VisualLoaderInstance.start(@api.loaderDescription,18)
    @api.search  @searchParams.url(), @handleSearch

  handleSearch: (data)=>
    try
      stacked = @handleResults(data)
    catch err
      window.VisualLoaderInstance.hide()   
      if err=='404'
        new ErrorPopup 'avia404'
        return
      throw new Error("Unable to build AviaResultSet from search response")

    @results stacked
    
    GAPush ['_trackEvent', 'Avia_show_search_results', @searchParams.GAKey(),  @searchParams.GAData(), stacked.data.length, true]
    @render 'results', {results: @results}
    ko.processAllDeferredBindingUpdates()

  handleResults: (data) =>
    window.voyanga_debug "searchAction: handling results", data
    stacked = new AviaResultSet data.flights.flightVoyages, data.siblings
    stacked.injectSearchParams data.searchParams
    stacked.postInit()
    stacked.checkTicket = @checkTicketAction
    return stacked

  indexAction: =>
    window.voyanga_debug "AVIA: invoking indexAction"
    @render "index", {}

  
  checkTicketAction: (result, resultDeferred)=>
    now = moment()
    diff = now.diff(@results().creationMoment, 'seconds')
    if diff < AVIA_TICKET_TIMELIMIT
      resultDeferred.resolve(result)
      return
      
    window.VisualLoaderInstance.start('Идет проверка выбранных выриантов<br>Это может занять от 5 до 30 секунд')
   
    @api.search  @searchParams.url(), (data)=>
      try
        stacked = @handleResults(data)
      catch err
        window.VisualLoaderInstance.hide()
        throw new Error("Unable to build AviaResultSet from search response. Check ticket")
      result = stacked.findAndSelect(result)
      window.VisualLoaderInstance.hide()
      if result
        resultDeferred.resolve(result)
      else
        new ErrorPopup 'aviaNoTicketOnValidation', "Билет не найден, выберите другой.", false, ->
        @results stacked

  render: (view, data) ->
    @trigger "viewChanged", view, data


