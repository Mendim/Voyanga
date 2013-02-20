// Generated by CoffeeScript 1.4.0
var AviaPanel,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AviaPanel = (function(_super) {

  __extends(AviaPanel, _super);

  function AviaPanel() {
    this.afterRender = __bind(this.afterRender, this);

    this.handlePanelSubmit = __bind(this.handlePanelSubmit, this);

    this.selectRoundTrip = __bind(this.selectRoundTrip, this);

    this.selectOneWay = __bind(this.selectOneWay, this);

    this.setDate = __bind(this.setDate, this);

    var _this = this;
    AviaPanel.__super__.constructor.call(this);
    this.prevPanel = 'tours';
    this.nextPanel = 'hotels';
    this.mainLabel = 'Поиск авиабилетов';
    this.icon = 'fly-ico';
    this.template = 'avia-panel-template';
    this.sp = new AviaSearchParams();
    this.passengers = this.sp.passengers;
    this.departureDate = this.sp.date;
    this.departureCity = this.sp.dep;
    this.departureCityReadable = ko.observable('');
    this.departureCityReadableGen = ko.observable('');
    this.departureCityReadableAcc = ko.observable('');
    this.rt = this.sp.rt;
    this.rtDate = this.sp.rtDate;
    this.arrivalCity = this.sp.arr;
    this.arrivalCityReadable = ko.observable('');
    this.arrivalCityReadableGen = ko.observable('');
    this.arrivalCityReadableAcc = ko.observable('');
    this.prefixText = 'Все направления<br>500+ авиакомпаний';
    this.calendarActive = ko.observable(true);
    this.oldCalendarState = this.minimizedCalendar();
    this.show = this.passengers.show;
    this.fromChosen = ko.computed(function() {
      if (_this.departureDate().getDay) {
        return true;
      }
      return _this.departureDate().length > 0;
    });
    this.rtFromChosen = ko.computed(function() {
      if (!_this.rt()) {
        return false;
      }
      if (_this.rtDate().getDay) {
        return true;
      }
      return _this.rtDate().length > 0;
    });
    this.formFilled = ko.computed(function() {
      var result;
      result = _this.departureCity() && _this.arrivalCity() && _this.fromChosen();
      if (_this.rt()) {
        result = result && _this.rtFromChosen();
      }
      return result;
    });
    this.formNotFilled = ko.computed(function() {
      return !_this.formFilled();
    });
    this.maximizedCalendar = ko.computed(function() {
      return _this.departureCity() && _this.arrivalCity();
    });
    this.maximizedCalendar.subscribe(function(newValue) {
      if (!newValue) {
        return;
      }
      if (_this.calendarActive()) {
        if (_this.rt() && !_this.rtFromChosen()) {
          _this.showCalendar();
          return;
        }
        if (!_this.fromChosen()) {
          _this.showCalendar();
        }
      }
    });
    this.calendarValue = ko.computed(function() {
      return {
        twoSelect: _this.rt(),
        from: _this.departureDate(),
        to: _this.rtDate(),
        hotels: false,
        activeSearchPanel: _this
      };
    });
    this.departureDateDay = ko.computed(function() {
      return dateUtils.formatDay(_this.departureDate());
    });
    this.departureDateMonth = ko.computed(function() {
      return dateUtils.formatMonth(_this.departureDate());
    });
    this.rtDateDay = ko.computed(function() {
      return dateUtils.formatDay(_this.rtDate());
    });
    this.rtDateMonth = ko.computed(function() {
      return dateUtils.formatMonth(_this.rtDate());
    });
    this.rt.subscribe(this.rtTumbler);
    this.rtTumbler(this.rt());
    $('.how-many-man .btn');
    this.calendarText = ko.computed(function() {
      var arrow, result;
      result = "Выберите дату перелета ";
      if (_this.rt()) {
        arrow = ' ↔ ';
      } else {
        arrow = ' → ';
      }
      if ((_this.departureCityReadable().length > 0) && (_this.arrivalCityReadable().length > 0)) {
        result += _this.departureCityReadable() + arrow + _this.arrivalCityReadable();
      } else if ((_this.departureCityReadable().length === 0) && (_this.arrivalCityReadable().length > 0)) {
        result += ' в ' + _this.arrivalCityReadableAcc();
      } else if ((_this.departureCityReadable().length > 0) && (_this.arrivalCityReadable().length === 0)) {
        result += ' из ' + _this.departureCityReadableGen();
      }
      return result;
    });
  }

  AviaPanel.prototype.rtTumbler = function(newValue) {
    if (newValue) {
      return $('.tumblr .switch').animate({
        'left': '35px'
      }, 200);
    } else {
      return $('.tumblr .switch').animate({
        'left': '-1px'
      }, 200);
    }
  };

  AviaPanel.prototype.setDate = function(values) {
    if (values.length) {
      if (!this.departureDate() || (moment(this.departureDate()).format('YYYY-MM-DD') !== moment(values[0]).format('YYYY-MM-DD'))) {
        this.departureDate(values[0]);
      }
      if (this.rt && values.length > 1) {
        if (values[1] >= this.departureDate()) {
          if (!this.rtDate() || (moment(this.rtDate()).format('YYYY-MM-DD') !== moment(values[1]).format('YYYY-MM-DD'))) {
            return this.rtDate(values[1]);
          }
        } else {
          return this.rtDate('');
        }
      }
    }
  };

  /*
    # Click handlers
  */


  AviaPanel.prototype.selectOneWay = function() {
    return this.rt(false);
  };

  AviaPanel.prototype.selectRoundTrip = function() {
    return this.rt(true);
  };

  AviaPanel.prototype.handlePanelSubmit = function() {
    if (window.location.pathname.replace('/', '') !== '') {
      $('#loadWrapBgMin').show();
      window.location.href = '/#' + this.sp.getHash();
      return;
    }
    app.navigate(this.sp.getHash(), {
      trigger: true
    });
    return this.minimizedCalendar(true);
  };

  AviaPanel.prototype.navigateToNewSearch = function() {
    if (this.formNotFilled()) {
      return;
    }
    this.handlePanelSubmit();
    return this.minimizedCalendar(true);
  };

  AviaPanel.prototype.returnRecommend = function(context, event) {
    $('.recomended-content').slideDown();
    $('.order-hide').fadeIn();
    return $(event.currentTarget).animate({
      top: '-19px'
    }, 500, null, function() {
      return ResizeAvia();
    });
  };

  AviaPanel.prototype.afterRender = function() {
    var _this = this;
    $(function() {
      _this.sp.passengers.afterRender();
      _this.rtTumbler(_this.rt());
      return $('.how-many-man .btn');
    });
    return resizePanel();
  };

  return AviaPanel;

})(SearchPanel);

$(document).on("autocompleted", "input.departureCity", function() {
  return $('input.arrivalCity.second-path').focus();
});

$(document).on("keyup change", "input.second-path", function(e) {
  var firstValue, secondEl;
  firstValue = $(this).val();
  secondEl = $(this).siblings('input.input-path');
  if ((e.keyCode === 8) || (firstValue.length < 3)) {
    return secondEl.val('');
  }
});
