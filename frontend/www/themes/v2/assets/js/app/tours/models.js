var TourEntry, ToursAviaResultSet, ToursHotelsResultSet, ToursResultSet,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

TourEntry = (function() {

  function TourEntry() {
    this.rt = __bind(this.rt, this);

    this.savings = __bind(this.savings, this);

    this.priceText = __bind(this.priceText, this);

    this.price = __bind(this.price, this);

    this.isHotel = __bind(this.isHotel, this);

    this.isAvia = __bind(this.isAvia, this);
    _.extend(this, Backbone.Events);
  }

  TourEntry.prototype.isAvia = function() {
    return this.avia;
  };

  TourEntry.prototype.isHotel = function() {
    return this.hotels;
  };

  TourEntry.prototype.price = function() {
    if (this.selection() === null) {
      return 0;
    }
    return this.selection().price;
  };

  TourEntry.prototype.priceText = function() {
    if (this.selection() === null) {
      return "Не выбрано";
    }
    return this.price() + '<span class="rur">o</span>';
  };

  TourEntry.prototype.savings = function() {
    if (this.selection() === null) {
      return 0;
    }
    return 555;
  };

  TourEntry.prototype.rt = function() {
    return false;
  };

  return TourEntry;

})();

ToursAviaResultSet = (function(_super) {

  __extends(ToursAviaResultSet, _super);

  function ToursAviaResultSet(raw, sp) {
    this.rt = __bind(this.rt, this);

    this.dateHtml = __bind(this.dateHtml, this);

    this.dateClass = __bind(this.dateClass, this);

    this.additionalText = __bind(this.additionalText, this);

    this.destinationText = __bind(this.destinationText, this);

    this.doNewSearch = __bind(this.doNewSearch, this);

    this.newResults = __bind(this.newResults, this);
    this.api = new AviaAPI;
    this.template = 'avia-results';
    this.panel = new AviaPanel();
    this.panel.handlePanelSubmit = this.doNewSearch;
    this.panel.sp.fromObject(sp);
    this.results = ko.observable();
    this.selection = ko.observable(null);
    this.newResults(raw, sp);
    this.data = {
      results: this.results
    };
  }

  ToursAviaResultSet.prototype.newResults = function(raw, sp) {
    var result,
      _this = this;
    result = new AviaResultSet(raw);
    result.injectSearchParams(sp);
    result.postInit();
    result.recommendTemplate = 'avia-tours-recommend';
    result.tours = true;
    result.select = function(res) {
      if (res.ribbon) {
        res = res.data;
      }
      result.selected_key(res.key);
      return _this.selection(res);
    };
    this.avia = true;
    this.selection(null);
    return this.results(result);
  };

  ToursAviaResultSet.prototype.doNewSearch = function() {
    var _this = this;
    return this.api.search(this.panel.sp.url(), function(data) {
      return _this.newResults(data.flights.flightVoyages, data.searchParams);
    });
  };

  ToursAviaResultSet.prototype.destinationText = function() {
    return this.results().departureCity + ' &rarr; ' + this.results().arrivalCity;
  };

  ToursAviaResultSet.prototype.additionalText = function() {
    if (this.selection() === null) {
      return "";
    }
    if (this.rt()) {
      return "";
    } else {
      return ", " + this.selection().departureTime() + ' - ' + this.selection().arrivalTime();
    }
  };

  ToursAviaResultSet.prototype.dateClass = function() {
    if (this.rt()) {
      return 'blue-two';
    } else {
      return 'blue-one';
    }
  };

  ToursAviaResultSet.prototype.dateHtml = function() {
    var result, source;
    source = this.selection();
    if (source === null) {
      source = this.results().data[0];
    }
    result = '<div class="day">';
    result += dateUtils.formatHtmlDayShortMonth(source.departureDate());
    result += '</div>';
    if (this.rt()) {
      result += '<div class="day">';
      result += dateUtils.formatHtmlDayShortMonth(source.rtDepartureDate());
      result += '</div>';
    }
    return result;
  };

  ToursAviaResultSet.prototype.rt = function() {
    return this.results().roundTrip;
  };

  return ToursAviaResultSet;

})(TourEntry);

