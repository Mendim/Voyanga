# FIXME most likely leaks
ko.bindingHandlers.photoSlider =
  init: (element, valueAccessor) ->
    value = ko.utils.unwrapObservable valueAccessor()
#    $(element).addClass('selectSlider')
    console.log('try start photoslider!!!!')
    $(element).photoSlider({})

  update: (element, valueAccessor) ->
    #value = ko.utils.unwrapObservable valueAccessor()
    #console.log @slider, value.from, value.to, "!!!!!!!!"
    #@slider("value", value.from, value.to)
  