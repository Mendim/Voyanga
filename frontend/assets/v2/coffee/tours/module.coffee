###
Tours module
Controller + panel
###
class ToursModule
  constructor: ->
    @controller = new ToursController()# @panel.sp
    @panel = false
    console.log 'I AM PANEL', @panel
    @controller.on 'results', (results) =>
      @panel results.panel

  resize: ->
    # FIXME
    ResizeAvia()