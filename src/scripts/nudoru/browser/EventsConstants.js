define('nudoru/browser/EventConstants',
  function (require, module, exports) {

    var objUtils = require('nudoru/core/ObjectUtils');

    _.merge(module.exports, objUtils.keyMirror({
      URL_HASH_CHANGED: null,
      BROWSER_RESIZED : null,
      BROWSER_SCROLLED: null
    }));

  });