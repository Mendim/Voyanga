$(function(){
    window.toursOverviewActive = true;
});

initCompletedPage = function() {
    var app, avia, hotels, tour;
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
    var currentModule = 'tours';
    app.bindItemsToBuy();
    ko.applyBindings(app);
    ko.processAllDeferredBindingUpdates();
    app.runWithModule(currentModule);
};
