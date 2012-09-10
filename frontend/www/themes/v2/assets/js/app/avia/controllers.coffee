###
SEARCH controller, should be splitted once we will get more actions here
###
class AviaController
  constructor: (@searchParams)->
    @routes =
      '/search/:from/:to/:when/:adults/:children/:infants/': @searchAction
      '': @indexAction

    # Mix in events
    _.extend @, Backbone.Events

  searchAction: (args...)=>
    window.voyanga_debug "AVIA: Invoking searchAction", args
    # update search params with values in route
    @searchParams.fromList(args)

    # temporary development cache
    key = "search_" + @searchParams.key()
    if sessionStorage.getItem(key)
      window.voyanga_debug "AVIA: Getting result from cache"
      @handleResults(JSON.parse(sessionStorage.getItem(key)))
    else
      window.voyanga_debug "AVIA: Getting results via JSONP"
      $.ajax
        url: @searchParams.url()
        dataType: 'jsonp'
        success: @handleResults

  getFilterLimitValues: (results)=>
    console.log(results)


  handleResults: (data) =>
    window.voyanga_debug "searchAction: handling results", data

    # temporary development cache
    key = "search_" + @searchParams.key()
    sessionStorage.setItem(key, JSON.stringify(data))
    stacked = new AviaResultSet data.flights.flightVoyages
    @myobj = ko.observable true
    @myobj.subscribe (newValue)->
      alert(newValue)
    console.log(@myobj)
    console.log(data)
    this.getFilterLimitValues(stacked)
    @aviaFiltersInit = {
      flightClassFilter:{value: data.searchParams.serviceClass},
      departureTimeSliderDirect:{
        fromTime: stacked.timeLimits.departureFromTime,
        toTime: stacked.timeLimits.departureToTime
      },
      arrivalTimeSliderDirect:{
        fromTime: stacked.timeLimits.arrivalFromTime,
        toTime: stacked.timeLimits.arrivalToTime
      },
      departureTimeSliderReturn:{
        fromTime: stacked.timeLimits.departureFromTimeReturn,
        toTime: stacked.timeLimits.departureToTimeReturn
      },
      arrivalTimeSliderReturn:{
        fromTime: stacked.timeLimits.arrivalFromTimeReturn,
        toTime: stacked.timeLimits.arrivalToTimeReturn
      },
      rt: data.searchParams.isRoundTrip
    }


    @render 'results', {'results' :stacked}
    window.setTimeout(
      ()=>
        AviaFilters.init(@aviaFiltersInit)
      ,1000
    )
    @trigger "sidebarChanged", 'filters', {'testInput': @myobj, 'results' :stacked}


  indexAction: =>
    window.voyanga_debug "AVIA: invoking indexAction"

    @render 'index', {}

  render: (view, data) ->
    @trigger "viewChanged", view, data
