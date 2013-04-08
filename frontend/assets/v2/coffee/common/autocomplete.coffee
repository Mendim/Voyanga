ko.bindingHandlers.autocomplete =
  init: (element, valueAccessor) ->
    $(element).bind "focus", ->
      $(element).change()
    $(element).typeahead
      name: 'cities', # The string used to identify the dataset. Used by typeahead.js to cache intelligently
      limit: 10 # The max number of suggestions from the dataset to display for a given query
      prefetch: '/js/cities.json'
      template: '<div title="{{value}}"><span class="city">{{name}}, </span><span class="country">{{country}}</span><span class="code">{{code}}</span></div>'
      engine: Hogan
    $(element).on 'typeahead:selected', (e, data) -> # Callback функция, срабатывающая на выбор одного из предложенных вариантов,
        valueAccessor().iata(data.code)
        valueAccessor().readable(data.name)
        valueAccessor().readableGen(data.nameGen)
        valueAccessor().readableAcc(data.nameAcc)
        valueAccessor().readablePre(data.namePre)
        $(element).val(data.name)
        $(element).parent().siblings('input.input-path').val(data.value + ', ' + data.country)

  update: (element, valueAccessor) =>
    iataCode = valueAccessor().iata()
    $(element).typeahead("setQuery", iataCode).data('ttView').datasets[0].getSuggestions iataCode, (s) ->
      data = s[0].datum
      $(element).val(data.name)
      valueAccessor().readable(data.name)
      valueAccessor().readableGen(data.nameGen)
      valueAccessor().readableAcc(data.nameAcc)
      valueAccessor().readablePre(data.namePre)