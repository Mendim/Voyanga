var AviaPanel, EXITED, MAX_CHILDREN, MAX_TRAVELERS, balanceTravelers,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

MAX_TRAVELERS = 9;

MAX_CHILDREN = 8;

EXITED = true;

/*
Balances number of travelers, using those which was not affected by most recent user change
*/


balanceTravelers = function(others, model) {
  var delta, prop, _i, _len;
  if (model.overall() > MAX_TRAVELERS && EXITED) {
    EXITED = false;
    delta = model.overall() - MAX_TRAVELERS;
    for (_i = 0, _len = others.length; _i < _len; _i++) {
      prop = others[_i];
      if (model[prop]() >= delta) {
        model[prop](model[prop]() - delta);
        break;
      } else {
        delta -= model[prop]();
        model[prop](0);
      }
    }
  }
  return EXITED = true;
};

AviaPanel = (function() {

  function AviaPanel() {
    this.selectRoundTrip = __bind(this.selectRoundTrip, this);

    this.selectOneWay = __bind(this.selectOneWay, this);

    var _this = this;
    window.voyanga_debug("AviaPanel created");
    this.minimized = ko.observable(false);
    this.sp = new SearchParams();
    this.departureCity = this.sp.dep;
    this.arrivalCity = this.sp.arr;
    this.rt = this.sp.rt;
    this.adults = this.sp.adults;
    this.children = this.sp.children;
    this.infants = this.sp.infants;
    this.adults.subscribe(function(newValue) {
      if (_this.infants() > _this.adults()) {
        _this.infants(_this.adults());
      }
      if (newValue > MAX_TRAVELERS) {
        _this.adults(MAX_TRAVELERS);
      }
      return balanceTravelers(["children", 'infants'], _this);
    });
    this.children.subscribe(function(newValue) {
      if (newValue > MAX_TRAVELERS - 1) {
        _this.children(MAX_TRAVELERS - 1);
      }
      return balanceTravelers(["adults", 'infants'], _this);
    });
    this.infants.subscribe(function(newValue) {
      if (newValue > _this.adults()) {
        _this.adults(_this.infants());
      }
      return balanceTravelers(["children", 'adults'], _this);
    });
    this.sum_children = ko.computed(function() {
      return _this.children() * 1 + _this.infants() * 1;
    });
    this.overall = ko.computed(function() {
      return _this.adults() * 1 + _this.children() * 1 + _this.infants() * 1;
    });
    this.rt.subscribe(function(newValue) {
      if (newValue) {
        return $('.tumblr .switch').animate({
          'left': '35px'
        }, 200);
      } else {
        return $('.tumblr .switch').animate({
          'left': '-1px'
        }, 200);
      }
    });
    this.minimized.subscribe(function(minimized) {
      var heightSubHead, speed;
      speed = 300;
      heightSubHead = $('.sub-head').height();
      if (!minimized) {
        return $('.sub-head').animate({
          'margin-top': '0px'
        }, speed);
      } else {
        return $('.sub-head').animate({
          'margin-top': '-' + (heightSubHead - 4) + 'px'
        }, speed);
      }
    });
    $(function() {
      $('.how-many-man .popup').find('input').hover(function() {
        $(this).parent().find('.plusOne').show();
        return $(this).parent().find('.minusOne').show();
      });
      $('.adults,.childs,.small-childs').hover(null, function() {
        $(this).parent().find('.plusOne').hide();
        return $(this).parent().find('.minusOne').hide();
      });
      $('.plusOne').hover(function() {
        $(this).addClass('active');
        return $('.minusOne').addClass('active');
      }, function() {
        $(this).removeClass('active');
        return $('.minusOne').removeClass('active');
      });
      $('.minusOne').hover(function() {
        $(this).addClass('active');
        return $('.plusOne').addClass('active');
      }, function() {
        $(this).removeClass('active');
        return $('.plusOne').removeClass('active');
      });
      $('.how-many-man .popup').find('input').focus(function() {
        $(this).attr('rel', $(this).val());
        return $(this).val('');
      });
      $('.how-many-man .popup').find('input').blur(function() {
        if ($(this).val() === '') {
          $(this).val($(this).attr('rel'));
        }
        return $(this).trigger('change');
      });
      return _this.rt(!_this.rt());
    });
  }

  /*
    # Click handlers
  */


  AviaPanel.prototype.selectOneWay = function() {
    return this.rt(false);
  };

  AviaPanel.prototype.selectRoundTrip = function() {
    return this.rt(true);
  };

  AviaPanel.prototype.minimize = function() {
    if (this.minimized()) {
      return this.minimized(false);
    } else {
      return this.minimized(true);
    }
  };

  AviaPanel.prototype.plusOne = function(model, e) {
    var prop;
    prop = $(e.target).attr("rel");
    return model[prop](model[prop]() + 1);
  };

  AviaPanel.prototype.minusOne = function(model, e) {
    var prop;
    prop = $(e.target).attr("rel");
    return model[prop](model[prop]() - 1);
  };

  AviaPanel.prototype.navigateToNewSearch = function() {
    return app.navigate(this.sp.getHash(), {
      trigger: true
    });
  };

  return AviaPanel;

})();
