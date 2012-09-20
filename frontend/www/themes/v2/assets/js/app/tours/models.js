var TourEntry, ToursAviaResultSet, ToursHotelsResultSet, ToursResultSet,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

TourEntry = (function() {

  function TourEntry() {
    this.isHotel = __bind(this.isHotel, this);

    this.isAvia = __bind(this.isAvia, this);

  }

  TourEntry.prototype.isAvia = function() {
    return this.avia;
  };

  TourEntry.prototype.isHotel = function() {
    return this.hotels;
  };

  return TourEntry;

})();

ToursAviaResultSet = (function(_super) {

  __extends(ToursAviaResultSet, _super);

  function ToursAviaResultSet(raw) {
    this.destinationText = __bind(this.destinationText, this);
    this.template = 'avia-results';
    this.panel = new AviaPanel();
    this.results = new AviaResultSet(raw);
    this.results.departureCity = 'TEST';
    this.results.arrivalCity = 'TEST';
    this.results.date = new Date();
    this.results.postInit();
    this.data = {
      results: this.results
    };
    this.avia = true;
  }

  ToursAviaResultSet.prototype.destinationText = function() {
    return this.results.departureCity + ' &rarr; ' + this.results.arrivalCity;
  };

  return ToursAviaResultSet;

})(TourEntry);

ToursHotelsResultSet = (function(_super) {

  __extends(ToursHotelsResultSet, _super);

  function ToursHotelsResultSet(raw, searchParams) {
    this.searchParams = searchParams;
    this.destinationText = __bind(this.destinationText, this);

    this.template = 'hotels-results';
    this.panel = new HotelsPanel();
    this.data = new HotelsResultSet(raw);
    this.hotels = true;
  }

  ToursHotelsResultSet.prototype.destinationText = function() {
    return "Отель в " + this.searchParams.city;
  };

  return ToursHotelsResultSet;

})(TourEntry);

ToursResultSet = (function() {

  function ToursResultSet(raw) {
    var variant, _i, _len, _ref,
      _this = this;
    this.data = [];
    _ref = raw.allVariants;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      variant = _ref[_i];
      if (variant.flightVoyages) {
        this.data.push(new ToursAviaResultSet(variant.flightVoyages));
      } else {
        this.data.push(new ToursHotelsResultSet(variant.hotels, variant.searchParams));
      }
    }
    this.selected = ko.observable(this.data[0]);
    this.panel = ko.computed(function() {
      return _this.selected().panel;
    });
  }

  return ToursResultSet;

})();
