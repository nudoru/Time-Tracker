define('tt/view/UserProfilePanelView',
  function (require, module, exports) {

    var _currentUserModel;

    function initialize(initObj) {
      if (!this.isInitialized()) {
        _currentUserModel = TT.model().getCurrentUserModel();
        this.initializeComponent(initObj);
      }
    }

    function viewWillUpdate() {
      this.setState({
        userName: _currentUserModel.get('name')
      });
    }

    module.exports.initialize     = initialize;
    module.exports.viewWillUpdate = viewWillUpdate;
  });