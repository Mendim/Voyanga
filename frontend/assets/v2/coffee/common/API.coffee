class API
  constructor: ->
    @endpoint = 'http://api.voyanga.com/v1/'

  call: (url, cb) =>
    $('#loadWrapBg').show()

    #  $(document).trigger 'aviaStart'
    if sessionStorage.getItem("#{@endpoint}#{url}")
      cb(JSON.parse(sessionStorage.getItem("#{@endpoint}#{url}")))
      return $('#loadWrapBg').hide()
     
    $.ajax
      url: "#{@endpoint}#{url}"
      dataType: 'jsonp'
      timeout: 60000
      success: (data)=>
        sessionStorage.setItem("#{@endpoint}#{url}", JSON.stringify(data))
        cb(data)
        $('#loadWrapBg').hide()
      error: ->
        console.log( "ERROR")
        $('#loadWrapBg').hide()
        cb(false)

class ToursAPI extends API
  search: (cb)=>
    @call "tour/search?start=BCN&destinations%5B0%5D%5Bcity%5D=MOW&destinations%5B0%5D%5BdateFrom%5D=5.10.2012&destinations%5B0%5D%5BdateTo%5D=10.10.2012&rooms%5B0%5D%5Badt%5D=1&rooms%5B0%5D%5Bchd%5D=0&rooms%5B0%5D%5BchdAge%5D=0&rooms%5B0%5D%5Bcots%5D=0", (data) -> cb(data)

class AviaAPI extends API
  search: (url, cb)=>
    @call url, (data) -> cb(data)

class HotelsAPI extends API
  search: (url, cb)=>
    @call url, (data) -> cb(data)