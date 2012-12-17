// Generated by CoffeeScript 1.4.0
var AviaResult, AviaResultSet, AviaSearchParams, FlightPart, Voyage,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

FlightPart = (function() {

  function FlightPart(part) {
    this.part = part;
    this.departureDate = new Date(part.datetimeBegin + '+04:00');
    this.arrivalDate = new Date(part.datetimeEnd + '+04:00');
    this.departureCity = part.departureCity;
    this.departureCityPre = part.departureCityPre;
    this.departureAirport = part.departureAirport;
    this.aircraftName = part.aircraftName;
    this.arrivalCity = part.arrivalCity;
    this.arrivalCityPre = part.arrivalCityPre;
    this.arrivalAirport = part.arrivalAirport;
    this._duration = part.duration;
    this.transportAirline = part.transportAirline;
    this.transportAirlineName = part.transportAirlineNameEn;
    this.flightCode = part.transportAirline + ' ' + part.flightCode;
    this.stopoverLength = 0;
  }

  FlightPart.prototype.departureTime = function() {
    return dateUtils.formatTime(this.departureDate);
  };

  FlightPart.prototype.arrivalTime = function() {
    return dateUtils.formatTime(this.arrivalDate);
  };

  FlightPart.prototype.duration = function() {
    return dateUtils.formatDuration(this._duration);
  };

  FlightPart.prototype.departureCityStopoverText = function() {
    return "Пересадка в " + this.departureCityPre + ", " + this.stopoverText();
  };

  FlightPart.prototype.calculateStopoverLength = function(anotherPart) {
    return this.stopoverLength = Math.floor((anotherPart.departureDate.getTime() - this.arrivalDate.getTime()) / 1000);
  };

  FlightPart.prototype.stopoverText = function() {
    return dateUtils.formatDuration(this.stopoverLength);
  };

  return FlightPart;

})();

