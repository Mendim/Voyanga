###
SEARCH controller, should be splitted once we will get more actions here
###
class ToursController
  constructor: (@searchParams)->
    @api = new ToursAPI
    @routes =
      '/search' : @searchAction
      '': @indexAction
    @key = "tours_10"

    # Mix in events
    _.extend @, Backbone.Events

  indexAction: (args...) =>
    window.voyanga_debug "TOURS: Invoking indexAction", args
    events = []
    $.each window.eventsRaw, (i, el) ->
      events.push new Event(el)
    eventSet = new EventSet(events)
    console.log "EVENT: eventset = ", eventSet
    @render 'index', eventSet
    ResizeAvia()

  searchAction: (args...)=>
    window.voyanga_debug "TOURS: Invoking searchAction", args
    # update search params with values in route
    # tempoprary development cache
    
    if sessionStorage.getItem(@key) && (window.location.host != 'test.voyanga.com')
      window.voyanga_debug "TOURS: Getting result from cache"
      @handleResults(JSON.parse(sessionStorage.getItem(@key)))
    else
      @api.search @handleResults

  handleResults: (data) =>
    window.voyanga_debug "searchAction: handling results", data

    sessionStorage.setItem(@key, JSON.stringify(data))
    stacked = new ToursResultSet data
    @trigger "results", stacked
    @render 'results', stacked

#    @trigger "sidebarChanged", filters
    ko.processAllDeferredBindingUpdates()

  render: (view, data) ->
    @trigger "viewChanged", view, data
