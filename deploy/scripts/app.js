define('TT.LoadModelDataCommand',
  function (require, module, exports) {

    /**
     * Should inject some real data here
     * @param data
     */
    exports.execute = function(data) {
      console.log('TT Load model data, injecting data');

      TT.model().setData({});
    };

  });;define('TT.RouteChangedCommand',
  function (require, module, exports) {

    exports.execute = function(data) {
      console.log('RouteChangedCommand, route: '+data.route+', data: '+data.data);

      TT.view().updateOnRouteChange(data);
    };

  });;define('TT.RunApplicationCommand',
  function (require, module, exports) {

    exports.execute = function(data) {
      console.log('TT.RunApplicationCommand');

      var _appEvents = require('Nori.Events.AppEvents');

      // Browser events
      // unused mapEventCommand(_browserEvents.BROWSER_RESIZED, 'Nori.BrowserResizedCommand');
      // unused mapEventCommand(_browserEvents.BROWSER_SCROLLED, 'Nori.BrowserScrolledCommand');

      // App events
      // unused mapEventCommand(_appEvents.ROUTE_CHANGED, 'Nori.RouteChangedCommand');
      // unused mapEventCommand(_appEvents.VIEW_CHANGED, 'Nori.ViewChangedCommand');
      // unused mapEventCommand(_appEvents.VIEW_CHANGE_TO_MOBILE, 'Nori.ViewChangedToMobileCommand');
      // unused mapEventCommand(_appEvents.VIEW_CHANGE_TO_DESKTOP, 'Nori.ViewChangedToDesktopCommand');

      // Commands
      TT.mapEventCommand(_appEvents.ROUTE_CHANGED, 'TT.RouteChangedCommand');

      /*
       Map route args:
       url fragment for route, ID (template id), module name for controller, use singleton module
       */

      // Default route
      TT.mapRouteView('/', 'Timecard', 'TT.View.TemplateSubView');

      // Other routes
      TT.mapRouteView('/controls', 'ControlsTesting', 'TT.View.ControlsTestingSubView');
      TT.mapRouteView('/test', 'TestSubView', 'TT.View.TemplateSubView');
      TT.mapRouteView('/one', 'TestSubView1', 'TT.View.TemplateSubView');
      TT.mapRouteView('/two', 'TestSubView2', 'TT.View.TemplateSubView');
      TT.mapRouteView('/three', 'TestSubView3', 'TT.View.TemplateSubView');

      // Timecard mock
      TT.mapRouteView('/Forecast', 'Forecast', 'TT.View.TemplateSubView');
      TT.mapRouteView('/Assignments', 'Assignments', 'TT.View.TemplateSubView');
      TT.mapRouteView('/Timecard', 'Timecard', 'TT.View.TemplateSubView');

      TT.view().removeLoadingMessage();

      TT.setCurrentRoute(TT.router().getCurrentRoute());
    };

  });;define('TT.Model.FakeData',

  function(require, module, exports) {
    "use strict";

    var _id = 1,
      _people= [],
      _projects = [],
      _assignments = [],
      _possibleContributors = [],
      _possibleLobs = ['Information Technology', 'Asset Management', 'Human Resources', 'Institutional', 'A&O', 'Client Services', 'Finance', 'Internal Audit', 'Marketing', 'Risk Management'],
      _items = [],
      _lorem = require('nudoru.utils.NLorem'),
      _arrayUtils = require('nudoru.utils.ArrayUtils'),
      _stringUtils = require('nudoru.utils.StringUtils'),
      _numberUtils = require('nudoru.utils.NumberUtils');

    function getPeople() {
      return _people;
    }

    function getProjects() {
      return _projects;
    }

    function getAssignments() {
      return _assignments;
    }

    function initialize() {

      _lorem.initialize();

      var numPeople = 60,
          numProjects = 400,
          numAssignments = 1000;

      for(var i = 0; i<numPeople; i++) {
        _people.push(createPerson());
      }

      for(var i = 0; i<numProjects; i++) {
        _projects.push(createProject());
      }

      for(var i = 0; i<numAssignments; i++) {
        _assignments.push(createAssignment());
      }

    }

    function createPerson() {
      return {
        id: '',
        name: '',
        manager: '',
        type: '',
        team: '',
        brlTeamManager: '',
        brlSrLeader: '',
        jobTitle: '',
        primaryRole: '',
        secondaryRole: '',
        active: '',
        inActiveDate: '',
        keySkills: '',
        comments: '',
        photoURL: ''
      };
    }

    function createProject() {
      return {
        id: '',
        title: '',
        description: '',
        status: '',
        workType: '',
        requester: '',
        audience: '',
        audienceSize: '',
        projectLead: '',
        startDate: '',
        endDate: '',
        deploymentDate: '',
        finishDate: '',
        comments: '',
        teamLeading: ''
      };

    }

    function createAssignment() {
      return {
        id: '',
        resourceName: '',
        startDate: '',
        endDate: '',
        role: '',
        allocation: '',
        comments: '',
        timeData: '',
        allocationData: ''
      };
    }

    function getParas(max) {
      var description = '',
        descriptionNumParas = _numberUtils.rndNumber(1, max),
        i = 0;

      for (; i < descriptionNumParas; i++) {
        description += '<p>' + _lorem.getParagraph(3, 7) + '</p>';
      }
    }

    /*
    function createItem() {
      var o = Object.create(APP.AppModel.ItemVO.properties),
        additionalImages = [],
        additionalNumImages = _numberUtils.rndNumber(1, 10),
        description = '',
        descriptionNumParas = _numberUtils.rndNumber(1, 5),
        i = 0;

      for (; i < descriptionNumParas; i++) {
        description += '<p>' + _lorem.getParagraph(3, 7) + '</p>';
      }

      for (i = 0; i < additionalNumImages; i++) {
        additionalImages.push('img/' + _arrayUtils.rndElement(_possiblePreviewImages));
      }

      o.title = _stringUtils.capitalizeFirstLetter(_lorem.getText(3, 10));
      o.shortTitle = o.title.substr(0, 10) + '...';
      o.description = description;
      o.images = additionalImages;
      o.previewImage = additionalImages[0];
      o.id = '' + _id++;
      o.dateStarted = 'January 1, 2010';
      o.dateCompleted = 'December 31, 2014';
      o.quarter = 'Q' + _numberUtils.rndNumber(1, 4).toString();
      o.duration = _numberUtils.rndNumber(1, 5).toString() + ' hour(s)';
      o.contributors = _arrayUtils.getRandomSetOfElements(_possibleContributors, 5);
      o.categories = _arrayUtils.getRandomSetOfElements(_possibleCategories, 1);
      o.types = _arrayUtils.getRandomSetOfElements(_possibleTypes, 3);
      o.companyArea = _arrayUtils.rndElement(_possibleLobs);
      o.complexity = _arrayUtils.rndElement(_possibleComplexity);
      o.links = _arrayUtils.getRandomSetOfElements(_possibleLinks, 5);
      o.tags = _arrayUtils.getRandomSetOfElements(_possibleTags, 3);
      return o;
    }
    */

    exports.initialize = initialize;
    exports.getPeople = getPeople;
    exports.getProjects = getProjects;
    exports.getAssignments = getAssignments;

  });;define('TT.TimeTrackerAppModel',
  function (require, module, exports) {

    function initialize() {
      this._super.initialize();
    }

    exports.initialize = initialize;

  });;define('TT.View.ControlsTestingSubView',
  function (require, module, exports) {

    var _lIpsum = require('nudoru.utils.NLorem'),
      _toolTip = require('nudoru.components.ToolTipView'),
      _emitter = require('nudoru.events.Emitter'),
      _appEvents = require('Nori.Events.AppEvents'),
      _actionOneEl,
      _actionTwoEl,
      _actionThreeEl,
      _actionFourEl,
      _actionFiveEl,
      _actionSixEl;

    function initialize(initObj) {
      _lIpsum.initialize();

      this._super.initialize(initObj);
    }


    function viewDidMount() {
      console.log(this.getID() + ', subview did mount');

      _actionOneEl = document.getElementById('action-one');
      _actionTwoEl = document.getElementById('action-two');
      _actionThreeEl = document.getElementById('action-three');
      _actionFourEl = document.getElementById('action-four');
      _actionFiveEl = document.getElementById('action-five');
      _actionSixEl = document.getElementById('action-six');

      //_toolTip.add({title:'', content:"This is a button, it's purpose is unknown.", position:'TR', targetEl: _actionFourEl, type:'information'});
      //_toolTip.add({title:'', content:"This is a button, click it and rainbows will appear.", position:'BR', targetEl: _actionFourEl, type:'success'});
      //_toolTip.add({title:'', content:"This is a button, it doesn't make a sound.", position:'BL', targetEl: _actionFourEl, type:'warning'});
      //_toolTip.add({title:'', content:"This is a button, behold the magic and mystery.", position:'TL', targetEl: _actionFourEl, type:'danger'});

      _toolTip.add({title:'', content:"This is a button, you click it dummy. This is a button, you click it dummy. ", position:'L', targetEl: _actionFourEl, type:'information'});
      _toolTip.add({title:'', content:"This is a button, you click it dummy. This is a button, you click it dummy. ", position:'B', targetEl: _actionFourEl, type:'information'});
      _toolTip.add({title:'', content:"This is a button, you click it dummy. This is a button, you click it dummy. This is a button, you click it dummy. ", position:'R', targetEl: _actionFourEl, type:'information'});
      _toolTip.add({title:'', content:"This is a button, you click it dummy. This is a button, you click it dummy. This is a button, you click it dummy. This is a button, you click it dummy. ", position:'T', targetEl: _actionFourEl, type:'information'});


      _actionOneEl.addEventListener('click', function actOne(e) {
        Nori.view().addMessageBox({
          title: _lIpsum.getSentence(2,4),
          content: _lIpsum.getParagraph(2, 4),
          type: 'warning',
          modal: true,
          width: 500
        });
      });

      _actionTwoEl.addEventListener('click', function actTwo(e) {
        Nori.view().addMessageBox({
          title: _lIpsum.getSentence(10,20),
          content: _lIpsum.getParagraph(2, 4),
          type: 'default',
          modal: false,
          buttons: [
            {
              label: 'Yes',
              id: 'yes',
              type: 'default',
              icon: 'check',
              onClick: function() {
                console.log('yes');
              }
            },
            {
              label: 'Maybe',
              id: 'maybe',
              type: 'positive',
              icon:'cog',
              onClick: function() {
                console.log('maybe');
              }
            },
            {
              label: 'Nope',
              id: 'nope',
              type: 'negative',
              icon: 'times'
            }
          ]
        });
      });

      _actionThreeEl.addEventListener('click', function actThree(e) {
        Nori.view().addNotification({
          title: _lIpsum.getSentence(3,6),
          type: 'information',
          content: _lIpsum.getParagraph(1, 2)
        });

        _toolTip.remove(_actionFourEl);
      });

      _actionFourEl.addEventListener('click', function actFour(e) {
        console.log('Four');
      });

      _actionFiveEl.addEventListener('click', function actFour(e) {
        _emitter.publish(_appEvents.CHANGE_ROUTE, {route: '/one',data: {prop:'some data',moar:'25'}});
      });

      _actionSixEl.addEventListener('click', function actFour(e) {
        _emitter.publish(_appEvents.CHANGE_ROUTE, {route: '/two'});
      });

    }

    exports.initialize = initialize;
    exports.viewDidMount = viewDidMount;

  });;define('TT.ModuleNavView',
  function (require, module, exports) {

    var _buttonMap = Object.create(null),
      _browserInfo = require('nudoru.utils.BrowserInfo'),
      _appEvents = require('Nori.Events.AppEvents'),
      _domUtils = require('nudoru.utils.DOMUtils'),
      _emitter = require('nudoru.events.Emitter');

    function initialize() {
      mapButton('btn_assignments', '/Assignments');
      mapButton('btn_timecard', '/Timecard');
      mapButton('btn_forecast', '/Forecast');
    }

    /**
     * Set up data for a button
     * @param elID
     * @param route
     */
    function mapButton(elID, route) {
      var buttonEl = document.getElementById(elID),
        liEl =buttonEl.parentNode;

      _buttonMap[elID] = {
        buttonEl: buttonEl,
        liEl: liEl,
        route: route,
        clickStream: Rx.Observable.fromEvent(buttonEl, _browserInfo.mouseClickEvtStr())
          .subscribe(function () {
            handleButton(elID)
          })
      };
    }

    /**
     * Change the appliation route when a button is pressed
     * @param id
     */
    function handleButton(id) {
      _emitter.publish(_appEvents.CHANGE_ROUTE, {route: _buttonMap[id].route});
    }

    /**
     * Highlight a button in response to a view change
     * @param route
     */
    function highlightModule(route) {
      for (var p in _buttonMap) {
        var btn = _buttonMap[p];
        if (btn.route === route) {
          _domUtils.addClass(btn.liEl, 'active');
        } else {
          _domUtils.removeClass(btn.liEl, 'active');
        }
      }
    }

    exports.initialize = initialize;
    exports.highlightModule = highlightModule;

  });;define('TT.View.TemplateSubView',
  function (require, module, exports) {



  });;define('TT.TimeTrackerAppView',
  function (require, module, exports) {

    var _moduleNavView = require('TT.ModuleNavView');

    function initialize() {
      this._super.initialize();

      _moduleNavView.initialize();
    }

    /**
     * Update the UI or components when the route/subview has changed
     * @param newRoute
     */
    function updateOnRouteChange(newRoute) {
      _moduleNavView.highlightModule(newRoute.route);
    }

    exports.initialize = initialize;
    exports.updateOnRouteChange = updateOnRouteChange;

  });;(function () {

  var _browserInfo = require('nudoru.utils.BrowserInfo');

  if(_browserInfo.notSupported) {
    alert("Your browser is not supported! Please use IE 9+, Firefox, Chrome or Safari.");
  }

  // Initialize the window
  window.onload = function() {

    var _appEvents = require('Nori.Events.AppEvents'),
      _model, _view;

    // Create the application instance
    window.TT = Nori.create();

    // Load and set model data in this command
    TT.mapEventCommand(_appEvents.MODEL_DATA_WAITING, 'TT.LoadModelDataCommand', true);
    // Map view routes and other app initialization here
    TT.mapEventCommand(_appEvents.APP_INITIALIZED, 'TT.RunApplicationCommand', true);

    // Create the model
    _model = Nori.extend(require('TT.TimeTrackerAppModel'), require('Nori.Model'));
    // Create the view
    _view = Nori.extend(require('TT.TimeTrackerAppView'), require('Nori.View'));

    /*
     * Initialize the application by injecting the model and view
     * After the application is initialized (view and model data loaded), the
     * _appEvents.APP_INITIALIZED event is emitted and the mapped command runs.
     * Typically, app/commands/TT.RunApplicationCommand
     */
    TT.initialize(_model, _view);
  }

}());