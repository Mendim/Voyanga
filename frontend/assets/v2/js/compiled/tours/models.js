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

    this.timelineEnd = __bind(this.timelineEnd, this);

    this.rt = __bind(this.rt, this);

    this.rtTimelineStart = __bind(this.rtTimelineStart, this);

    this.timelineStart = __bind(this.timelineStart, this);

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

  ToursAviaResultSet.prototype.timelineStart = function() {
    var source;
    source = this.selection();
    if (source === null) {
      source = this.results().data[0];
    }
    return source.departureDate();
  };

  ToursAviaResultSet.prototype.rtTimelineStart = function() {
    var source;
    source = this.selection();
    if (source === null) {
      source = this.results().data[0];
    }
    return source.rtDepartureDate();
  };

  ToursAviaResultSet.prototype.rt = function() {
    var source;
    source = this.selection();
    if (source === null) {
      source = this.results().data[0];
    }
    return source.roundTrip;
  };

  ToursAviaResultSet.prototype.timelineEnd = function() {
    var source;
    source = this.selection();
    if (source === null) {
      source = this.results().data[0];
    }
    return source.arrivalDate();
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
    this.timelineEnd = __bind(this.timelineEnd, this);

    this.timelineStart = __bind(this.timelineStart, this);

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

  ToursHotelsResultSet.prototype.timelineStart = function() {
    return this.results().checkIn;
  };

  ToursHotelsResultSet.prototype.timelineEnd = function() {
    return this.results().checkOut;
  };

  return ToursHotelsResultSet;

})(TourEntry);

