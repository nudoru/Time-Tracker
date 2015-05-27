/**
 * Starting point for the application after the view renders and model data is loaded
 */

define('TT.RunApplicationCommand',
  function (require, module, exports) {

    exports.execute = function(data) {
      console.log('TT.RunApplicationCommand');

      // Browser events
      // unused mapEventCommand(_browserEvents.BROWSER_RESIZED, 'Nori.BrowserResizedCommand');
      // unused mapEventCommand(_browserEvents.BROWSER_SCROLLED, 'Nori.BrowserScrolledCommand');

      // App events
      // unused mapEventCommand(_appEvents.ROUTE_CHANGED, 'Nori.RouteChangedCommand');
      // unused mapEventCommand(_appEvents.VIEW_CHANGED, 'Nori.ViewChangedCommand');
      // unused mapEventCommand(_appEvents.VIEW_CHANGE_TO_MOBILE, 'Nori.ViewChangedToMobileCommand');
      // unused mapEventCommand(_appEvents.VIEW_CHANGE_TO_DESKTOP, 'Nori.ViewChangedToDesktopCommand');

      /*
       Map route args:
       url fragment for route, ID (template id), module name for controller, use singleton module
       */

      // Default route
      TT.mapRouteView('/', 'Timecard', 'TT.View.TemplateSubView');

      // Other routes
      TT.mapRouteView('/controls', 'ControlsTesting', 'TT.View.ControlsTestingSubView');
      TT.mapRouteView('/test', 'TestSubView', 'TT.View.TemplateSubView');
      TT.mapRouteView('/one', 'TestSubView1', 'TT.View.TemplateSubView');
      TT.mapRouteView('/two', 'TestSubView2', 'TT.View.TemplateSubView');
      TT.mapRouteView('/three', 'TestSubView3', 'TT.View.TemplateSubView');

      // Timecard mock
      TT.mapRouteView('/Forecast', 'Forecast', 'TT.View.TemplateSubView');
      TT.mapRouteView('/Assignments', 'Assignments', 'TT.View.TemplateSubView');
      TT.mapRouteView('/Timecard', 'Timecard', 'TT.View.TemplateSubView');

      TT.view().removeLoadingMessage();

      TT.setCurrentRoute(TT.router().getCurrentRoute());
    };

  });