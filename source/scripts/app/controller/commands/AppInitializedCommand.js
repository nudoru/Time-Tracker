define('APP.AppInitializedCommand',
  function (require, module, exports) {

    exports.execute = function(data) {
      var _browserEvents = require('nudoru.events.BrowserEvents'),
          _appEvents = require('APP.AppEvents');

      console.log('AppInitializedCommand');

      // Browser events
      APP.mapEventCommand(_browserEvents.BROWSER_RESIZED, 'APP.BrowserResizedCommand');
      APP.mapEventCommand(_browserEvents.BROWSER_SCROLLED, 'APP.BrowserScrolledCommand');

      // App events
      APP.mapEventCommand(_appEvents.CHANGE_ROUTE, 'APP.ChangeRouteCommand');
      APP.mapEventCommand(_appEvents.VIEW_CHANGED, 'APP.ViewChangedCommand');
      APP.mapEventCommand(_appEvents.VIEW_CHANGE_TO_MOBILE, 'APP.ViewChangedToMobileCommand');
      APP.mapEventCommand(_appEvents.VIEW_CHANGE_TO_DESKTOP, 'APP.ViewChangedToDesktopCommand');

      // Routes
      APP.mapRouteView('/', 'TemplateSubView', 'APP.View.TemplateSubView', false);
      APP.mapRouteView('/1', 'TestSubView', 'APP.View.TemplateSubView', false);

      APP.view().removeLoadingMessage();

      APP.router().runCurrentRoute();
    };

  });