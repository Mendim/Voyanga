var DestinationSearchParams, RoomsSearchParams, TourEntry, TourSearchParams, ToursAviaResultSet, ToursHotelsResultSet, ToursOverviewVM, ToursResultSet,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

TourEntry = (function() {

  function TourEntry() {
    this.rt = __bind(this.rt, this);

    this.savings = __bind(this.savings, this);

    this.maxPriceHtml = __bind(this.maxPriceHtml, this);

    this.minPriceHtml = __bind(this.minPriceHtml, this);

    this.priceHtml = __bind(this.priceHtml, this);

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

  TourEntry.prototype.priceHtml = function() {
    if (this.selection() === null) {
      return "Не выбрано";
    }
    return this.price() + '<span class="rur">o</span>';
  };

  TourEntry.prototype.minPriceHtml = function() {
    return this.minPrice() + '<span class="rur">o</span>';
  };

  TourEntry.prototype.maxPriceHtml = function() {
    return this.maxPrice() + '<span class="rur">o</span>';
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

    this.maxPrice = __bind(this.maxPrice, this);

    this.minPrice = __bind(this.minPrice, this);

    this.numAirlines = __bind(this.numAirlines, this);

    this.overviewText = __bind(this.overviewText, this);

    this.doNewSearch = __bind(this.doNewSearch, this);

    this.newResults = __bind(this.newResults, this);
    ToursAviaResultSet.__super__.constructor.apply(this, arguments);
    this.api = new AviaAPI;
    this.template = 'avia-results';
    this.overviewTemplate = 'tours-overview-avia-ticket';
    this.panel = new AviaPanel();
    this.panel.handlePanelSubmit = this.doNewSearch;
    this.panel.sp.fromObject(sp);
    this.panel.original_template = this.panel.template;
    this.panel.template = 'tours-panel-template';
    this.results = ko.observable();
    this.selection = ko.observable(null);
    this.newResults(raw, sp);
    this.data = {
      results: this.results
    };
  }

  ToursAviaResultSet.prototype.newResults = function(raw, sp) {
    var r, result,
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
    r = result.data[0];
    result.selected_key(r.key);
    this.selection(result.data[0]);
    return this.results(result);
  };

  ToursAviaResultSet.prototype.doNewSearch = function() {
    var _this = this;
    return this.api.search(this.panel.sp.url(), function(data) {
      return _this.newResults(data.flights.flightVoyages, data.searchParams);
    });
  };

  ToursAviaResultSet.prototype.overviewText = function() {
    return "Перелет " + this.results().departureCity + ' &rarr; ' + this.results().arrivalCity;
  };

  ToursAviaResultSet.prototype.numAirlines = function() {
    return this.results().filters.airline.options().length;
  };

  ToursAviaResultSet.prototype.minPrice = function() {
    var cheapest;
    cheapest = _.reduce(this.results().data, function(el1, el2) {
      if (el1.price < el2.price) {
        return el1;
      } else {
        return el2;
      }
    }, this.results().data[0]);
    return cheapest.price;
  };

  ToursAviaResultSet.prototype.maxPrice = function() {
    var mostExpensive;
    mostExpensive = _.reduce(this.results().data, function(el1, el2) {
      if (el1.price > el2.price) {
        return el1;
      } else {
        return el2;
      }
    }, this.results().data[0]);
    return mostExpensive.price;
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
    this.searchParams = searchParams;
    this.dateHtml = __bind(this.dateHtml, this);

    this.dateClass = __bind(this.dateClass, this);

    this.additionalText = __bind(this.additionalText, this);

    this.price = __bind(this.price, this);

    this.destinationText = __bind(this.destinationText, this);

    this.maxPrice = __bind(this.maxPrice, this);

    this.minPrice = __bind(this.minPrice, this);

    this.numHotels = __bind(this.numHotels, this);

    this.overviewText = __bind(this.overviewText, this);

    this.doNewSearch = __bind(this.doNewSearch, this);

    this.newResults = __bind(this.newResults, this);

    ToursHotelsResultSet.__super__.constructor.apply(this, arguments);
    this.api = new HotelsAPI;
    this.panel = new HotelsPanel();
    this.panel.handlePanelSubmit = this.doNewSearch;
    this.panel.sp.fromObject(this.searchParams);
    this.panel.original_template = this.panel.template;
    this.panel.template = 'tours-panel-template';
    this.overviewTemplate = 'tours-overview-hotels-ticket';
    this.template = 'hotels-results';
    this.activeHotel = ko.observable(0);
    this.selection = ko.observable(null);
    this.results = ko.observable();
    this.data = {
      results: this.results
    };
    this.newResults(raw, this.searchParams);
  }

  ToursHotelsResultSet.prototype.newResults = function(data, sp) {
    var result,
      _this = this;
    result = new HotelsResultSet(data, sp);
    result.tours(true);
    result.postInit();
    result.select = function(hotel) {
      hotel.off('back');
      hotel.on('back', function() {
        return _this.trigger('setActive', _this);
      });
      hotel.off('select');
      hotel.on('select', function(roomData) {
        _this.activeHotel(hotel.hotelId);
        return _this.selection(roomData);
      });
      return _this.trigger('setActive', {
        'data': hotel,
        template: 'hotels-info-template'
      });
    };
    this.hotels = true;
    this.selection(null);
    return this.results(result);
  };

  ToursHotelsResultSet.prototype.doNewSearch = function() {
    var _this = this;
    return this.api.search(this.panel.sp.url(), function(data) {
      return _this.newResults(data.hotels, data.searchParams);
    });
  };

  ToursHotelsResultSet.prototype.overviewText = function() {
    return this.destinationText();
  };

  ToursHotelsResultSet.prototype.numHotels = function() {
    return this.results.data.length;
  };

  ToursHotelsResultSet.prototype.minPrice = function() {
    return this.results.minPrice;
  };

  ToursHotelsResultSet.prototype.maxPrice = function() {
    return this.results.maxPrice;
  };

  ToursHotelsResultSet.prototype.destinationText = function() {
    return "Отель в " + this.searchParams.city;
  };

  ToursHotelsResultSet.prototype.price = function() {
    if (this.selection() === null) {
      return 0;
    }
    return this.selection().roomSet.price;
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
    result += dateUtils.formatHtmlDayShortMonth(this.results().checkIn);
    result += '</div>';
    result += '<div class="day">';
    result += dateUtils.formatHtmlDayShortMonth(this.results().checkOut);
    return result += '</div>';
  };

  return ToursHotelsResultSet;

})(TourEntry);

ToursResultSet = (function() {

  function ToursResultSet(raw) {
    this.showOverview = __bind(this.showOverview, this);

    this.removeItem = __bind(this.removeItem, this);

    this.setActive = __bind(this.setActive, this);

    var result, variant, _i, _len, _ref,
      _this = this;
    this.data = ko.observableArray();
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
    this.selection = ko.observable(this.data()[1]);
    this.panel = ko.computed({
      read: function() {
        console.log('TOURS-PANEL', _this.selection().panel);
        if (_this.selection().panel) {
          _this.panelContainer = _this.selection().panel;
        }
        return _this.panelContainer;
      }
    });
    this.price = ko.computed(function() {
      var item, sum, _j, _len1, _ref1;
      sum = 0;
      _ref1 = _this.data();
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        item = _ref1[_j];
        sum += item.price();
      }
      return sum;
    });
    this.savings = ko.computed(function() {
      var item, sum, _j, _len1, _ref1;
      sum = 0;
      _ref1 = _this.data();
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        item = _ref1[_j];
        sum += item.savings();
      }
      return sum;
    });
    this.vm = new ToursOverviewVM(this);
  }

  ToursResultSet.prototype.setActive = function(entry) {
    this.selection(entry);
    ko.processAllDeferredBindingUpdates();
    return ResizeAvia();
  };

  ToursResultSet.prototype.removeItem = function(item, event) {
    var idx;
    event.stopPropagation();
    if (this.data().length < 2) {
      return;
    }
    idx = this.data.indexOf(item);
    console.log(this.data.indexOf(item), item, this.selection());
    if (idx === -1) {
      return;
    }
    this.data.splice(idx, 1);
    if (item === this.selection()) {
      this.setActive(this.data()[0]);
    }
    return ResizeAvia();
  };

  ToursResultSet.prototype.showOverview = function() {
    return this.setActive({
      template: 'tours-overview',
      data: this
    });
  };

  return ToursResultSet;

})();

