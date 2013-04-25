ko.bindingHandlers.autocomplete =
  init: (element, valueAccessor) ->
    $(element).focus () ->
      this.select()
      this.setSelectionRange(0, 9999)
    .mouseup (e)->
      e.preventDefault()
    $(element).typeahead
      name: 'cities' + valueAccessor().name
      limit: 5 # The max number of suggestions from the dataset to display for a given query
      prefetch: '/js/cities.json'
      remote: window.apiEndPoint + "helper/autocomplete/" + valueAccessor().source + '/query/%QUERY' # Страница для обработки запросов автозаполнения
      template: '<div title="{{value}}"><span class="city">{{name}}, </span><span class="country">{{country}}</span><span class="code">{{code}}</span></div>'
      engine: Hogan

    $(element).on 'typeahead:selected typeahead:autocompleted', (e, data) -> # Callback функция, срабатывающая на выбор одного из предложенных вариантов,
      voyanga_debug('allinone',$(element).data(),data,e)
      dataset = $(element).data('ttView').datasets[0]
      if data.t == 2
        for ind in data.aviaIds
          city = dataset.itemHash[dataset.uniqFindId(ind,'/js/cities.json')].datum
          console.log('avia in place', ind,dataset.uniqFindId(ind,'/js/cities.json'), city)

      valueAccessor().iata(data.code)
      valueAccessor().readable(data.name)
      valueAccessor().readableGen(data.nameGen)
      valueAccessor().readableAcc(data.nameAcc)
      valueAccessor().readablePre(data.namePre)
      $(element).val(data.name)
      $(element).parent().siblings('input.input-path').val(data.value + ', ' + data.country)
      if ((!$(element).is('.arrivalCity')) && ($('input.arrivalCity').length>0))
        $('input.arrivalCity.second-path').focus()
      else
        $(element).blur()
    $(element).on 'typeahead:over', (e, data) -> # Callback функция, срабатывающая на выбор одного из предложенных вариантов,
      $(element).parent().siblings('input.input-path').val(data.value + ', ' + data.country)
    $(element).on 'typeahead:reset', (e) -> # Callback функция, срабатывающая на выбор одного из предложенных вариантов,
      $(element).parent().siblings('input.input-path').val('')
      valueAccessor().iata('')
      valueAccessor().readable('')
      valueAccessor().readableGen('')
      valueAccessor().readableAcc('')
      valueAccessor().readablePre('')


  update: (element, valueAccessor) =>
    iataCode = valueAccessor().iata()
    content = valueAccessor().readable()
    if content == undefined then content=iataCode
    _.each $(element).typeahead("setQueryInternal", content).data('ttView').datasets, (dataset)->
      dataset.getSuggestions iataCode, (s) ->
        if (s.length>0)
          _.each s, (s)->
            if (s.datum.code==iataCode)
              data = s.datum
              valueAccessor().readable(data.name)
              valueAccessor().readableGen(data.nameGen)
              valueAccessor().readableAcc(data.nameAcc)
              valueAccessor().readablePre(data.namePre)
              if (($(element).val().length==0) || ($(element).val() != data.name))
                $(element).val(data.name)
                $(element).parent().siblings('input.input-path').val(data.value + ', ' + data.country)