Voyage = (function() {

  function Voyage(flight, airline) {
    var index, part, _i, _j, _len, _len1, _ref, _ref1;
    this.airline = airline;
    this.parts = [];
    _ref = flight.flightParts;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      part = _ref[_i];
      this.parts.push(new FlightPart(part));
    }
    this.flightKey = flight.flightKey;
    this.hasStopover = this.stopoverCount > 1 ? true : false;
    this.stopoverLength = 0;
    this.maxStopoverLength = 0;
    this.direct = this.parts.length === 1;
    if (!this.direct) {
      _ref1 = this.parts;
      for (index = _j = 0, _len1 = _ref1.length; _j < _len1; index = ++_j) {
        part = _ref1[index];
        if (index < (this.parts.length - 1)) {
          part.calculateStopoverLength(this.parts[index + 1]);
        }
        this.stopoverLength += part.stopoverLength;
        if (part.stopoverLength > this.maxStopoverLength) {
          this.maxStopoverLength = part.stopoverLength;
        }
      }
    }
    this.departureDate = new Date(flight.departureDate + '+04:00');
    this.arrivalDate = new Date(this.parts[this.parts.length - 1].arrivalDate);
    this._duration = flight.fullDuration;
    this.departureAirport = this.parts[0].departureAirport;
    this.arrivalAirport = this.parts[this.parts.length - 1].arrivalAirport;
    this.departureCity = flight.departureCity;
    this.arrivalCity = flight.arrivalCity;
    this.departureCityPre = flight.departureCityPre;
    this.arrivalCityPre = flight.arrivalCityPre;
    this._backVoyages = [];
    this.activeBackVoyage = ko.observable();
    this.visible = ko.observable(true);
  }

  Voyage.prototype.departureInt = function() {
    return this.departureDate.getTime();
  };

  Voyage.prototype.hash = function() {
    return this.departureTime() + this.arrivalTime();
  };

  Voyage.prototype.similarityHash = function() {
    return this.hash() + this.airline;
  };

  Voyage.prototype.push = function(voyage) {
    return this._backVoyages.push(voyage);
  };

  Voyage.prototype.stacked = function() {
    var count, result, voyage, _i, _len, _ref;
    result = false;
    count = 0;
    _ref = this._backVoyages;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      voyage = _ref[_i];
      if (voyage.visible()) {
        count++;
      }
      if (count > 1) {
        result = true;
        break;
      }
    }
    return result;
  };

  Voyage.prototype.departureDayMo = function() {
    return dateUtils.formatDayMonth(this.departureDate);
  };

  Voyage.prototype.departurePopup = function() {
    return dateUtils.formatDayMonthWeekday(this.departureDate);
  };

  Voyage.prototype.departureTime = function() {
    return dateUtils.formatTime(this.departureDate);
  };

  Voyage.prototype.departureTimeNumeric = function() {
    return dateUtils.formatTimeInMinutes(this.departureDate);
  };

  Voyage.prototype.arrivalDayMo = function() {
    return dateUtils.formatDayMonth(this.arrivalDate);
  };

  Voyage.prototype.arrivalTime = function() {
    return dateUtils.formatTime(this.arrivalDate);
  };

  Voyage.prototype.arrivalTimeNumeric = function() {
    return dateUtils.formatTimeInMinutes(this.arrivalDate);
  };

  Voyage.prototype.duration = function() {
    return dateUtils.formatDuration(this._duration);
  };

  Voyage.prototype.stopoverText = function() {
    var part, result, _i, _len, _ref;
    if (this.direct) {
      return "Без пересадок";
    }
    result = [];
    if (this.parts.length === 2) {
      part = this.parts[0];
      return "Пересадка в " + part.arrivalCityPre + ", " + this.parts[0].stopoverText();
    }
    _ref = this.parts.slice(0, -1);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      part = _ref[_i];
      result.push(part.arrivalCityPre);
    }
    return "Пересадка в " + result.join(', ');
  };

  Voyage.prototype.stopoverRelText = function() {
    var part, result, _i, _len, _ref;
    if (this.direct) {
      return "Без пересадок";
    }
    result = [];
    _ref = this.parts.slice(0, -1);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      part = _ref[_i];
      result.push('Пересадка в ' + part.arrivalCityPre + ', ' + part.stopoverText());
    }
    return result.join('<br />');
  };

  Voyage.prototype.stopsRatio = function() {
    var data, duration, htmlResult, index, part, result, _i, _j, _k, _len, _len1, _len2, _ref;
    result = [];
    if (this.direct) {
      return '<span class="down"></span>';
    }
    duration = _.reduce(this.parts, function(memo, part) {
      return memo + part._duration;
    }, 0);
    _ref = this.parts.slice(0, -1);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      part = _ref[_i];
      result.push({
        left: Math.ceil(part._duration / duration * 80),
        part: part
      });
    }
    for (index = _j = 0, _len1 = result.length; _j < _len1; index = ++_j) {
      data = result[index];
      if (data.left < 18) {
        data.left = 18;
      }
      if (index > 0) {
        result[index].left = result[index - 1].left + data.left;
      } else {
        result[index].left = data.left;
      }
    }
    htmlResult = "";
    for (_k = 0, _len2 = result.length; _k < _len2; _k++) {
      data = result[_k];
      htmlResult += this.getCupHtmlForPart(data.part, "left: " + data.left + '%');
    }
    htmlResult += '<span class="down"></span>';
    return htmlResult;
  };

  Voyage.prototype.stopoverHtml = function() {
    var htmlResult, part, _i, _len, _ref;
    if (this.direct) {
      return '<span class="path"></span>';
    }
    htmlResult = '';
    _ref = this.parts.slice(0, -1);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      part = _ref[_i];
      console.log(part);
      if (part.stopoverLength > 0) {
        htmlResult += this.getCupHtmlForPart(part);
      }
    }
    return htmlResult;
  };

  Voyage.prototype.getCupHtmlForPart = function(part, style) {
    var cupClass;
    if (style == null) {
      style = "";
    }
    cupClass = part.stopoverLength < 2.5 * 60 * 60 ? "cup" : "cup long";
    return '<span class="' + cupClass + ' tooltip" rel="Пересадка в ' + part.arrivalCityPre + ', ' + part.stopoverText() + '" style="' + style + '"></span>';
  };

  Voyage.prototype.recommendStopoverIco = function() {
    if (this.direct) {
      return;
    }
    return '<span class="cup"></span>';
  };

  Voyage.prototype.sort = function() {
    this._backVoyages.sort(function(a, b) {
      return a.departureInt() - b.departureInt();
    });
    return this.activeBackVoyage(this._backVoyages[0]);
  };

  Voyage.prototype.removeSimilar = function() {
    var item, key, voyage, _helper, _i, _len, _ref;
    if (this._backVoyages.length < 2) {
      return;
    }
    _helper = {};
    _ref = this._backVoyages;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      voyage = _ref[_i];
      key = voyage.airline + voyage.departureInt();
      item = _helper[key];
      if (item) {
        _helper[key] = item.stopoverLength < voyage.stopoverLength ? item : voyage;
      } else {
        _helper[key] = voyage;
      }
    }
    this._backVoyages = [];
    for (key in _helper) {
      item = _helper[key];
      this._backVoyages.push(item);
    }
    return this.activeBackVoyage(this._backVoyages[0]);
  };

  Voyage.prototype.chooseActive = function() {
    var active;
    if (this._backVoyages.length === 0) {
      return;
    }
    if (this.activeBackVoyage().visible()) {
      return;
    }
    active = _.find(this._backVoyages, function(voyage) {
      return voyage.visible();
    });
    if (!active) {
      this.visible(false);
      return;
    }
    return this.activeBackVoyage(active);
  };

  return Voyage;

})();

