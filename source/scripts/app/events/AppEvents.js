define('APP.AppEvents',
  function (require, module, exports) {
    exports.APP_INITIALIZED = 'APP_INITIALIZED';
    exports.MODEL_DATA_WAITING = 'MODEL_DATA_WAITING';
    exports.MODEL_DATA_READY = 'MODEL_DATA_READY';
    exports.RESUME_FROM_MODEL_STATE = 'RESUME_FROM_MODEL_STATE';
    exports.VIEW_INITIALIZED = 'VIEW_INITIALIZED';
    exports.VIEW_RENDERED = 'VIEW_RENDERED';
    exports.VIEW_CHANGED = 'VIEW_CHANGED';
    exports.VIEW_CHANGE_TO_MOBILE = 'VIEW_CHANGE_TO_MOBILE';
    exports.VIEW_CHANGE_TO_DESKTOP = 'VIEW_CHANGE_TO_DESKTOP';
    exports.ROUTE_CHANGED = 'ROUTE_CHANGED';
    exports.CHANGE_ROUTE = 'CHANGE_ROUTE';
    exports.SUBVIEW_STORE_DATA = 'SUBVIEW_STORE_DATA';
  });