DestinationSearchParams = (function() {

  function DestinationSearchParams() {
    this.city = ko.observable('');
    this.dateFrom = ko.observable('');
    this.dateTo = ko.observable('');
  }

  return DestinationSearchParams;

})();

RoomsSearchParams = (function() {

  function RoomsSearchParams() {
    this.adt = ko.observable(2);
    this.chd = ko.observable(0);
    this.chdAge = ko.observable(false);
    this.cots = ko.observable(false);
  }

  return RoomsSearchParams;

})();

TourSearchParams = (function(_super) {

  __extends(TourSearchParams, _super);

  function TourSearchParams() {
    this.removeItem = __bind(this.removeItem, this);
    TourSearchParams.__super__.constructor.call(this);
    this.startCity = ko.observable('LED');
    this.destinations = ko.observableArray([new DestinationSearchParams()]);
    this.rooms = ko.observableArray([new SpRoom()]);
  }

  TourSearchParams.prototype.url = function() {
    var params, result,
      _this = this;
    result = 'tour/search?';
    params = [];
    _params.push('start=' + this.startCity());
    _.each(this.destinations(), function(destination, ind) {
      params.push('destinations[' + ind + '][city]=' + destination.city());
      params.push('destinations[' + ind + '][dateFrom]=' + destination.dateFrom());
      return params.push('destinations[' + ind + '][dateTo]=' + destination.dateTo());
    });
    params.push('rooms[0][adt]=' + this.adults());
    params.push('rooms[0][chd]=' + this.children());
    params.push('rooms[0][chdAge]=0');
    if (this.infants > 0) {
      params.push('rooms[0][cots]=1');
    } else {
      params.push('rooms[0][cots]=0');
    }
    result += params.join("&");
    window.voyanga_debug("Generated search url for tours", result);
    return result;
  };

  TourSearchParams.prototype.key = function() {
    var key;
    key = this.startCity();
    _.each(this.destinations(), function(destination) {
      return key += destination.city() + destination.dateFrom() + destination.dateTo();
    });
    key += this.adults();
    key += this.children();
    key += this.infants();
    return key;
  };

  TourSearchParams.prototype.getHash = function() {
    var hash, parts;
    parts = [this.startCity(), this.adults(), this.children(), this.infants()];
    _.each(this.destinations(), function(destination) {
      parts.push(destination.city());
      parts.push(destination.dateFrom());
      return parts.push(destination.dateTo());
    });
    hash = 'tour/search/' + parts.join('/') + '/';
    window.voyanga_debug("Generated hash for tour search", hash);
    return hash;
  };

  TourSearchParams.prototype.fromList = function(data) {
    var i, j, _i, _ref, _results;
    window.voyanga_debug("Restoring TourSearchParams from list");
    this.startCity(data[0]);
    this.adults(data[1]);
    this.children(data[2]);
    this.infants(data[3]);
    j = 0;
    _results = [];
    for (i = _i = 4, _ref = data.length; _i <= _ref; i = _i += 3) {
      this.destinations[j] = new DestinationSearchParams();
      this.destinations[j].city(data[i]);
      this.destinations[j].dateFrom(moment(data[i + 1], 'D.M.YYYY').toDate());
      this.destinations[j].dateTo(moment(data[i + 2], 'D.M.YYYY').toDate());
      _results.push(j++);
    }
    return _results;
  };

  TourSearchParams.prototype.fromObject = function(data) {
    var j;
    window.voyanga_debug("Restoring TourSearchParams from object");
    console.log(data);
    this.adults(data.adt);
    this.children(data.chd);
    this.infants(data.inf);
    j = 0;
    return _.each(data.destinations, function(destination) {
      this.destinations[j] = new DestinationSearchParams();
      this.destinations[j].city(destination.city);
      this.destinations[j].dateFrom(moment(destination.dateFrom, 'D.M.YYYY').toDate());
      this.destinations[j].dateTo(moment(destination.dateTo, 'D.M.YYYY').toDate());
      return j++;
    });
  };

  TourSearchParams.prototype.removeItem = function(item, event) {
    var idx;
    event.stopPropagation();
    if (this.data().length < 2) {
      return;
    }
    idx = this.data.indexOf(item);
    console.log(this.data.indexOf(item), item, this.selection());
    if (idx === -1) {
      return;
    }
    this.data.splice(idx, 1);
    if (item === this.selection()) {
      return this.setActive(this.data()[0]);
    }
  };

  return TourSearchParams;

})(SearchParams);

ToursOverviewVM = (function() {

  function ToursOverviewVM(resultSet) {
    this.resultSet = resultSet;
    this.dateHtml = __bind(this.dateHtml, this);

    this.dateClass = __bind(this.dateClass, this);

    this.startCity = __bind(this.startCity, this);

  }

  ToursOverviewVM.prototype.startCity = function() {
    var firstResult;
    firstResult = this.resultSet.data()[0];
    if (firstResult.isAvia()) {
      return firstResult.results().departureCity;
    } else {
      return 'Бобруйск';
    }
  };

  ToursOverviewVM.prototype.dateClass = function() {
    return 'blue-one';
  };

  ToursOverviewVM.prototype.dateHtml = function() {
    var firstResult, result, source;
    firstResult = this.resultSet.data()[0];
    source = firstResult.selection();
    result = '<div class="day">';
    if (firstResult.isAvia()) {
      result += dateUtils.formatHtmlDayShortMonth(source.departureDate());
    } else {
      result += dateUtils.formatHtmlDayShortMonth(firstResult.results.checkIn);
    }
    result += '</div>';
    return result;
  };

  return ToursOverviewVM;

})();