AviaResult = (function() {

  function AviaResult(data, parent) {
    var fields, flights, name, rtName, _i, _len,
      _this = this;
    this.parent = parent;
    this.getParams = __bind(this.getParams, this);

    this.directRating = __bind(this.directRating, this);

    this.chooseActive = __bind(this.chooseActive, this);

    this.showDetails = __bind(this.showDetails, this);

    this.minimizeRtStacked = __bind(this.minimizeRtStacked, this);

    this.minimizeStacked = __bind(this.minimizeStacked, this);

    this.chooseNextRtStacked = __bind(this.chooseNextRtStacked, this);

    this.choosePrevRtStacked = __bind(this.choosePrevRtStacked, this);

    this.chooseRtStacked = __bind(this.chooseRtStacked, this);

    this.chooseNextStacked = __bind(this.chooseNextStacked, this);

    this.choosePrevStacked = __bind(this.choosePrevStacked, this);

    this.chooseStacked = __bind(this.chooseStacked, this);

    this.rtFlightCodes = __bind(this.rtFlightCodes, this);

    this.flightCodes = __bind(this.flightCodes, this);

    this.flightKey = __bind(this.flightKey, this);

    this.rtFlightCodesText = __bind(this.rtFlightCodesText, this);

    this.isFlight = true;
    this.isHotel = false;
    _.extend(this, Backbone.Events);
    this._data = data;
    this._stacked_data = [];
    flights = data.flights;
    this.searchId = data.searchId;
    this.cacheId = data.cacheId;
    this.key = data.key;
    this.price = Math.ceil(data.price);
    this._stacked = false;
    this.roundTrip = flights.length === 2;
    this.visible = ko.observable(true);
    this.airline = data.valCompany;
    this.searchService = data.service;
    this.airlineName = data.valCompanyNameEn;
    this.serviceClass = data.serviceClass;
    this.refundable = data.refundable;
    this.refundableText = this.refundable ? "Билет возвратный" : "Билет не возвратный";
    this.freeWeight = data.freeWeight;
    if (this.freeWeight === '0') {
      this.freeWeight = '$';
    }
    this.freeWeightText = data.freeWeightDescription;
    flights[0].flightKey = data.flightKey;
    this.activeVoyage = new Voyage(flights[0], this.airline);
    if (this.roundTrip) {
      flights[1].flightKey = data.flightKey;
      this.activeVoyage.push(new Voyage(flights[1], this.airline));
    }
    this.voyages = [];
    this.voyages.push(this.activeVoyage);
    this.activeVoyage = ko.observable(this.activeVoyage);
    this.stackedMinimized = ko.observable(true);
    this.rtStackedMinimized = ko.observable(true);
    this.flightCodesText = _.size(this.activeVoyage().parts) > 1 ? "Рейсы" : "Рейс";
    this.totalPeople = 0;
    fields = ['departureCity', 'departureAirport', 'departureDayMo', 'departureDate', 'departurePopup', 'departureTime', 'arrivalCity', 'arrivalAirport', 'arrivalDayMo', 'arrivalDate', 'arrivalTime', 'duration', '_duration', 'direct', 'stopoverText', 'stopoverRelText', 'departureTimeNumeric', 'arrivalTimeNumeric', 'hash', 'similarityHash', 'stopsRatio', 'recommendStopoverIco'];
    for (_i = 0, _len = fields.length; _i < _len; _i++) {
      name = fields[_i];
      this[name] = (function(name) {
        return function() {
          var field;
          field = this.activeVoyage()[name];
          if ((typeof field) === 'function') {
            return field.apply(this.activeVoyage());
          }
          return field;
        };
      })(name);
      rtName = 'rt' + name.charAt(0).toUpperCase() + name.slice(1);
      this[rtName] = (function(name) {
        return function() {
          var field;
          field = this.activeVoyage().activeBackVoyage()[name];
          if ((typeof field) === 'function') {
            return field.apply(this.activeVoyage().activeBackVoyage());
          }
          return field;
        };
      })(name);
    }
  }

  AviaResult.prototype.rtFlightCodesText = function() {
    if (_.size(this.activeVoyage().activeBackVoyage().parts) > 1) {
      return "Рейсы";
    } else {
      return "Рейс";
    }
  };

  AviaResult.prototype.flightKey = function() {
    if (this.roundTrip) {
      return this.activeVoyage().activeBackVoyage().flightKey;
    }
    return this.activeVoyage().flightKey;
  };

  AviaResult.prototype.flightCodes = function() {
    var codes;
    codes = _.map(this.activeVoyage().parts, function(flight) {
      return '<span class="tooltip" rel="' + flight.departureCity + ' - ' + flight.arrivalCity + '"><nobr>' + flight.flightCode + "</nobr></span>";
    });
    return Utils.implode(', ', codes);
  };

  AviaResult.prototype.rtFlightCodes = function() {
    var codes;
    codes = _.map(this.activeVoyage().activeBackVoyage().parts, function(flight) {
      return '<span class="tooltip" rel="' + flight.departureCity + ' - ' + flight.arrivalCity + '"><nobr>' + flight.flightCode + "</nobr></span>";
    });
    return Utils.implode(', ', codes);
  };

  AviaResult.prototype.isActive = function() {
    console.log(this.parent.selected_key(), this.key, this.parent.selected_best());
    if (this.parent.selected_best()) {
      return this.parent.selected_key() === this.key;
    }
    return this.parent.selected_key() === this.key;
  };

  AviaResult.prototype.stacked = function() {
    var count, voyage, _i, _len, _ref;
    count = 0;
    _ref = this.voyages;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      voyage = _ref[_i];
      if (voyage.visible()) {
        count++;
      }
      if (count > 1) {
        return true;
      }
    }
    return false;
  };

  AviaResult.prototype.rtStacked = function() {
    var count, voyage, _i, _len, _ref;
    count = 0;
    _ref = this.activeVoyage()._backVoyages;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      voyage = _ref[_i];
      if (voyage.visible()) {
        count++;
      }
      if (count > 1) {
        return true;
      }
    }
    return false;
  };

  AviaResult.prototype.push = function(data) {
    var backVoyage, newVoyage, result;
    this._stacked = true;
    data.flights[0].flightKey = data.flightKey;
    newVoyage = new Voyage(data.flights[0], this.airline);
    this._stacked_data.push(data);
    if (this.roundTrip) {
      data.flights[1].flightKey = data.flightKey;
      backVoyage = new Voyage(data.flights[1], this.airline);
      newVoyage.push(backVoyage);
      result = _.find(this.voyages, function(voyage) {
        return voyage.hash() === newVoyage.hash();
      });
      if (result) {
        result.push(backVoyage);
        return;
      }
    }
    return this.voyages.push(newVoyage);
  };

  AviaResult.prototype.chooseStacked = function(voyage) {
    var backVoyage, hash;
    window.voyanga_debug("Choosing stacked voyage", voyage);
    if (this.roundTrip) {
      hash = this.activeVoyage().activeBackVoyage().hash();
    }
    this.activeVoyage(voyage);
    backVoyage = _.find(voyage._backVoyages, function(el) {
      return el.hash() === hash;
    });
    if (backVoyage) {
      return this.activeVoyage().activeBackVoyage(backVoyage);
    }
  };

  AviaResult.prototype.choosePrevStacked = function() {
    var active_index, index, voyage, _i, _len, _ref;
    active_index = 0;
    _ref = this.voyages;
    for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
      voyage = _ref[index];
      if (voyage.hash() === this.hash()) {
        active_index = index;
      }
    }
    if (active_index === 0) {
      return;
    }
    return this.activeVoyage(this.voyages[active_index - 1]);
  };

  AviaResult.prototype.chooseNextStacked = function() {
    var active_index, index, voyage, _i, _len, _ref;
    active_index = 0;
    _ref = this.voyages;
    for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
      voyage = _ref[index];
      if (voyage.hash() === this.hash()) {
        active_index = index;
      }
    }
    if (active_index === this.voyages.length - 1) {
      return;
    }
    return this.activeVoyage(this.voyages[active_index + 1]);
  };

  AviaResult.prototype.chooseRtStacked = function(voyage) {
    window.voyanga_debug("Choosing RT stacked voyage", voyage);
    return this.activeVoyage().activeBackVoyage(voyage);
  };

  AviaResult.prototype.choosePrevRtStacked = function() {
    var active_index, index, rtVoyages, voyage, _i, _len;
    active_index = 0;
    rtVoyages = this.rtVoyages();
    for (index = _i = 0, _len = rtVoyages.length; _i < _len; index = ++_i) {
      voyage = rtVoyages[index];
      if (voyage.hash() === this.rtHash()) {
        active_index = index;
      }
    }
    if (active_index === 0) {
      return;
    }
    return this.activeVoyage().activeBackVoyage(rtVoyages[active_index - 1]);
  };

  AviaResult.prototype.chooseNextRtStacked = function() {
    var active_index, index, rtVoyages, voyage, _i, _len;
    active_index = 0;
    rtVoyages = this.rtVoyages();
    for (index = _i = 0, _len = rtVoyages.length; _i < _len; index = ++_i) {
      voyage = rtVoyages[index];
      if (voyage.hash() === this.rtHash()) {
        active_index = index;
      }
    }
    if (active_index === rtVoyages.length - 1) {
      return;
    }
    return this.activeVoyage().activeBackVoyage(rtVoyages[active_index + 1]);
  };

  AviaResult.prototype.minimizeStacked = function() {
    return this.stackedMinimized(!this.stackedMinimized());
  };

  AviaResult.prototype.minimizeRtStacked = function() {
    return this.rtStackedMinimized(!this.rtStackedMinimized());
  };

  AviaResult.prototype.rtVoyages = function() {
    return this.activeVoyage()._backVoyages;
  };

  AviaResult.prototype.sort = function() {
    this.voyages.sort(function(a, b) {
      return a.departureInt() - b.departureInt();
    });
    if (this.roundTrip) {
      _.each(this.voyages, function(x) {
        x.sort();
        return x.removeSimilar();
      });
    }
    return this.activeVoyage(this.voyages[0]);
  };

  AviaResult.prototype.removeSimilar = function() {
    var item, key, voyage, _helper, _i, _len, _ref, _results;
    if (this.voyages.length < 2) {
      return;
    }
    _helper = {};
    _ref = this.voyages;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      voyage = _ref[_i];
      key = voyage.airline + voyage.departureInt();
      item = _helper[key];
      if (item) {
        _helper[key] = item.stopoverLength < voyage.stopoverLength ? item : voyage;
      } else {
        _helper[key] = voyage;
      }
    }
    this.activeVoyage(_helper[key]);
    this.voyages = [];
    _results = [];
    for (key in _helper) {
      item = _helper[key];
      if (item.stopoverLength < this.activeVoyage().stopoverLength) {
        this.activeVoyage(item);
      }
      _results.push(this.voyages.push(item));
    }
    return _results;
  };

  AviaResult.prototype.showDetails = function(data, event) {
    new GenericPopup('#avia-body-popup', this);
    ko.processAllDeferredBindingUpdates();
    SizeBox('avia-body-popup');
    return ResizeBox('avia-body-popup');
  };

  AviaResult.prototype.chooseActive = function() {
    var active;
    if (this.visible() === false) {
      return;
    }
    if (this.activeVoyage().visible()) {
      return;
    }
    active = _.find(this.voyages, function(voyage) {
      return voyage.visible();
    });
    if (!active) {
      this.visible(false);
      return;
    }
    return this.activeVoyage(active);
  };

  AviaResult.prototype.directRating = function() {
    var base, d;
    base = 1;
    if (this.direct()) {
      base += 1;
    }
    if (this.roundTrip) {
      if (this.rtDirect()) {
        base += 1;
      }
    }
    d = this._duration();
    if (this.roundTrip) {
      d += this.rt_duration();
    }
    return d / base;
  };

  AviaResult.prototype.getParams = function() {
    var result;
    result = {};
    if (this.activeVoyage()) {
      result.airlineCode = this.airline;
      result.rt = this.roundTrip ? 'true' : 'false';
      result.departureDateTime = this.departureDate();
      result.arrivalDateTime = this.arrivalDate();
      if (this.roundTrip) {
        result.rtDepartureDateTime = this.rtDepartureDate();
        result.rtArrivalDateTime = this.rtArrivalDate();
      }
    }
    return JSON.stringify(result);
  };

  return AviaResult;

})();

