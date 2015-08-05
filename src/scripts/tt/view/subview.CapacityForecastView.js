define('TT.View.CapacityForecastView',
  function (require, module, exports) {

    function initialize(initObj) {
      if(!this.isInitialized()) {
        this.initializeSubView(initObj);
      }
    }

    function viewWillUpdate() {
      this.updateStateFromProjectsModel();
    }

    function viewDidMount() {
      this.showAlert('Capacity Forecast functionality is coming later in the year.');
    }

    function viewWillUnmount() {
      this.closeAllAlerts();
    }

    module.exports.initialize = initialize;
    module.exports.viewWillUpdate = viewWillUpdate;
    module.exports.viewDidMount = viewDidMount;
    module.exports.viewWillUnmount = viewWillUnmount;

  });