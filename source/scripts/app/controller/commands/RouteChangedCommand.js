define('APP.RouteChangedCommand',
  function (require, module, exports) {

    exports.execute = function(data) {
      console.log('RouteChangedCommand, route: '+data.route+', templateID: '+data.templateID);
      APP.view().showView(data);
    };

  });