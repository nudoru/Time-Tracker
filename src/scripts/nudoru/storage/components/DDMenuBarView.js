/**
 * Created by matt on 1/15/15
 */


define('nudoru/component/DDMenuBarView',
  function (require, module, exports) {

    var _mountPoint = null,
      _barEl = null,
      _data = null,
      _children = [],
      _isKeepOpen = false,
      _DOMUtils = require('nudoru/browser/DOMUtils'),
      _browserInfo = require('nudoru/browser/BrowserInfo');

    function initialize(elID, idata, keep) {
      _mountPoint = document.getElementById(elID);
      _data = idata;

      _isKeepOpen = keep ? true : false;

      render();
    }

    function render() {
      var i = 0,
        len = _data.length;

      _barEl = _DOMUtils.HTMLStrToNode('<ul></ul>');
      for (; i < len; i++) {
        var menuobj = requireNew('nudoru/component/DDMenuView');
        menuobj.initialize(_data[i], _isKeepOpen);

        _barEl.appendChild(menuobj.getElement());
        _children.push(menuobj);
      }

      _mountPoint.insertBefore(_barEl, _mountPoint.firstChild);

      // hack to prevent clicking on menuItems from selecting text on ie since CSS isn't supported
      if (_browserInfo.isIE) {
        _mountPoint.onselectstart = function () {
          return false;
        };
      }

    }

    function resetAllSelections() {
      _children.forEach(function (menu) {
        menu.deselectAllItems();
      });
    }

    function setMenuSelections(data) {
      _children.forEach(function (menu) {
        menu.setSelections(data);
      });
    }

    module.exports.initialize = initialize;
    module.exports.resetAllSelections = resetAllSelections;
    module.exports.setMenuSelections = setMenuSelections;

  });