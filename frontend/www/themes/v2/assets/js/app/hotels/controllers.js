/*
SEARCH controller, should be splitted once we will get more actions here
*/

var HotelsController,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __slice = [].slice;

HotelsController = (function() {

  function HotelsController() {
    this.timelineAction = __bind(this.timelineAction, this);

    this.infoAction = __bind(this.infoAction, this);

    this.indexAction = __bind(this.indexAction, this);

    this.handleResultsInfo = __bind(this.handleResultsInfo, this);

    this.handleResults = __bind(this.handleResults, this);

    this.searchAction = __bind(this.searchAction, this);
    this.routes = {
      '/search/:from/:to/:when/': this.searchAction,
      '/info/:cacheId/:hotelId/': this.infoAction,
      '/timeline/': this.timelineAction,
      '': this.indexAction
    };
    _.extend(this, Backbone.Events);
  }

  HotelsController.prototype.searchAction = function() {
    var args, key;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    window.voyanga_debug("HOTELS: Invoking searchAction", args);
    key = "h_search_10007";
    if (sessionStorage.getItem(key) && (window.location.host !== 'test.voyanga.com')) {
      window.voyanga_debug("HOTELS: Getting result from cache");
      return this.handleResults(JSON.parse(sessionStorage.getItem(key)));
    } else {
      window.voyanga_debug("HOTELS: Getting results via JSONP");
      return $.ajax({
        url: "http://api.voyanga.com/v1/hotel/search?city=LED&checkIn=2012-10-11&duration=3&rooms%5B0%5D%5Badt%5D=2&rooms%5B0%5D%5Bchd%5D=0&rooms%5B0%5D%5BchdAge%5D=0&rooms%5B0%5D%5Bcots%5D=0",
        dataType: 'jsonp',
        success: this.handleResults
      });
    }
  };

  HotelsController.prototype.handleResults = function(data) {
    var key, stacked;
    window.voyanga_debug("HOTELS: searchAction: handling results", data);
    key = "h_search_10007";
    sessionStorage.setItem(key, JSON.stringify(data));
    stacked = new HotelsResultSet(data.hotels, data.searchParams);
    return this.render('results', {
      'results': stacked
    });
  };

  HotelsController.prototype.handleResultsInfo = function(data) {
    var hotel, key, otherHotels, stacked, stackedOthers, _ref;
    window.voyanga_debug("HOTELS: searchAction: handling results", data);
    key = "h_info_10001";
    sessionStorage.setItem(key, JSON.stringify(data));
    stacked = new HotelsResultSet([data.hotel]);
    otherHotels = [];
    _ref = data.hotel.details;
    for (key in _ref) {
      hotel = _ref[key];
      otherHotels.push(hotel);
    }
    stackedOthers = new HotelsResultSet(otherHotels);
    console.log(stackedOthers);
    return this.render('info-template', {
      'result': stacked.data[0],
      'variants': stackedOthers.data[0]
    });
  };

  HotelsController.prototype.indexAction = function() {
    window.voyanga_debug("HOTELS: indexAction");
    return this.searchAction();
  };

  HotelsController.prototype.infoAction = function() {
    var args, key;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    console.log(args);
    key = "h_info_10001";
    if (sessionStorage.getItem(key)) {
      window.voyanga_debug("HOTELS: Getting result from cache");
      return this.handleResultsInfo(JSON.parse(sessionStorage.getItem(key)));
    } else {
      window.voyanga_debug("HOTELS: Getting results via JSONP");
      return $.ajax({
        url: "http://api.voyanga.com/v1/hotel/search/info?cacheId=420f2ffaace4f4ba88aedced51b036b7&hotelId=17",
        dataType: 'jsonp',
        success: this.handleResultsInfo
      });
    }
  };

  HotelsController.prototype.timelineAction = function() {
    var _this = this;
    this.render('timeline-template');
    return window.setTimeout(function() {
      VoyangaCalendarTimeline.calendarEvents = [
        {
          dayStart: Date.fromIso('2012-09-21'),
          dayEnd: Date.fromIso('2012-09-22'),
          type: 'flight',
          color: 'red',
          description: 'Led || Mow'
        }, {
          dayStart: Date.fromIso('2012-09-21'),
          dayEnd: Date.fromIso('2012-09-28'),
          type: 'hotel',
          color: 'red',
          description: 'Californication Hotel'
        }, {
          dayStart: Date.fromIso('2012-10-23'),
          dayEnd: Date.fromIso('2012-10-23'),
          type: 'flight',
          color: 'red',
          description: 'Mow || Led'
        }
      ];
      return VoyangaCalendarTimeline.init();
    }, 1000);
  };

  HotelsController.prototype.render = function(view, data) {
    window.voyanga_debug("HOTELS: rendering", view, data);
    return this.trigger("viewChanged", view, data);
  };

  return HotelsController;

})();