AviaResultSet = (function() {

  function AviaResultSet(rawVoyages, siblings) {
    var filteredVoyages, flight, flightVoyage, item, key, part, result, _i, _interlines, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2,
      _this = this;
    this.siblings = siblings != null ? siblings : false;
    this.setBest = __bind(this.setBest, this);

    this.updateBest = __bind(this.updateBest, this);

    this.updateCheapest = __bind(this.updateCheapest, this);

    this.postFilters = __bind(this.postFilters, this);

    this.processSiblings = __bind(this.processSiblings, this);

    this.postInit = __bind(this.postInit, this);

    this.findAndSelect = __bind(this.findAndSelect, this);

    this.select = __bind(this.select, this);

    this.injectSearchParams = __bind(this.injectSearchParams, this);

    this.recommendTemplate = 'avia-cheapest-result';
    this.tours = false;
    this.selected_key = ko.observable('');
    this.selected_best = ko.observable(false);
    this.showBest = ko.observable(false);
    this.creationMoment = moment();
    this._results = {};
    if (!rawVoyages.length) {
      throw "404";
    }
    _interlines = {};
    for (_i = 0, _len = rawVoyages.length; _i < _len; _i++) {
      flightVoyage = rawVoyages[_i];
      key = '';
      _ref = flightVoyage.flights;
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        flight = _ref[_j];
        _ref1 = flight.flightParts;
        for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
          part = _ref1[_k];
          key += part.datetimeBegin;
          key += part.datetimeEnd;
        }
      }
      if (_interlines[key]) {
        if (_interlines[key].price > flightVoyage.price) {
          _interlines[key] = flightVoyage;
        }
      } else {
        _interlines[key] = flightVoyage;
      }
    }
    filteredVoyages = [];
    for (key in _interlines) {
      item = _interlines[key];
      filteredVoyages.push(item);
    }
    for (_l = 0, _len3 = filteredVoyages.length; _l < _len3; _l++) {
      flightVoyage = filteredVoyages[_l];
      key = flightVoyage.price + "_" + flightVoyage.valCompany;
      if (this._results[key]) {
        this._results[key].push(flightVoyage);
      } else {
        result = new AviaResult(flightVoyage, this);
        this._results[key] = result;
        result.key = key;
      }
    }
    this.cheapest = ko.observable();
    this.best = ko.observable();
    this.data = [];
    this.numResults = ko.observable(0);
    this.filtersConfig = false;
    _ref2 = this._results;
    for (key in _ref2) {
      result = _ref2[key];
      result.sort();
      result.removeSimilar();
      this.data.push(result);
    }
    this.data.sort(function(left, right) {
      return left.price - right.price;
    });
    this.postFilters();
  }

  AviaResultSet.prototype.injectSearchParams = function(sp) {
    this.rawSP = sp;
    this.arrivalCity = sp.destinations[0].arrival;
    this.departureCity = sp.destinations[0].departure;
    this.rawDate = moment(new Date(sp.destinations[0].date + '+04:00'));
    this.date = dateUtils.formatDayShortMonth(new Date(sp.destinations[0].date + '+04:00'));
    this.dateHeadingText = this.date;
    this.roundTrip = sp.isRoundTrip;
    if (this.roundTrip) {
      this.rtDate = dateUtils.formatDayShortMonth(new Date(sp.destinations[1].date + '+04:00'));
      this.rawRtDate = moment(new Date(sp.destinations[1].date + '+04:00'));
      return this.dateHeadingText += ', ' + this.rtDate;
    }
  };

  AviaResultSet.prototype.select = function(ctx) {
    var selection, ticketValidCheck;
    console.log(ctx);
    if (ctx.ribbon) {
      selection = ctx.data;
    } else {
      selection = ctx;
    }
    ticketValidCheck = $.Deferred();
    ticketValidCheck.done(function(selection) {
      var result;
      result = {};
      result.module = 'Avia';
      result.type = 'avia';
      result.searchId = selection.cacheId;
      result.searchKey = selection.flightKey();
      return Utils.toBuySubmit([result]);
    });
    return this.checkTicket(selection, ticketValidCheck);
  };

  AviaResultSet.prototype.findAndSelect = function(result) {
    var backHash, backVoyage, hash, voyage, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
    hash = result.similarityHash();
    _ref = this.data;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      result = _ref[_i];
      _ref1 = result.voyages;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        voyage = _ref1[_j];
        if (voyage.similarityHash() === hash) {
          result.activeVoyage(voyage);
          if (!this.roundTrip) {
            return result;
          }
          backHash = voyage.activeBackVoyage().similarityHash();
          _ref2 = voyage._backVoyages;
          for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
            backVoyage = _ref2[_k];
            if (backVoyage.similarityHash() === backHash) {
              voyage.activeBackVoyage(backVoyage);
              return result;
            }
          }
        }
      }
    }
    return false;
  };

  AviaResultSet.prototype.postInit = function() {
    var bCheapest, data, eCheapest,
      _this = this;
    this.filters = new AviaFiltersT(this);
    this.filters.serviceClass.selection.subscribe(function(newValue) {
      if (newValue === 'B') {
        _this.showBest(true);
        return;
      }
      return _this.showBest(false);
    });
    if (this.siblings) {
      eCheapest = _.reduce(this.data, function(el1, el2) {
        if (el1.price < el2.price) {
          return el1;
        } else {
          return el2;
        }
      }, this.data[0]);
      data = _.filter(this.data, function(item) {
        return item.serviceClass === 'B';
      });
      bCheapest = _.reduce(data, function(el1, el2) {
        if (el1.price < el2.price) {
          return el1;
        } else {
          return el2;
        }
      }, data[0]);
      if (!eCheapest) {
        eCheapest = {
          price: 0
        };
      }
      if (!bCheapest) {
        bCheapest = {
          price: 0
        };
      }
      this.ESiblings = this.processSiblings(this.siblings.E, eCheapest);
      return this.siblings = ko.observable(this.ESiblings);
    }
  };

  AviaResultSet.prototype.processSiblings = function(rawSiblings, cheapest) {
    var helper, index, min, siblings, sibs, todayPrices, _i, _j, _len, _len1,
      _this = this;
    helper = function(root, sibs, today) {
      var index, price, _i, _len, _results;
      if (today == null) {
        today = false;
      }
      _results = [];
      for (index = _i = 0, _len = sibs.length; _i < _len; index = ++_i) {
        price = sibs[index];
        _results.push(root[index] = {
          price: price,
          siblings: []
        });
      }
      return _results;
    };
    if (this.roundTrip) {
      rawSiblings[3][3] = Math.ceil(cheapest.price / 2);
    } else {
      rawSiblings[3] = cheapest.price;
    }
    if (rawSiblings[3].length) {
      siblings = [];
      todayPrices = [];
      for (index = _i = 0, _len = rawSiblings.length; _i < _len; index = ++_i) {
        sibs = rawSiblings[index];
        sibs = _.filter(sibs, function(item) {
          return item !== false;
        });
        if (sibs.length) {
          min = _.min(sibs);
        } else {
          min = false;
        }
        todayPrices[index] = min;
      }
      helper(siblings, todayPrices, true);
      for (index = _j = 0, _len1 = rawSiblings.length; _j < _len1; index = ++_j) {
        sibs = rawSiblings[index];
        helper(siblings[index].siblings, sibs);
      }
    } else {
      siblings = [];
      helper(siblings, rawSiblings, true);
    }
    return new Siblings(siblings, this.roundTrip, this.rawDate, this.rawRtDate);
  };

  AviaResultSet.prototype.hideRecommend = function(context, event) {
    return hideRecomendedBlockTicket.apply(event.currentTarget);
  };

  AviaResultSet.prototype.postFilters = function() {
    var data;
    data = _.filter(this.data, function(el) {
      return el.visible();
    });
    this.numResults(data.length);
    this.updateCheapest(data);
    this.updateBest(data);
    ko.processAllDeferredBindingUpdates();
    jsPaneScrollHeight();
    return ResizeAvia();
  };

  AviaResultSet.prototype.updateCheapest = function(data) {
    var new_cheapest;
    if (data.length === 0) {
      return;
    }
    new_cheapest = _.reduce(data, function(el1, el2) {
      if (el1.price < el2.price) {
        return el1;
      } else {
        return el2;
      }
    }, data[0]);
    if (this.cheapest() === void 0) {
      this.cheapest(new_cheapest);
      return;
    }
    if (this.cheapest().key !== new_cheapest.key) {
      return this.cheapest(new_cheapest);
    }
  };

  AviaResultSet.prototype.updateBest = function(data) {
    var backVoyage, backVoyages, result, voyage, voyages, _i, _j, _k, _len, _len1, _len2;
    if (data.length === 0) {
      return;
    }
    data = _.sortBy(data, function(el) {
      return el.price;
    });
    for (_i = 0, _len = data.length; _i < _len; _i++) {
      result = data[_i];
      voyages = _.sortBy(result.voyages, function(el) {
        return el._duration;
      });
      for (_j = 0, _len1 = voyages.length; _j < _len1; _j++) {
        voyage = voyages[_j];
        if (voyage.visible() && voyage.maxStopoverLength < 60 * 60 * 3) {
          if (result.roundTrip) {
            backVoyages = _.sortBy(voyage._backVoyages, function(el) {
              return el._duration;
            });
            for (_k = 0, _len2 = backVoyages.length; _k < _len2; _k++) {
              backVoyage = backVoyages[_k];
              if (backVoyage.visible() && backVoyage.maxStopoverLength < 60 * 60 * 3) {
                voyage.activeBackVoyage(backVoyage);
                result.activeVoyage(voyage);
                this.setBest(result);
                return;
              }
            }
          } else {
            result.activeVoyage(voyage);
            this.setBest(result);
            return;
          }
        }
      }
    }
    return this.setBest(data[0], true);
  };

  AviaResultSet.prototype.setBest = function(oldresult, unconditional) {
    var item, key, result, _i, _len, _ref;
    if (unconditional == null) {
      unconditional = false;
    }
    key = oldresult.key;
    result = new AviaResult(oldresult._data, this);
    _ref = oldresult._stacked_data;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      result.push(item);
    }
    result.sort();
    result.removeSimilar();
    result.best = true;
    result.key = key + '_optima';
    if (!unconditional) {
      result.voyages = _.filter(result.voyages, function(el) {
        return el.maxStopoverLength < 60 * 60 * 3;
      });
      _.each(result.voyages, function(voyage) {
        return voyage._backVoyages = _.filter(voyage._backVoyages, function(el) {
          return el.maxStopoverLength < 60 * 60 * 3;
        });
      });
    }
    result.chooseStacked(oldresult.activeVoyage());
    if (this.best() === void 0) {
      this.best(result);
      return;
    }
    if (this.best().key !== result.key) {
      delete this.best();
      return this.best(result);
    }
  };

  AviaResultSet.prototype.filtersRendered = function() {
    return ko.processAllDeferredBindingUpdates();
  };

  return AviaResultSet;

})();