ToursHotelsResultSet = (function(_super) {

  __extends(ToursHotelsResultSet, _super);

  function ToursHotelsResultSet(raw, searchParams) {
    var _this = this;
    this.searchParams = searchParams;
    this.dateHtml = __bind(this.dateHtml, this);

    this.dateClass = __bind(this.dateClass, this);

    this.additionalText = __bind(this.additionalText, this);

    this.price = __bind(this.price, this);

    this.destinationText = __bind(this.destinationText, this);

    ToursHotelsResultSet.__super__.constructor.apply(this, arguments);
    this.active_hotel = 0;
    this.active_result = 0;
    this.template = 'hotels-results';
    this.panel = new HotelsPanel();
    this.results = new HotelsResultSet(raw, this.searchParams);
    this.results.tours = true;
    this.results.select = function(hotel) {
      hotel.tours = true;
      hotel.off('back');
      hotel.on('back', function() {
        return _this.trigger('setActive', _this);
      });
      hotel.off('select');
      hotel.on('select', function(room) {
        _this.active_hotel = hotel.hotelId;
        _this.active_result = room.resultId;
        return _this.selection(room);
      });
      hotel.active_result = _this.active_result;
      return _this.trigger('setActive', {
        panel: _this.panel,
        'data': hotel,
        template: 'hotels-info-template'
      });
    };
    this.data = {
      results: this.results
    };
    this.hotels = true;
    this.selection = ko.observable(null);
  }

  ToursHotelsResultSet.prototype.destinationText = function() {
    return "Отель в " + this.searchParams.city;
  };

  ToursHotelsResultSet.prototype.price = function() {
    if (this.selection() === null) {
      return 0;
    }
    return this.selection().room.price;
  };

  ToursHotelsResultSet.prototype.additionalText = function() {
    if (this.selection() === null) {
      return "";
    }
    return ", " + this.selection().hotel.hotelName;
  };

  ToursHotelsResultSet.prototype.dateClass = function() {
    return 'orange-two';
  };

  ToursHotelsResultSet.prototype.dateHtml = function() {
    var result;
    result = '<div class="day">';
    result += dateUtils.formatHtmlDayShortMonth(this.results.checkIn);
    result += '</div>';
    result += '<div class="day">';
    result += dateUtils.formatHtmlDayShortMonth(this.results.checkOut);
    return result += '</div>';
  };

  return ToursHotelsResultSet;

})(TourEntry);

ToursResultSet = (function() {

  function ToursResultSet(raw) {
    this.setActive = __bind(this.setActive, this);

    var result, variant, _i, _len, _ref,
      _this = this;
    this.data = [];
    _ref = raw.allVariants;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      variant = _ref[_i];
      if (variant.flights) {
        this.data.push(new ToursAviaResultSet(variant.flights.flightVoyages, variant.searchParams));
      } else {
        result = new ToursHotelsResultSet(variant.hotels, variant.searchParams);
        this.data.push(result);
        result.on('setActive', function(entry) {
          return _this.setActive(entry);
        });
      }
    }
    this.selection = ko.observable(this.data[0]);
    this.panel = ko.computed(function() {
      return _this.selection().panel;
    });
    this.price = ko.computed(function() {
      var item, sum, _j, _len1, _ref1;
      sum = 0;
      _ref1 = _this.data;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        item = _ref1[_j];
        sum += item.price();
      }
      return sum;
    });
    this.savings = ko.computed(function() {
      var item, sum, _j, _len1, _ref1;
      sum = 0;
      _ref1 = _this.data;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        item = _ref1[_j];
        sum += item.savings();
      }
      return sum;
    });
  }

  ToursResultSet.prototype.setActive = function(entry) {
    this.selection(entry);
    ko.processAllDeferredBindingUpdates();
    return ResizeAvia();
  };

  return ToursResultSet;

})();
