define('TT.TimeTrackerApplication',
  function (require, module, exports) {

    var _this,
        _appEventConstants = require('Nori.Events.NoriEventConstants'),
        _dispatcher        = require('Nori.Utils.Dispatcher');

    function initialize() {
      _this = this;

      _dispatcher.subscribe(_appEventConstants.APP_MODEL_INITIALIZED, onModelInitialized.bind(this), true);

      this.initializeApplication({
        model: this.createApplicationModel(require('TT.Model.TimeTrackerAppModel')),
        view : this.createApplicationView(require('TT.View.TimeTrackerAppView'))
      });

      this.view().initialize();
      this.model().initialize();
    }

    /**
     * When model data has been loaded
     */
    function onModelInitialized() {
      this.view().removeLoadingMessage();
      this.view().render();
      this.setCurrentRoute(TT.router().getCurrentRoute());
    }

    //----------------------------------------------------------------------------
    //  Controller functions
    //----------------------------------------------------------------------------


    //----------------------------------------------------------------------------
    //  API
    //----------------------------------------------------------------------------

    module.exports.initialize = initialize;

  });