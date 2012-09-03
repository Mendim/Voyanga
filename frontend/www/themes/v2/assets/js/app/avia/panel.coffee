MAX_TRAVELERS = 9
MAX_CHILDREN = 8

# Recursion work around
EXITED = true

###
Balances number of travelers, using those which was not affected by most recent user change
###
balanceTravelers = (others, model)->
  if model.overall() > MAX_TRAVELERS && EXITED
    EXITED = false
    # How many travelers we need to throw out
    delta = model.overall() - MAX_TRAVELERS
    for prop in others
      if model[prop]() >= delta
        model[prop] model[prop]() - delta
        break
      else
        delta -= model[prop]()
        model[prop] 0
  EXITED = true


class AviaPanel
  constructor: ->
    @rt = ko.observable false
    @minimized = ko.observable false

    # Popup inputs
    @adults = ko.observable(5).extend({integerOnly: 'adult'})
    @children = ko.observable(2).extend({integerOnly: true})
    @infants = ko.observable(2).extend({integerOnly: 'infant'})

    # Travelers constraits
    @adults.subscribe (newValue) =>
      if @infants() > @adults()
        @infants @adults()

      if newValue > MAX_TRAVELERS
        @adults MAX_TRAVELERS

      balanceTravelers ["children", 'infants'], @


    @children.subscribe (newValue) =>
      if newValue > MAX_TRAVELERS - 1
        @children MAX_TRAVELERS - 1

      balanceTravelers ["adults", 'infants'], @

    @infants.subscribe (newValue) =>
      if newValue > @adults()
        @adults @infants()

      balanceTravelers ["children", 'adults'], @

    @sum_children = ko.computed =>
      # dunno why but we have stange to string casting here
      @children()*1 + @infants()*1

    @overall = ko.computed =>
      @adults()*1 + @children()*1 + @infants()*1

    @rt.subscribe (newValue) ->
      if newValue
        $('.tumblr .switch').animate {'left': '35px'}, 200
      else
        $('.tumblr .switch').animate {'left': '-1px'}, 200

    @minimized.subscribe (minimized) ->
      speed =  300
      heightSubHead = $('.sub-head').height()

      if !minimized
        $('.sub-head').animate {'margin-top' : '0px'}, speed
      else
        $('.sub-head').animate {'margin-top' : '-'+(heightSubHead-4)+'px'}, speed

    # FIXME:
    $ ->
      $('.how-many-man .popup').find('input').hover ->
        $(this).parent().find('.plusOne').show()
        $(this).parent().find('.minusOne').show()

      $('.adults,.childs,.small-childs').hover null,   ->
        $(this).parent().find('.plusOne').hide()
        $(this).parent().find('.minusOne').hide()

      $('.plusOne').hover ->
        $(this).addClass('active')
        $('.minusOne').addClass('active')
      , ->
        $(this).removeClass('active')
        $('.minusOne').removeClass('active')

      $('.minusOne').hover ->
        $(this).addClass('active');
        $('.plusOne').addClass('active')
      , ->
        $(this).removeClass('active')
        $('.plusOne').removeClass('active')

      # Placeholder-like behaviour for inputs
      $('.how-many-man .popup').find('input').focus ->
        $(@).attr 'rel', $(@).val()
        $(@).val('')

      $('.how-many-man .popup').find('input').blur ->
        if $(@).val() == ''
          $(@).val $(@).attr 'rel'
        $(@).trigger 'change'

  selectOneWay: =>
    @rt(false)

  selectRoundTrip: =>
    @rt(true)

  # Minimize button click handler
  minimize: ->
    if @minimized()
      @minimized(false)
    else
      @minimized(true)

  plusOne: (model, e)->
    prop = $(e.target).attr("rel")
    model[prop](model[prop]()+1)

  minusOne: (model, e)->
    prop = $(e.target).attr("rel")
    model[prop](model[prop]()-1)

# TODO SIZE OF THE PEPOPLE COUNTER xN

