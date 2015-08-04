/**
 * Must be extended from Nori.View module
 *
 * this._super refers to Nori.View
 */

define('TT.View.TimeTrackerAppView',
  function (require, module, exports) {

    var _this,
        _helpView              = require('Nudoru.Component.CoachMarksView'),
        _moduleNavView         = require('TT.View.ModuleNavView'),
        _appEvents             = require('Nori.Events.AppEventCreator'),
        _dispatcher            = require('Nori.Utils.Dispatcher'),
        _appEventConstants     = require('Nori.Events.AppEventConstants');

    function initialize() {
      _this = this;
      _this.initializeApplicationView();
      _this.setRouteViewMountPoint('#contents');

      mapRoutes();

      _this.createComponent('UserProfilePanel', 'TT.View.UserProfilePanelView', '#userprofilepanel');

      configureUIEvents();
      configureHelpCoachmarks();

      _helpView.initialize('coachmarks__container');
      _moduleNavView.initialize();

      configureApplicationViewEvents();

      _appEvents.applicationViewInitialized();
    }

    /**
     * Set up the view to routes
     */
    function mapRoutes() {
      TT.mapRouteView('/', 'Timecard', 'TT.View.TimeCardView');
      TT.mapRouteView('/Assignments', 'Assignments', 'TT.View.AssignmentsView');
      TT.mapRouteView('/Forecast', 'Forecast', 'TT.View.CapacityForecastView');

      // Decorate the base subview modules with additional common functionality
      ['Assignments','Timecard','Forecast'].forEach(function decorate(moduleID) {
        _this.extendSubViewController(moduleID, [requireNew('TT.View.ModuleCommon')]);
      });
    }

    function render() {
      _this.renderComponent('UserProfilePanel');
    }

    function configureUIEvents() {
      _this.setEvents({
        'click #btn_main_projects': handleProjectsButton,
        'click #btn_main_people'  : handlePeopleButton,
        'click #btn_main_help'    : handleHelpButton
      });
      _this.delegateEvents();
    }

    function configureApplicationViewEvents() {
      _dispatcher.subscribe(_appEventConstants.NOTIFY_USER, function onNotifyUser(payload) {
        this.notify(payload.payload.message, payload.payload.title, payload.payload.type);
      }, _this);

      _dispatcher.subscribe(_appEventConstants.ALERT_USER, function onAlertuser(payload) {
        this.alert(payload.payload.message, payload.payload.title);
      }, _this);
    }

    function handleProjectsButton() {
      _this.addMessageBox({
        title  : 'Projects',
        content: 'This feature is still in development!',
        type   : 'default',
        modal  : true,
        width  : 350
      });
    }

    function handlePeopleButton() {
      _this.addMessageBox({
        title  : 'People',
        content: 'This feature is still in development!',
        type   : 'default',
        modal  : true,
        width  : 350
      });
    }

    function handleHelpButton() {
      _helpView.show();
    }

    /**
     * Configure the coach marks help
     */
    function configureHelpCoachmarks() {
      _helpView.outlineElement('#module_navigation', {
        shape        : 'rect',
        label        : 'Access different module of the application: Adding and removing projects, entering time weekly and viewing your capacity (coming soon). ',
        labelWidth   : 200,
        labelPosition: 'R'
      });
      _helpView.outlineElement('#userprofilepanel', {
        shape        : 'rect',
        label        : 'Information about you.',
        labelPosition: 'B'
      });
      _helpView.outlineElement('#contents', {
        shape        : 'rect',
        label        : 'Different application modules will appear here.',
        labelPosition: 'B',
        height       : 200
      });
      _helpView.outlineElement('#main_navigation', {
        shape        : 'rect',
        label        : 'Access the master projects and people SharePoint lists.',
        labelPosition: 'B'
      });
    }

    exports.initialize          = initialize;
    exports.render              = render;
  });