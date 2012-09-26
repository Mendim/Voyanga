/*
SEARCH controller, should be splitted once we will get more actions here
*/

var ToursController,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __slice = [].slice;

ToursController = (function() {

  function ToursController(searchParams) {
    this.searchParams = searchParams;
    this.handleResults = __bind(this.handleResults, this);

    this.searchAction = __bind(this.searchAction, this);

    this.routes = {
      '': this.searchAction
    };
    _.extend(this, Backbone.Events);
  }

  ToursController.prototype.searchAction = function() {
    var args, key;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    window.voyanga_debug("TOURS: Invoking searchAction", args);
    key = "tours_6";
    if (sessionStorage.getItem(key) && (window.location.host !== 'test.voyanga.com')) {
      window.voyanga_debug("TOURS: Getting result from cache");
      return this.handleResults(JSON.parse(sessionStorage.getItem(key)));
    } else {
      window.voyanga_debug("TOURS: Getting results via JSONP");
      return $.ajax({
        url: "http://api.voyanga.com/v1/tour/search?start=BCN&destinations%5B0%5D%5Bcity%5D=MOW&destinations%5B0%5D%5BdateFrom%5D=01.10.2012&destinations%5B0%5D%5BdateTo%5D=10.10.2012&rooms%5B0%5D%5Badt%5D=1&rooms%5B0%5D%5Bchd%5D=0&rooms%5B0%5D%5BchdAge%5D=0&rooms%5B0%5D%5Bcots%5D=0",
        dataType: 'jsonp',
        success: this.handleResults
      });
    }
  };

  ToursController.prototype.handleResults = function(data) {
    var key, stacked;
    window.voyanga_debug("searchAction: handling results", data);
    key = "tours_6";
    sessionStorage.setItem(key, JSON.stringify(data));
    stacked = new ToursResultSet(data);
    this.trigger("results", stacked);
    this.render('results', stacked);
    return ko.processAllDeferredBindingUpdates();
  };

  ToursController.prototype.render = function(view, data) {
    return this.trigger("viewChanged", view, data);
  };

  return ToursController;

})();
