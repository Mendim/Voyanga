class TourPanelSet
  constructor: ->
    _.extend @, Backbone.Events

    window.voyanga_debug 'Init of TourPanelSet'

    @template = 'tour-panel-template'
    @sp = new TourSearchParams()

    @prevPanel = 'hotels'
    @nextPanel = 'avia'
    @icon = 'constructor-ico';
    @indexMode = true

    @startCity = @sp.startCity
    @startCityReadable = ko.observable ''
    @startCityReadableGen = ko.observable ''
    @startCityReadableAcc = ko.observable ''
    @panels = ko.observableArray []
    @activeCity = ko.observable('')
    @sp.calendarActivated = ko.observable(true)
    @calendarText = ko.computed =>
      result = 'Выберите даты пребывания в городе'
      if @activeCity()
        result += ' ' + @activeCity()
      return result

    @lastPanel = null
    @i = 0
    @addPanel()
    @activeCalendarPanel = ko.observable @panels()[0]

    @height = ko.computed =>
      64 * @panels().length + 'px'

    @isMaxReached = ko.computed =>
      @panels().length > 6

    @calendarValue = ko.computed =>
      twoSelect: true
      hotels: true
      from: @activeCalendarPanel().checkIn()
      to: @activeCalendarPanel().checkOut()

    @formFilled = ko.computed =>
      isFilled = @startCity()
      _.each @panels(), (panel) ->
        isFilled = isFilled && panel.formFilled()
      return isFilled

    @formNotFilled = ko.computed =>
      !@formFilled()

  navigateToNewSearch: =>
    if (@formNotFilled())
      return
    _.last(@panels()).handlePanelSubmit()
    _.last(@panels()).minimizedCalendar(true)

  navigateToNewSearchMainPage: =>
    if (@formNotFilled())
      return
    if @selectedParams
      _.last(@panels()).selectedParams = @selectedParams
    _.last(@panels()).handlePanelSubmit(false)

  saveStartParams: =>
    _.last(@panels()).saveStartParams()

  deletePanel: (elem) =>
    @sp.destinations.remove(elem.city)
    @panels.remove(elem)
    _.last(@panels()).isLast(true)

  isFirst: =>
    @i == 1

  addPanel: =>
    @sp.destinations.push new DestinationSearchParams()
    if _.last(@panels())
      _.last(@panels()).isLast(false)
    newPanel = new TourPanel(@sp, @i, @i==0)
    newPanel.on "tourPanel:showCalendar", (args...) =>
      @activeCity(newPanel.cityReadable())
      @showPanelCalendar(args)
    newPanel.on "tourPanel:hasFocus", (args...) =>
      @activeCity(newPanel.cityReadable())
      @showPanelCalendar(args)
    @panels.push newPanel
    @lastPanel = newPanel
    @i = @panels().length
    VoyangaCalendarStandart.clear()

  showPanelCalendar: (args) =>
    VoyangaCalendarStandart.clear()
    @activeCalendarPanel  args[0]
    console.log 'showPanelCalendar', args

  # calendar handler
  setDate: (values) =>
    console.log 'Calendar selected:', values
    if values && values.length
      @activeCalendarPanel().checkIn values[0]
      if values.length > 1
        @activeCalendarPanel().checkOut values[1]


  calendarHidden: =>
#    console.error("HANDLE ME")

class TourPanel extends SearchPanel
  constructor: (sp, ind, isFirst) ->
    window.voyanga_debug "TourPanel created"
    super(isFirst)

    _.extend @, Backbone.Events

    @hasfocus = ko.observable false
    @sp = sp
    @isLast = ko.observable true
    @peopleSelectorVM = new HotelPeopleSelector sp
    @destinationSp = _.last(sp.destinations());
    @city = @destinationSp.city
    @checkIn = @destinationSp.dateFrom
    @checkOut = @destinationSp.dateTo
    @cityReadable = ko.observable ''
    @cityReadableGen = ko.observable ''
    @cityReadableAcc = ko.observable ''

    #helper to save calendar state
    @oldCalendarState = @minimizedCalendar()

    @formFilled = ko.computed =>
      @city() && @checkIn() && @checkOut()

    @formNotFilled = ko.computed =>
      !@formFilled()

    @maximizedCalendar = ko.computed =>
      @city().length > 0

    @calendarText = ko.computed =>
      result = "Выберите дату поездки "
      return result

    @hasfocus.subscribe (newValue) =>
      console.log "HAS FOCUS", @
      @trigger "tourPanel:hasFocus", @

    @city.subscribe (newValue) =>
      console.log('city changed!!!!!!!!')
      if @sp.calendarActivated()
        @showCalendar()

  handlePanelSubmitToMain: =>
    handlePanelSubmit(false)

  handlePanelSubmit: (onlyHash = true)=>
    console.log('onlyHash',onlyHash)
    if onlyHash
      app.navigate @sp.getHash(), {trigger: true}
    else

      url = '/#'+@sp.getHash()
      if @startParams == url
        url += 'oldSelecton/'+encodeURIComponent(JSON.stringify(@selectedParams))

      console.log('go url',url,'length', url.length)
      return
      window.location.href = url

  saveStartParams: ()=>
    url = '/#'+@sp.getHash()
    @startParams = url

  close: ->
    $(document.body).unbind 'mousedown'
    $('.how-many-man .btn').removeClass('active')
    $('.how-many-man .content').removeClass('active')
    $('.how-many-man').find('.popup').removeClass('active')

  showFromCityInput: (panel, event) ->
    elem = $('.cityStart .second-path')
    elem.data('old', elem.val())
    el = elem.closest('.tdCity')
    el.find(".from").addClass("overflow").animate
      width: "125px"
    , 300
    el.find(".startInputTo").show()
    el.find('.cityStart').animate
      width: "261px"
    , 300, ->
      el.find(".startInputTo").find("input").focus().select()

  hideFromCityInput: (panel, event) ->
    elem = $('.startInputTo .second-path')
    console.log "Hide city input", elem.parent()
    startInput = $('div.startInputTo')
    toInput = $('div.overflow')
    if startInput.is(':visible')
      toInput.animate
        width: "271px"
      , 300, ->
        toInput.removeClass "overflow"
    
      $(".cityStart").animate
        width: "115px"
      , 300
      startInput.animate
        opacity: "1"
      , 300, ->
        startInput.hide()

  showCalendar: =>
    $('.calenderWindow').show()
    @trigger "tourPanel:showCalendar", @
    if @minimizedCalendar()
      ResizeAvia()
      @minimizedCalendar(false)

  checkInHtml: =>
    if @checkIn()
      return dateUtils.formatHtmlDayShortMonth @checkIn()
    return ''

  checkOutHtml: =>
    if @checkOut()
      return dateUtils.formatHtmlDayShortMonth @checkOut()
    return ''


$(document).on "keyup change", "input.second-path", (e) ->
  firstValue = $(this).val()
  secondEl = $(this).siblings('input.input-path')
  if ((e.keyCode==8) || (firstValue.length<3))
    secondEl.val('')

$(document).on  "keyup change", '.cityStart input.second-path', (e) ->
  elem = $('.from.active .second-path')
  if (e.keyCode==13)
    if elem.parent().hasClass("overflow")
      elem.parent().animate
        width: "271px"
      , 300, ->
        $(this).removeClass "overflow"
        $('.from.active .second-path').focus()

      $(".cityStart").animate
        width: "115px"
      , 300
      $(".cityStart").find(".startInputTo").animate
        opacity: "1"
      , 300, ->
        $(this).hide()