// Generated by CoffeeScript 1.4.0
var PhotoBox,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

PhotoBox = (function() {

  function PhotoBox(photos, title, stars, initIndex) {
    var _this = this;
    this.photos = photos;
    this.title = title;
    this.stars = stars != null ? stars : 0;
    if (initIndex == null) {
      initIndex = 0;
    }
    this._load = __bind(this._load, this);
    this.prev = __bind(this.prev, this);
    this.next = __bind(this.next, this);
    this.photoLoad = __bind(this.photoLoad, this);
    if (photos.length === 0) {
      return;
    }
    this.activeIndex = ko.observable(initIndex);
    this.length0 = photos.length - 1;
    this.activePhoto = ko.observable(this.photos[this.activeIndex()]['largeUrl']);
    this.activeDesc = ko.observable(this.photos[this.activeIndex()]['description']);
    this.busy = false;
    $('body').prepend('<div id="popupOverlayPhoto"></div>');
    $('body').prepend($('#photo-popup-template').html());
    ko.applyBindings(this, $('#body-popup-Photo')[0]);
    ko.processAllDeferredBindingUpdates();
    resizeLoad();
    this.loadFirstTime = true;
    $(window).keyup(function(e) {
      if (e.keyCode === 27) {
        return _this.close();
      } else if (e.keyCode === 37) {
        return _this.prev();
      } else if (e.keyCode === 39) {
        return _this.next();
      }
    });
  }

  PhotoBox.prototype.close = function() {
    $(window).unbind('keyup');
    $('#body-popup-Photo').remove();
    return $('#popupOverlayPhoto').remove();
  };

  PhotoBox.prototype.photoLoad = function(context, event) {
    var el;
    console.log("PHOTOLOAD");
    if (this.loadFirstTime) {
      this.loadFirstTime = false;
    }
    el = $(event.currentTarget);
    el.show();
    console.log(el);
    if (el.width() > 850) {
      el.css('width', '850px');
    } else {
      el.css('width', 'auto');
    }
    $('#hotel-img-load').hide();
    el.animate({
      opacity: 1
    }, 300, function() {
      return console.log("opacitied");
    });
    return this.busy = false;
  };

  PhotoBox.prototype.next = function(context, event) {
    if (this.busy) {
      return;
    }
    if (this.activeIndex() >= this.length0) {
      return;
    }
    this.activeIndex(this.activeIndex() + 1);
    return this._load();
  };

  PhotoBox.prototype.prev = function(context, event) {
    if (this.busy) {
      return;
    }
    if (this.activeIndex() <= 0) {
      return;
    }
    this.activeIndex(this.activeIndex() - 1);
    return this._load();
  };

  PhotoBox.prototype._load = function(var1, var2) {
    var _this = this;
    $('#body-popup-Photo').find('table img').animate({
      opacity: 0
    }, 300, function() {
      _this.activePhoto(_this.photos[_this.activeIndex()]['largeUrl']);
      return _this.activeDesc(_this.photos[_this.activeIndex()]['description']);
    });
    return $('#hotel-img-load').show();
  };

  return PhotoBox;

})();
