/*
SEARCH controller, should be splitted once we will get more actions here
*/

var HotelsController,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __slice = [].slice;

HotelsController = (function() {

  function HotelsController(searchParams) {
    this.searchParams = searchParams;
    this.timelineAction = __bind(this.timelineAction, this);

    this.indexAction = __bind(this.indexAction, this);

    this.handleResults = __bind(this.handleResults, this);

    this.searchAction = __bind(this.searchAction, this);

    this.api = new HotelsAPI;
    this.routes = {
      '/search/:from/:in/:out/*rest': this.searchAction,
      '/timeline/': this.timelineAction,
      '': this.indexAction
    };
    _.extend(this, Backbone.Events);
  }

  HotelsController.prototype.searchAction = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    window.voyanga_debug("HOTELS: Invoking searchAction", args);
    this.searchParams.fromList(args);
    return this.api.search(this.searchParams.url(), this.handleResults);
  };

  HotelsController.prototype.handleResults = function(data) {
    var stacked;
    window.voyanga_debug("HOTELS: searchAction: handling results", data);
    stacked = new HotelsResultSet(data.hotels, data.searchParams);
    stacked.cacheId = data.cacheId;
    return this.render('results', {
      'results': stacked
    });
  };

  HotelsController.prototype.indexAction = function() {
    window.voyanga_debug("HOTELS: indexAction");
    return this.render('index', {});
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
