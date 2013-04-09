ko.bindingHandlers.autocomplete =
  init: (element, valueAccessor) ->
    $(element).bind "focus", ->
      $(element).select()
    $(element).typeahead
      name: 'cities-'+valueAccessor().name # The string used to identify the dataset. Used by typeahead.js to cache intelligently
      limit: 5 # The max number of suggestions from the dataset to display for a given query
      prefetch: '/js/cities.json'
      remote: window.apiEndPoint + "helper/autocomplete/" + valueAccessor().source + '/query/%QUERY' # Страница для обработки запросов автозаполнения
      template: '<div title="{{value}}"><span class="city">{{name}}, </span><span class="country">{{country}}</span><span class="code">{{code}}</span></div>'
      engine: Hogan

    $(element).on 'typeahead:selected typeahead:autocompleted', (e, data) -> # Callback функция, срабатывающая на выбор одного из предложенных вариантов,
      valueAccessor().iata(data.code)
      valueAccessor().readable(data.name)
      valueAccessor().readableGen(data.nameGen)
      valueAccessor().readableAcc(data.nameAcc)
      valueAccessor().readablePre(data.namePre)
      $(element).val(data.name)
      $(element).parent().siblings('input.input-path').val(data.value + ', ' + data.country)
    $(element).on 'typeahead:over', (e, data) -> # Callback функция, срабатывающая на выбор одного из предложенных вариантов,
      $(element).parent().siblings('input.input-path').val(data.value + ', ' + data.country)
    $(element).on 'typeahead:reset', (e) -> # Callback функция, срабатывающая на выбор одного из предложенных вариантов,
      $(element).parent().siblings('input.input-path').val('')


  update: (element, valueAccessor) =>
    iataCode = valueAccessor().iata()
    content = valueAccessor().readable()
    if content == undefined then content=''
    _.each $(element).typeahead("setQueryInternal", content).data('ttView').datasets, (dataset)->
      dataset.getOneSuggestion iataCode, (s) ->
        if (s.length>0)
          data = s[0].datum
          valueAccessor().readable(data.name)
          valueAccessor().readableGen(data.nameGen)
          valueAccessor().readableAcc(data.nameAcc)
          valueAccessor().readablePre(data.namePre)
          if ($(element).val().length==0)
            $(element).val(data.name)
            $(element).parent().siblings('input.input-path').val(data.value + ', ' + data.country)