ToursResultSet = (function() {

  function ToursResultSet(raw, searchParams) {
    var result, variant, _i, _len, _ref,
      _this = this;
    this.searchParams = searchParams;
    this.showOverview = __bind(this.showOverview, this);

    this.removeItem = __bind(this.removeItem, this);

    this.setActive = __bind(this.setActive, this);

    this.showTimeline = __bind(this.showTimeline, this);

    this.showConditions = __bind(this.showConditions, this);

    this.data = ko.observableArray();
    _ref = raw.allVariants;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      variant = _ref[_i];
      if (!variant) {
        continue;
      }
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
    this.timeline = ko.computed(function() {
      var avia_map, end_date, hotel_map, item, item_avia, item_hotel, left, middle_date, obj, results, right, spans, start_date, timeline_length, x, _j, _k, _l, _len1, _ref1;
      spans = [];
      avia_map = {};
      hotel_map = {};
      _ref1 = _this.data();
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        item = _ref1[_j];
        obj = {
          start: moment(item.timelineStart()),
          end: moment(item.timelineEnd())
        };
        spans.push(obj);
        if (item.isHotel()) {
          hotel_map[obj.start.format('M.D')] = {
            duration: obj.end.diff(obj.start, 'days')
          };
        }
        ({
          "else": avia_map[obj.start.format('M.D')] = {
            duration: obj.end.diff(obj.start, 'days')
          }
        });
      }
      start_date = spans[0].start;
      end_date = spans[spans.length - 1].end;
      if (true) {
        item = _this.data()[0];
        if (item.isAvia()) {
          if (item.rt()) {
            end_date = moment(item.rtTimelineStart());
            avia_map[end_date.format('M.D')] = {
              duration: 1
            };
          }
        }
      }
      timeline_length = end_date.diff(start_date, 'days');
      middle_date = start_date.clone().add('days', timeline_length / 2);
      if (timeline_length < 23) {
        timeline_length = 23;
      }
      left = timeline_length / 2;
      right = timeline_length / 2;
      if (timeline_length % 2) {
        right += 1;
      }
      results = [];
      console.log("MIDDLE", middle_date.format('D'));
      for (x = _k = 1; 1 <= left ? _k <= left : _k >= left; x = 1 <= left ? ++_k : --_k) {
        obj = {
          date: middle_date.clone().subtract('days', left - x)
        };
        obj.day = obj.date.format('D');
        obj.hotel = false;
        obj.avia = false;
        item_avia = avia_map[obj.date.format('M.D')];
        item_hotel = hotel_map[obj.date.format('M.D')];
        if (item_hotel) {
          obj.hotel = item_hotel;
          console.log("!!!!!!!!!!!!!!!!", item_hotel.duration, item_hotel.duration * 18);
        }
        if (item_avia) {
          obj.avia = item_avia;
        }
        results.push(obj);
      }
      for (x = _l = 0; 0 <= right ? _l <= right : _l >= right; x = 0 <= right ? ++_l : --_l) {
        obj = {
          date: middle_date.clone().add('days', x)
        };
        obj.day = obj.date.format('D');
        obj.hotel = false;
        obj.avia = false;
        item_avia = avia_map[obj.date.format('M.D')];
        item_hotel = hotel_map[obj.date.format('M.D')];
        if (item_hotel) {
          obj.hotel = item_hotel;
        }
        if (item_avia) {
          obj.avia = item_avia;
        }
        results.push(obj);
      }
      return results;
    });
    this.selection = ko.observable(this.data()[1]);
    this.panel = ko.computed({
      read: function() {
        console.log('TOURS-PANEL', _this.selection().panel);
        if (_this.selection().panel) {
          _this.panelContainer = _this.selection().panel;
        }
        _this.panelContainer.timeline = _this.timeline();
        _this.panelContainer.showConditions = _this.showConditions;
        _this.panelContainer.showTimeline = _this.showTimeline;
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

  ToursResultSet.prototype.showConditions = function(context, event) {
    var el;
    el = $(event.currentTarget);
    if (!el.hasClass('active')) {
      $('.btn-timeline-and-condition a').removeClass('active');
      el.addClass('active');
      $('.timeline').addClass('hide');
      $('.timeline').animate({
        'top': '-' + $('.timeline').height() + 'px'
      }, 400, function() {
        return $('.slide-tmblr').css('overflow', 'visible');
      });
      return $('.condition').animate({
        'top': '0px'
      }, 400).removeClass('hide');
    }
  };

  ToursResultSet.prototype.showTimeline = function(context, event) {
    var el;
    el = $(event.currentTarget);
    if (!el.hasClass('active')) {
      $('.slide-tmblr').css('overflow', 'hidden');
      $('.btn-timeline-and-condition a').removeClass('active');
      el.addClass('active');
      $('.timeline').animate({
        'top': '0px'
      }, 400).removeClass('hide');
      return $('.condition').animate({
        'top': '68px'
      }, 400).addClass('hide');
    }
  };

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

    var _this = this;
    TourSearchParams.__super__.constructor.call(this);
    this.startCity = ko.observable('LED');
    this.destinations = ko.observableArray([]);
    this.rooms = ko.observableArray([new SpRoom(this)]);
    this.overall = ko.computed(function() {
      var result, room, _i, _len, _ref;
      result = 0;
      _ref = _this.rooms();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        room = _ref[_i];
        result += room.adults();
        result += room.children();
      }
      return result;
    });
    this.returnBack = ko.observable(1);
  }

  TourSearchParams.prototype.url = function() {
    var params, result,
      _this = this;
    result = 'tour/search?';
    params = [];
    params.push('start=' + this.startCity());
    _.each(this.destinations(), function(destination, ind) {
      params.push('destinations[' + ind + '][city]=' + destination.city());
      params.push('destinations[' + ind + '][dateFrom]=' + moment(destination.dateFrom()).format('D.M.YYYY'));
      return params.push('destinations[' + ind + '][dateTo]=' + moment(destination.dateTo()).format('D.M.YYYY'));
    });
    _.each(this.rooms(), function(room, ind) {
      return params.push(room.getUrl(ind));
    });
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
    _.each(this.rooms(), function(room) {
      return key += room.getHash();
    });
    return key;
  };

  TourSearchParams.prototype.getHash = function() {
    var hash, parts;
    parts = [this.startCity(), this.returnBack()];
    _.each(this.destinations(), function(destination) {
      parts.push(destination.city());
      parts.push(moment(destination.dateFrom()).format('D.M.YYYY'));
      return parts.push(moment(destination.dateTo()).format('D.M.YYYY'));
    });
    parts.push('rooms');
    _.each(this.rooms(), function(room) {
      return parts.push(room.getHash());
    });
    hash = 'tours/search/' + parts.join('/') + '/';
    window.voyanga_debug("Generated hash for tour search", hash);
    return hash;
  };

  TourSearchParams.prototype.fromList = function(data) {
    var destination, doingrooms, i, room, _i, _ref;
    window.voyanga_debug("Restoring TourSearchParams from list");
    this.startCity(data[0]);
    this.returnBack(data[1]);
    doingrooms = false;
    this.destinations([]);
    this.rooms([]);
    for (i = _i = 2, _ref = data.length; _i <= _ref; i = _i += 3) {
      if (data[i] === 'rooms') {
        break;
      }
      console.log(data[i], data[i + 1], data[i + 2]);
      destination = new DestinationSearchParams();
      destination.city(data[i]);
      destination.dateFrom(moment(data[i + 1], 'D.M.YYYY').toDate());
      destination.dateTo(moment(data[i + 2], 'D.M.YYYY').toDate());
      this.destinations.push(destination);
    }
    i = i + 1;
    while (i < data.length) {
      room = new SpRoom(this);
      room.fromList(data[i]);
      this.rooms.push(room);
      i++;
    }
    return window.voyanga_debug('Result', this);
  };

  TourSearchParams.prototype.fromObject = function(data) {
    window.voyanga_debug("Restoring TourSearchParams from object");
    console.log(data);
    _.each(data.destinations, function(destination) {
      destination = new DestinationSearchParams();
      destination.city(destination.city);
      destination.dateFrom(moment(destination.dateFrom, 'D.M.YYYY').toDate());
      destination.dateTo(moment(destination.dateTo, 'D.M.YYYY').toDate());
      return this.destinations.push(destination);
    });
    _.each(data.rooms, function(room) {
      room = new SpRoom(this);
      return this.rooms.push(this.room.fromObject(room));
    });
    return window.voyanga_debug('Result', this);
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