AviaSearchParams = (function(_super) {

  __extends(AviaSearchParams, _super);

  function AviaSearchParams() {
    AviaSearchParams.__super__.constructor.apply(this, arguments);
    this.dep = ko.observable('');
    this.arr = ko.observable('');
    this.rt = ko.observable(true);
    this.rtDate = ko.observable('');
    this.passengers = new Passengers();
    this.adults = this.passengers.adults;
    this.children = this.passengers.children;
    this.infants = this.passengers.infants;
  }

  AviaSearchParams.prototype.url = function() {
    var params, result;
    result = 'flight/search/BE?';
    params = [];
    params.push('destinations[0][departure]=' + this.dep());
    params.push('destinations[0][arrival]=' + this.arr());
    params.push('destinations[0][date]=' + moment(this.date()).format('D.M.YYYY'));
    if (this.rt()) {
      params.push('destinations[1][departure]=' + this.arr());
      params.push('destinations[1][arrival]=' + this.dep());
      params.push('destinations[1][date]=' + moment(this.rtDate()).format('D.M.YYYY'));
    }
    params.push('adt=' + this.adults());
    params.push('chd=' + this.children());
    params.push('inf=' + this.infants());
    result += params.join("&");
    window.voyanga_debug("Generated search url", result);
    return result;
  };

  AviaSearchParams.prototype.key = function() {
    var key;
    key = this.dep() + this.arr() + this.date();
    if (this.rt()) {
      key += this.rtDate();
      key += '_rt';
    }
    key += this.adults();
    key += this.children();
    key += this.infants();
    return key;
  };

  AviaSearchParams.prototype.getHash = function() {
    var hash, parts;
    parts = [this.dep(), this.arr(), moment(this.date()).format('D.M.YYYY'), this.adults(), this.children(), this.infants()];
    if (this.rt()) {
      parts.push(moment(this.rtDate()).format('D.M.YYYY'));
    }
    hash = 'avia/search/' + parts.join('/') + '/';
    window.voyanga_debug("Generated hash for avia search", hash);
    return hash;
  };

  AviaSearchParams.prototype.fromList = function(data) {
    this.dep(data[0]);
    this.arr(data[1]);
    this.date(moment(data[2], 'D.M.YYYY').toDate());
    this.adults(data[3]);
    this.children(data[4]);
    this.infants(data[5]);
    if (data.length === 7) {
      this.rt(true);
      return this.rtDate(moment(data[6], 'D.M.YYYY').toDate());
    } else {
      return this.rt(false);
    }
  };

  AviaSearchParams.prototype.fromObject = function(data) {
    console.log(data);
    this.adults(data.adt);
    this.children(data.chd);
    this.infants(data.inf);
    this.rt(data.isRoundTrip);
    this.dep(data.destinations[0].departure_iata);
    this.arr(data.destinations[0].arrival_iata);
    this.date(new Date(data.destinations[0].date));
    if (this.rt()) {
      return this.rtDate(new Date(data.destinations[1].date));
    }
  };

  return AviaSearchParams;

})(SearchParams);
