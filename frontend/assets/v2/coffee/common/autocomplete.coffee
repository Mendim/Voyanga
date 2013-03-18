ko.bindingHandlers.autocomplete =
  init: (element, valueAccessor) ->
    showCode = (if valueAccessor().showCode is `undefined` then true else valueAccessor().showCode)
    setTimeout ()=>
      $(element).bind "focus", ->
        $(element).change()
      $(element).autocomplete
        serviceUrl: window.apiEndPoint + "/helper/autocomplete/" + valueAccessor().source # Страница для обработки запросов автозаполнения
        minChars: 2 # Минимальная длина запроса для срабатывания автозаполнения
        delimiter: /(,|;)\s*/ # Разделитель для нескольких запросов, символ или регулярное выражение
        maxHeight: 400 # Максимальная высота списка подсказок, в пикселях
        zIndex: 9999 # z-index списка
        deferRequestBy: 0 # Задержка запроса (мсек), на случай, если мы не хотим слать миллион запросов, пока пользователь печатает. Я обычно ставлю 300.
        delay: 0
        showCode: showCode
        onSelect: (value, data) -> # Callback функция, срабатывающая на выбор одного из предложенных вариантов,
          valueAccessor().iata(data.code)
          valueAccessor().readable(data.name)
          valueAccessor().readableGen(data.nameGen)
          valueAccessor().readableAcc(data.nameAcc)
          valueAccessor().readablePre(data.namePre)
          $(element).val(data.name)
          $(element).siblings('input.input-path').val(value)
        onActivate: (value, data) ->
          valueAccessor().readable(data.name)
          valueAccessor().readableGen(data.nameGen)
          valueAccessor().readableAcc(data.nameAcc)
          valueAccessor().readablePre(data.namePre)
          $(element).val(data.name)
          $(element).siblings('input.input-path').val(value)
      , 500

    $(element).on "keyup", (e) ->
      if ((e.keyCode == 8) || (e.keyCode == 46))
        valueAccessor().iata('')
        valueAccessor().readable('')
        valueAccessor().readableGen('')
        valueAccessor().readableAcc('')
        valueAccessor().readablePre('')


  update: (element, valueAccessor) =>
    iataCode = valueAccessor().iata()

    url = (code) ->
      result = window.apiEndPoint + '/helper/autocomplete/citiesReadable?'
      params = []
      params.push 'codes[0]=' + code
      result += params.join "&"
      return result

    handleResults = (data) ->
      valueAccessor().readable(data[iataCode].name)
      valueAccessor().readableGen(data[iataCode].nameGen)
      valueAccessor().readableAcc(data[iataCode].nameAcc)
      valueAccessor().readablePre(data[iataCode].namePre)
      if ($(element).val().length == 0)
        $(element).val(data[iataCode].name)
        $(element).siblings('input.input-path').val(data[iataCode].label)

    if (iataCode.length > 0)
      $.ajax
        url: url iataCode
        dataType: 'json'
        success: handleResults

