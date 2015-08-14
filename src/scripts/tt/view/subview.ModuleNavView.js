/**
 * Manages left side module navigation
 */

define('tt/view/ModuleNavView',
  function (require, module, exports) {

    var _this,
        _buttonMap         = Object.create(null),
        _browserInfo       = require('nudoru/browser/BrowserInfo'),
        _appEventConstants = require('nori/events/EventConstants'),
        _domUtils          = require('nudoru/browser/DOMUtils'),
        _dispatcher        = require('nori/utils/Dispatcher');

    function initialize() {
      _this = this;

      mapButton('btn_assignments', '/Assignments');
      mapButton('btn_timecard', '/');
      mapButton('btn_forecast', '/Forecast');

      // Highlight the correct module when a route change occurs
      Nori.router().subscribe(function onRouteChange(payload) {
        _this.highlightModule(payload.routeObj.route);
      });
    }

    /**
     * Set up data for a button
     * @param elID
     * @param route
     */
    function mapButton(elID, route) {
      var buttonEl = document.getElementById(elID),
          liEl     = buttonEl.parentNode;

      _buttonMap[elID] = {
        buttonEl   : buttonEl,
        liEl       : liEl,
        route      : route,
        clickStream: Rx.Observable.fromEvent(buttonEl, _browserInfo.mouseClickEvtStr())
          .subscribe(function () {
            handleButton(elID);
          })
      };
    }

    /**
     * Change the appliation route when a button is pressed
     * @param id
     */
    function handleButton(id) {
      _dispatcher.publish({
        type   : _appEventConstants.CHANGE_ROUTE,
        payload: {route: _buttonMap[id].route}
      });
    }

    /**
     * Highlight a button in response to a view change
     * @param route
     */
    function highlightModule(route) {
      for (var p in _buttonMap) {
        var btn = _buttonMap[p];
        if (btn.route === route) {
          _domUtils.addClass(btn.liEl, 'active');
        } else {
          _domUtils.removeClass(btn.liEl, 'active');
        }
      }

      // Default since it won't matches one of the specific routes
      if (route === '/') {
        _domUtils.addClass(_buttonMap.btn_timecard.liEl, 'active');
      }
    }

    module.exports.initialize      = initialize;
    module.exports.highlightModule = highlightModule;

  });