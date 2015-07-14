/**
 * Provides a connection to a SP Site 2013 and List
 * Refer to this Gist
 * https://gist.github.com/nudoru/b3d85a1bb15fba9e73e2
 *
 * https://msdn.microsoft.com/library/jj163201.aspx#BasicOps_SPWebTasks
 */

define('Nudoru.Services.SharePointConnect',
  function (require, module, exports) {

    var _debug = true;

    exports.connect = function (cb) {
      if(_debug) console.log('SharePoint > connect');
      cb();
    };

    exports.getCurrentUser = function (cb) {
      if(_debug) console.log('SharePoint > getcurrentuser');
      cb();
    };

    exports.getListItemsFromView = function (list, view, cb) {
      if(_debug) console.log('SharePoint > getListItemsFromView', list, view);
      cb();
    };

    exports.updateListItem = function (list, dataObj, cb) {
      if(_debug) console.log('SharePoint > updateListItem', list, dataObj, value);
      cb();
    };

    exports.addListField = function (list, dataObj, cb) {
      if(_debug) console.log('SharePoint > addListField', list, dataObj);
      cb();
    };

    exports.addListItem = function (list, dataObj, cb) {
      if(_debug) console.log('SharePoint > addListItem', list, dataObj);
      cb();
    };

    exports.deleteListItem = function (list, dataObj, cb) {
      if(_debug) console.log('SharePoint > deleteListItem', list, dataObj);
      cb();
    };

  });