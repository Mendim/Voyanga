var Application,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

Application = (function(_super) {

  __extends(Application, _super);

  function Application() {
    this.isEvent = __bind(this.isEvent, this);

    this.isNotEvent = __bind(this.isNotEvent, this);

    this.mapRendered = __bind(this.mapRendered, this);

    this.contentRendered = __bind(this.contentRendered, this);

    this.render = __bind(this.render, this);

    this.initCalendar = __bind(this.initCalendar, this);

    var result,
      _this = this;
    window.onerror = function(error) {
      return alert(error);
    };
    this.activeModule = ko.observable(null);
    this.activeModuleInstance = ko.observable(null);
    result = {
      template: '',
      data: {},
      rt: function() {
        return true;
      },
      departureDate: function() {
        return '12.11.2013';
      },
      arrivalDate: function() {
        return '12.12.2013';
      },
      calendarText: 'DOH',
      minimizeCalendar: function() {
        return true;
      },
      calendarHidden: function() {
        return true;
      },
      calendarShadow: function() {
        return true;
      },
      afterRender: function() {}
    };
    this.fakoPanel = ko.observable(result);
    this.panel = ko.computed(function() {
      var am;
      am = _this.activeModuleInstance();
      if (am) {
        result = ko.utils.unwrapObservable(am.panel);
        result = ko.utils.unwrapObservable(result);
        if (result !== null) {
          _this.fakoPanel(result);
          return ko.processAllDeferredBindingUpdates();
        }
      }
    });
    this._view = ko.observable('index');
    this.activeView = ko.computed(function() {
      return _this.activeModule() + '-' + _this._view();
    });
    this.calendarInitialized = false;
    this.viewData = ko.observable({});
    this.slider = new Slider();
    this.slider.init();
    this.activeModule.subscribe(this.slider.handler);
  }

  Application.prototype.initCalendar = function() {
    if (!this.calendarInitialized) {
      new Calendar(this.fakoPanel);
      return this.calendarInitialized = true;
    }
  };

  Application.prototype.render = function(data, view) {
    this.viewData(data);
    return this._view(view);
  };

  Application.prototype.register = function(prefix, module, isDefault) {
    var action, controller, route, _ref,
      _this = this;
    if (isDefault == null) {
      isDefault = false;
    }
    controller = module.controller;
    controller.on("viewChanged", function(view, data) {
      return _this.render(data, view);
    });
    _ref = controller.routes;
    for (route in _ref) {
      action = _ref[route];
      window.voyanga_debug("APP: registreing route", prefix, route, action);
      this.route(prefix + route, prefix, action);
      if (isDefault && route === '') {
        this.route(route, prefix, action);
      }
    }
    return this.on("beforeroute:" + prefix, function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      window.voyanga_debug("APP: routing", args);
      if (this.panel() === void 0 || (prefix !== this.activeModule())) {
        window.voyanga_debug("APP: switching active module to", prefix);
        this.activeModule(prefix);
        window.voyanga_debug("APP: activating panel", ko.utils.unwrapObservable(module.panel));
        this.activeModuleInstance(module);
        $(window).unbind('resize');
        $(window).resize(module.resize);
        return ko.processAllDeferredBindingUpdates();
      }
    });
  };

  Application.prototype.run = function() {
    Backbone.history.start();
    return this.slider.handler(this.activeModule());
  };

  Application.prototype.http404 = function() {
    return alert("Not found");
  };

  Application.prototype.route = function(route, name, callback) {
    return Backbone.Router.prototype.route.call(this, route, name, function() {
      this.trigger.apply(this, ['beforeroute:' + name].concat(_.toArray(arguments)));
      return callback.apply(this, arguments);
    });
  };

  Application.prototype.contentRendered = function() {
    window.voyanga_debug("APP: Content rendered");
    this.trigger(this.activeModule() + ':contentRendered');
    return ResizeFun();
  };

  Application.prototype.mapRendered = function(elem) {
    console.log("Map Rendered");
    return $('.slideTours').find('.active').find('.triangle').animate({
      'top': '-17px'
    }, 200);
  };

  Application.prototype.isNotEvent = function() {
    return !this.isEvent();
  };

  Application.prototype.isEvent = function() {
    return this.activeView() === 'tours-index';
  };

  return Application;

})(Backbone.Router);

$(function() {
  var app, avia, hotels, tour;
  console.time("App dispatching");
  window.voyanga_debug = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return console.log.apply(console, args);
  };
  app = new Application();
  avia = new AviaModule();
  hotels = new HotelsModule();
  tour = new ToursModule();
  window.app = app;
  app.register('tours', tour, true);
  app.register('hotels', hotels);
  app.register('avia', avia);
  app.run();
  console.timeEnd("App dispatching");
  console.time("Rendering");
  ko.applyBindings(app);
  ko.processAllDeferredBindingUpdates();
  app.initCalendar();
  return console.timeEnd("Rendering");
});
