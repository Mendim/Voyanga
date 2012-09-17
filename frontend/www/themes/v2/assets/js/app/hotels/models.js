var HotelResult, HotelsResultSet, Room, RoomSet, STARS_VERBOSE,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

STARS_VERBOSE = ['one', 'two', 'three', 'four', 'five'];

Room = (function() {

  function Room(data) {
    this.name = data.showName;
    this.meal = data.meal;
    this.hasMeal = this.meal !== 'Без питания' && this.meal !== 'Не известно';
  }

  return Room;

})();

RoomSet = (function() {

  function RoomSet(data) {
    var room, _i, _len, _ref;
    this.price = data.rubPrice;
    this.rooms = [];
    _ref = data.rooms;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      room = _ref[_i];
      this.rooms.push(new Room(room));
    }
  }

  return RoomSet;

})();

HotelResult = (function() {

  function HotelResult(data) {
    this.smallMapUrl = __bind(this.smallMapUrl, this);

    this.showMap = __bind(this.showMap, this);

    this.closeDetails = __bind(this.closeDetails, this);

    this.showMapDetails = __bind(this.showMapDetails, this);

    this.showDetails = __bind(this.showDetails, this);

    this.showPhoto = __bind(this.showPhoto, this);
    _.extend(this, Backbone.Events);
    this.hotelName = data.hotelName;
    this.address = data.address;
    this.description = data.description;
    this.photos = data.images;
    this.numPhotos = 0;
    this.frontPhoto = {
      smallUrl: 'http://upload.wikimedia.org/wikipedia/en/thumb/7/78/Trollface.svg/200px-Trollface.svg.png',
      largeUrl: 'http://ya.ru'
    };
    if (this.photos && this.photos.length) {
      this.frontPhoto = this.photos[0];
      this.numPhotos = this.photos.length;
    }
    this.activePhoto = this.frontPhoto['largeUrl'];
    this.stars = STARS_VERBOSE[data.categoryId - 1];
    this.rating = data.rating;
    this.lat = data.latitude / 1;
    this.lng = data.longitude / 1;
    this.distanceToCenter = Math.round(data.centerDistance / 1000);
    this.hasHotelServices = data.facilities ? true : false;
    this.hotelServices = data.facilities;
    this.roomSets = [];
    this.push(data);
  }

  HotelResult.prototype.push = function(data) {
    var set;
    set = new RoomSet(data);
    if (this.roomSets.length === 0) {
      this.cheapest = set.price;
    } else {
      this.cheapest = set.price < this.cheapest ? set.price : this.cheapest;
    }
    return this.roomSets.push(set);
  };

  HotelResult.prototype.showPhoto = function() {
    return new PhotoBox(this.photos);
  };

  HotelResult.prototype.showDetails = function() {
    var _this = this;
    this.readMoreExpanded = false;
    window.voyanga_debug("HOTELS: Setting popup result", this);
    this.trigger("popup", this);
    $('body').prepend('<div id="popupOverlay"></div>');
    $('#hotels-body-popup').show();
    ko.processAllDeferredBindingUpdates();
    SizeBox('hotels-popup-body');
    ResizeBox('hotels-popup-body');
    sliderPhoto('.photo-slide-hotel');
    $(".description .text").dotdotdot({
      watch: 'window'
    });
    this.mapInitialized = false;
    return $('#popupOverlay').click(function() {
      return _this.closeDetails();
    });
  };

  HotelResult.prototype.showMapDetails = function() {
    this.showDetails();
    return this.showMap();
  };

  HotelResult.prototype.closeDetails = function() {
    window.voyanga_debug("Hiding popup");
    $('#hotels-body-popup').hide();
    return $('#popupOverlay').remove();
  };

  HotelResult.prototype.showMap = function(context, event) {
    var coords, el, map, mapOptions, marker;
    el = $('#hotels-popup-tumblr-map');
    if (el.hasClass('active')) {
      return;
    }
    $('.place-buy .tmblr li').removeClass('active');
    el.addClass('active');
    $('.tab').hide();
    $('#hotels-popup-map').show();
    $('#boxContent').css('height', $('#hotels-popup-map').height() + $('#hotels-popup-header1').height() + $('#hotels-popup-header2').height() + 'px');
    if (!this.mapInitialized) {
      coords = new google.maps.LatLng(this.lat, this.lng);
      mapOptions = {
        center: coords,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      map = new google.maps.Map($('#hotels-popup-gmap')[0], mapOptions);
      marker = new google.maps.Marker({
        position: coords,
        map: map,
        title: this.hotelName
      });
      this.mapInitialized = true;
    }
    return SizeBox('hotels-popup-body');
  };

  HotelResult.prototype.showDescription = function(context, event) {
    var el;
    el = $('#hotels-popup-tumblr-description');
    if (el.hasClass('active')) {
      return;
    }
    $('.place-buy .tmblr li').removeClass('active');
    el.addClass('active');
    $('.tab').hide();
    $('#hotels-popup-description').show();
    $(".description .text").dotdotdot({
      watch: 'window'
    });
    $('#boxContent').css('height', 'auto');
    return SizeBox('hotels-popup-body');
  };

  HotelResult.prototype.readMore = function(context, event) {
    var el, rel, var_heightCSS;
    el = $(event.currentTarget);
    if (!el.hasClass('active')) {
      var_heightCSS = el.parent().find('.text').css('height');
      var_heightCSS = Math.abs(parseInt(var_heightCSS.slice(0, -2)));
      el.parent().find('.text').attr('rel', var_heightCSS).css('height', 'auto');
      $(".description .text").dotdotdot({
        watch: 'window'
      });
      $(".description .text").css('overflow', 'visible');
      el.text('Свернуть');
      el.addClass('active');
    } else {
      rel = el.parent().find('.text').attr('rel');
      el.parent().find('.text').css('height', rel + 'px');
      el.text('Подробнее');
      el.removeClass('active');
      $(".description .text").dotdotdot({
        watch: 'window'
      });
      $(".description .text").css('overflow', 'hidden');
    }
    return SizeBox('hotels-popup-body');
  };

  HotelResult.prototype.smallMapUrl = function() {
    var base;
    base = "http://maps.googleapis.com/maps/api/staticmap?zoom=13&size=310x190&maptype=roadmap&markers=color:red%7Ccolor:red%7C";
    base += "%7C";
    base += this.lat + "," + this.lng;
    base += "&sensor=false";
    return base;
  };

  return HotelResult;

})();

HotelsResultSet = (function() {

  function HotelsResultSet(rawHotels) {
    var hotel, key, result, _i, _len, _ref,
      _this = this;
    this._results = {};
    for (_i = 0, _len = rawHotels.length; _i < _len; _i++) {
      hotel = rawHotels[_i];
      key = hotel.hotelId;
      if (this._results[key]) {
        this._results[key].push(hotel);
      } else {
        result = new HotelResult(hotel);
        this._results[key] = result;
        result.on("popup", function(data) {
          return _this.popup(data);
        });
      }
    }
    this.data = [];
    _ref = this._results;
    for (key in _ref) {
      result = _ref[key];
      this.data.push(result);
    }
    this.popup = ko.observable(this.data[0]);
  }

  return HotelsResultSet;

})();
