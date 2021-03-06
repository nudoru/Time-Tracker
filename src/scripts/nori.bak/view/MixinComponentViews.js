/**
 * Mixin view that allows for component views and route mapping and display
 */

define('nori/view/MixinComponentViews',
  function (require, module, exports) {

    var _routeViewMountPoint,
        _currentRouteViewID,
        _componentViewMap            = Object.create(null),
        _routeViewIDMap              = Object.create(null),
        _componentHTMLTemplatePrefix = 'template__',
        _template                    = require('nori/utils/Templating'),
        _noriEvents                  = require('nori/events/EventCreator');

    /**
     * Set up listeners
     */
    function initializeComponentViews() {
      Nori.router().subscribe(function onRouteChange(payload) {
        handleRouteChange(payload.routeObj);
      });
    }

    /**
     * Typically on app startup, show the view assigned to the current URL hash
     */
    function showViewFromURLHash() {
      showRouteViewComponent(Nori.getCurrentRoute().route);
      Nori.router().notifySubscribers();
    }

    /**
     * Show route from URL hash on change
     * @param routeObj
     */
    function handleRouteChange(routeObj) {
      showRouteViewComponent(routeObj.route);
    }

    /**
     * Set the location for the view to append, any contents will be removed prior
     * @param elID
     */
    function setRouteViewMountPoint(elID) {
      _routeViewMountPoint = elID;
    }

    /**
     * Return the template object
     * @returns {*}
     */
    function getTemplate() {
      return _template;
    }

    /**
     * Map a route to a module view controller
     * @param templateID
     * @param componentModule
     * @param isRoute True | False
     */
    function mapViewComponent(templateID, componentModule, isRoute, mountPoint) {
      if (typeof componentModule === 'string') {
        componentModule = requireNew(componentModule);
      }

      _componentViewMap[templateID] = {
        htmlTemplate: _template.getTemplate(_componentHTMLTemplatePrefix + templateID),
        controller  : createComponentView(componentModule),
        isRouteView : isRoute,
        mountPoint  : isRoute ? _routeViewMountPoint : mountPoint
      };
    }

    /**
     * Factory to create component view modules
     * @param extras
     * @returns {*}
     */
    function createComponentView(extras) {
      return Nori.extendWithArray({}, [
        requireNew('nori/view/ViewComponent'),
        requireNew('nori/view/MixinEventDelegator'),
        extras
      ]);
    }

    /**
     * Map a route to a module view controller
     * @param templateID
     * @param controllerModule
     */
    function mapRouteToViewComponent(route, templateID, controllerModule) {
      _routeViewIDMap[route] = templateID;
      mapViewComponent(templateID, controllerModule, true, _routeViewMountPoint);
    }

    /**
     * Add a mixin for a mapped controller view
     * @param templateID
     * @param extras
     */
    function applyMixin(templateID, extras) {
      var componentView = _componentViewMap[templateID];

      if (!componentView) {
        throw new Error('No componentView mapped for id: ' + templateID);
      }

      componentView.controller = Nori.extendWithArray(componentView.controller, extras);
    }

    /**
     * Show a mapped componentView
     * @param templateID
     * @param dataObj
     */
    function showViewComponent(templateID) {
      var componentView = _componentViewMap[templateID];
      if (!componentView) {
        throw new Error('No componentView mapped for id: ' + templateID);
      }

      componentView.controller.initialize({
        id        : templateID,
        template  : componentView.htmlTemplate,
        mountPoint: componentView.mountPoint
      });

      componentView.controller.update();
      componentView.controller.render();
      componentView.controller.mount();
    }

    /**
     * Show a view (in response to a route change)
     * @param route
     */
    function showRouteViewComponent(route) {
      var routeTemplateID = _routeViewIDMap[route];
      if (!routeTemplateID) {
        console.log("No view mapped for route: " + route);
        return;
      }

      unmountCurrentRouteView();
      _currentRouteViewID = routeTemplateID;

      showViewComponent(_currentRouteViewID);

      TweenLite.set(_routeViewMountPoint, {alpha: 0});
      TweenLite.to(_routeViewMountPoint, 0.25, {alpha: 1, ease: Quad.easeIn});

      _noriEvents.viewChanged(_currentRouteViewID);
    }

    /**
     * Remove the currently displayed view
     */
    function unmountCurrentRouteView() {
      if (_currentRouteViewID) {
        _componentViewMap[_currentRouteViewID].controller.unmount();
      }
      _currentRouteViewID = '';
    }

    //----------------------------------------------------------------------------
    //  API
    //----------------------------------------------------------------------------

    module.exports.initializeComponentViews = initializeComponentViews;
    module.exports.showViewFromURLHash         = showViewFromURLHash;
    module.exports.setRouteViewMountPoint   = setRouteViewMountPoint;
    module.exports.template                 = getTemplate;
    module.exports.mapViewComponent         = mapViewComponent;
    module.exports.showViewComponent        = showViewComponent;
    module.exports.mapRouteToViewComponent  = mapRouteToViewComponent;
    module.exports.showRouteViewComponent   = showRouteViewComponent;
    module.exports.applyMixin               = applyMixin;
  });