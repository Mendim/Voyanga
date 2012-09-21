var TourEntry, ToursAviaResultSet, ToursHotelsResultSet, ToursResultSet,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

TourEntry = (function() {

  function TourEntry() {
    this.rt = __bind(this.rt, this);

    this.price = __bind(this.price, this);

    this.isHotel = __bind(this.isHotel, this);

    this.isAvia = __bind(this.isAvia, this);

  }

  TourEntry.prototype.isAvia = function() {
    return this.avia;
  };

  TourEntry.prototype.isHotel = function() {
    return this.hotels;
  };

  TourEntry.prototype.price = function() {
    return this.selection().price;
  };

  TourEntry.prototype.rt = function() {
    return false;
  };

  return TourEntry;

})();

ToursAviaResultSet = (function(_super) {

  __extends(ToursAviaResultSet, _super);

  function ToursAviaResultSet(raw, searchParams) {
    this.searchParams = searchParams;
    this.rt = __bind(this.rt, this);

    this.dateHtml = __bind(this.dateHtml, this);

    this.dateClass = __bind(this.dateClass, this);

    this.additionalText = __bind(this.additionalText, this);

    this.destinationText = __bind(this.destinationText, this);

    this.template = 'avia-results';
    this.panel = new AviaPanel();
    this.results = new AviaResultSet(raw);
    this.results.injectSearchParams(this.searchParams);
    this.results.postInit();
    this.data = {
      results: this.results
    };
    this.avia = true;
    this.selection = ko.observable(this.results.data[0]);
  }

  ToursAviaResultSet.prototype.destinationText = function() {
    return this.results.departureCity + ' &rarr; ' + this.results.arrivalCity;
  };

  ToursAviaResultSet.prototype.additionalText = function() {
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
    var result;
    result = '<div class="day">';
    result += dateUtils.formatHtmlDayShortMonth(this.selection().departureDate());
    result += '</div>';
    if (this.rt()) {
      result += '<div class="day">';
      result += dateUtils.formatHtmlDayShortMonth(this.selection().rtDepartureDate());
      result += '</div>';
    }
    return result;
  };

  ToursAviaResultSet.prototype.rt = function() {
    return this.results.roundTrip;
  };

  return ToursAviaResultSet;

})(TourEntry);

ToursHotelsResultSet = (function(_super) {

  __extends(ToursHotelsResultSet, _super);

  function ToursHotelsResultSet(raw, searchParams) {
    this.searchParams = searchParams;
    this.dateHtml = __bind(this.dateHtml, this);

    this.dateClass = __bind(this.dateClass, this);

    this.additionalText = __bind(this.additionalText, this);

    this.price = __bind(this.price, this);

    this.destinationText = __bind(this.destinationText, this);

    this.template = 'hotels-results';
    this.panel = new HotelsPanel();
    this.results = new HotelsResultSet(raw, this.searchParams);
    this.data = {
      results: this.results
    };
    this.hotels = true;
    this.selection = ko.observable(this.results.data[0]);
  }

  ToursHotelsResultSet.prototype.destinationText = function() {
    return "Отель в " + this.searchParams.city;
  };

  ToursHotelsResultSet.prototype.price = function() {
    return this.selection().roomSets[0].price;
  };

  ToursHotelsResultSet.prototype.additionalText = function() {
    return ", " + this.selection().hotelName;
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

    var variant, _i, _len, _ref,
      _this = this;
    this.data = [];
    _ref = raw.allVariants;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      variant = _ref[_i];
      if (variant.flights) {
        this.data.push(new ToursAviaResultSet(variant.flights.flightVoyages, variant.searchParams));
      } else {
        this.data.push(new ToursHotelsResultSet(variant.hotels, variant.searchParams));
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
  }

  ToursResultSet.prototype.setActive = function(entry) {
    this.selection(entry);
    ko.processAllDeferredBindingUpdates();
    return ResizeAvia();
  };

  return ToursResultSet;

})();
