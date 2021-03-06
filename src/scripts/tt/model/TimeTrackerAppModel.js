define('tt/model/TimeTrackerAppModel',
  function (require, module, exports) {

    var _this,
        _peopleSourceData,
        _projectsSourceData,
        _assignmentsSourceData,
        _peopleCollection,
        _projectsCollection,
        _assignmentsCollection,
        _currentUserMap,
        _timeModel,
        _dataCreator      = require('tt/model/MockDataCreator'),
        _appEvents        = require('nori/events/EventCreator'),
        _dispatcher       = require('nori/utils/Dispatcher'),
        _ttEventConstants = require('tt/events/EventConstants');

    //----------------------------------------------------------------------------
    //  Accessors
    //----------------------------------------------------------------------------

    function getCurrentUserModel() {
      return _currentUserMap;
    }

    function getAssignmentsModel() {
      return _assignmentsCollection;
    }

    function getTimeModel() {
      return _timeModel;
    }

    function getTimeModelObj() {
      return {
        currentWeek: _timeModel.getCurrentWeek(),
        currentYear: _timeModel.getCurrentYear(),
        date       : _timeModel.getDateString(),
        prettyDate : _timeModel.getPrettyDateString()
      };
    }

    function getNow() {
      return _timeModel.now();
    }

    function getPrettyNow() {
      return _timeModel.prettyNow();
    }

    //----------------------------------------------------------------------------
    //
    //----------------------------------------------------------------------------

    function initialize() {
      _this = this;

      _timeModel = _.assign({},require('tt/model/TimeModel'), requireNew('nori/model/MixinObservableModel'));
      _timeModel.initialize();

      createDataCollections();

      _dispatcher.subscribe(_ttEventConstants.ADD_ASSIGNMENT, handleAddAssignment);
      _dispatcher.subscribe(_ttEventConstants.ARCHIVE_ASSIGNMENT, handleArchiveAssignment);
      _dispatcher.subscribe(_ttEventConstants.UPDATE_ASSIGNMENTS, handleUpdateAssignments);
      _dispatcher.subscribe(_ttEventConstants.SUBMIT_TIMECARD, handleSubmitTimeCard);
      _dispatcher.subscribe(_ttEventConstants.UNLOCK_TIMECARD, handleUnlockTimeCard);
      _dispatcher.subscribe(_ttEventConstants.UPDATE_TIMECARD, handleUpdateTimeCard);
      _dispatcher.subscribe(_ttEventConstants.TIMECARD_WEEKFORWARD, handleWeekForward);
      _dispatcher.subscribe(_ttEventConstants.TIMECARD_WEEKBACKWARD, handleWeekBackward);

      publishUpdateNotification('Mock data created successfully');

      _appEvents.applicationModelInitialized();
    }

    function publishUpdateNotification(message) {
      //_appEvents.notifyUser('Model', message);
      console.log('Model: ' + message);
    }

    //----------------------------------------------------------------------------
    //  Handle Events
    //----------------------------------------------------------------------------

    /**
     * The model data was changed
     * @param dataObj
     */
    function handleModelDataChanged(dataObj) {
      //console.log('handleModelDataChanged', dataObj.payload);
    }

    /**
     * Execute and action to change the model data
     * @param dataObj
     */
    function handleUpdateModelData(dataObj) {
      //console.log('handleUpdateModelData', dataObj.payload);
    }

    //----------------------------------------------------------------------------
    //  Handle Application Events
    //----------------------------------------------------------------------------

    function handleAddAssignment(dataObj) {
      addAssignmentForCurrentUser(dataObj.payload.projectID);
    }


    function handleArchiveAssignment(dataObj) {
      archiveAssignmentForCurrentUser(dataObj.payload.assignmentID);
    }

    function handleUpdateAssignments(dataObj) {
      updateAssignmentDataFromForm(dataObj.payload.data.form);
    }

    function handleSubmitTimeCard(dataObj) {
      submitCurrentTimeCard();
    }

    function handleUnlockTimeCard(dataObj) {
      unlockCurrentTimeCard(dataObj.payload.comments);
    }

    function handleUpdateTimeCard(dataObj) {
      updateTimeCardDataFromForm(dataObj.payload.data.form);
    }

    function handleWeekForward(dataObj) {
      _timeModel.forwardWeek();
    }

    function handleWeekBackward(dataObj) {
      _timeModel.backwardWeek();
    }

    //----------------------------------------------------------------------------
    //  Data Handling
    //----------------------------------------------------------------------------

    /**
     * Create model data
     */
    function createDataCollections() {
      _dataCreator.initialize();

      _peopleSourceData      = JSON.parse(getLocalStorageObject('mockTTData.people'));
      _projectsSourceData    = JSON.parse(getLocalStorageObject('mockTTData.projects'));
      _assignmentsSourceData = JSON.parse(getLocalStorageObject('mockTTData.assignments'));

      _peopleCollection      = _this.createMapCollection({id: 'peopleCollection'});
      _projectsCollection    = _this.createMapCollection({id: 'projectsCollection'});
      _assignmentsCollection = _this.createMapCollection({id: 'assignmentsCollection'});

      _peopleCollection.addFromObjArray(_peopleSourceData, 'id', false);
      _projectsCollection.addFromObjArray(_projectsSourceData, 'id', false);
      _assignmentsCollection.addFromObjArray(_assignmentsSourceData, 'id', false);

      _currentUserMap = getCurrentUserMap();
    }

    /**
     * Determine the current user properties
     */
    function getCurrentUserMap() {
      // Mock - just pull the first user
      return _peopleCollection.first();
    }

    //----------------------------------------------------------------------------
    //  Assignments
    //----------------------------------------------------------------------------

    /**
     * For a given user, return an array of assignment maps
     * @param user
     * @returns {*|Array.<T>}
     */
    function getAssignmentsForUser(user) {
      return _assignmentsCollection.filterByKey('resourceName', user);
    }

    /**
     * For a given user name, return an array of assignment ID's that person has
     * @param user
     * @returns {Array}
     */
    function getAssignmentsIDArrayForUser(user) {
      return getAssignmentsForUser(user).map(function (assignment) {
        return assignment.get('id');
      });
    }

    /**
     * Returns an array of assignment maps for the current user
     * @returns {*|Array.<T>}
     */
    function getAssignmentsForCurrentUser() {
      return getAssignmentsForUser(_currentUserMap.get('name'));
    }

    /**
     * Used by Assignments view add assignment popup. Format
     * [{value:'data1',selected:'false',label:'Data 1'}, ...]
     */
    function getProjectsAndIDList() {
      var arry = [];

      _projectsCollection.forEach(function (map) {
        arry.push({
          value   : map.get('id'),
          label   : map.get('title'),
          selected: 'false'
        });
      });

      return arry;
    }

    /**
     * Used by Assignments view add assignment popup. Format
     * [{value:'data1',selected:'false',label:'Data 1'}, ...]
     */
    function getNonAssignedProjectsAndIDList() {
      return getProjectsAndIDList().filter(function (project) {
        return !hasActiveAssignmentProjectID(project.value);
      });
    }

    /**
     * Retrieve the project matching the ID
     * @param id
     * @returns {*|void|*|T}
     */
    function getAssignmentMapForID(id) {
      return _assignmentsCollection.getMap(id);
    }

    /**
     * Returns the assignment for the given project ID
     * @param projectID
     * @returns {T}
     */
    function getAssignmentMapForProjectID(projectID) {
      return getAssignmentsForCurrentUser().filter(function (map) {
        return projectID === map.get('projectID');
      })[0];
    }

    /**
     * Return true if a project with ID exists as an assignment already
     * @param projectID
     * @returns {*}
     */
    function hasActiveAssignmentProjectID(projectID) {
      return getAssignmentsForCurrentUser().filter(function (map) {
        return map.get('active') === true && projectID === map.get('projectID');
      }).length;
    }

    /**
     * Return true if a project with ID exists as an assignment already
     * @param projectID
     * @returns {*}
     */
    function hasInactiveAssignmentProjectID(projectID) {
      return getAssignmentsForCurrentUser().filter(function (map) {
        return map.get('active') === false && projectID === map.get('projectID');
      }).length;
    }

    /**
     * Update assignment data
     * @param id
     */
    function updateAssignmentData(id, data) {
      getAssignmentMapForID(id).set({
        'startDate' : data.startDate,
        'endDate'   : data.endDate,
        'role'      : data.primaryRole,
        'allocation': data.allocation
      });
    }

    /**
     * Adds an assignment to the active list
     * Either reactive an archived project or create a new assignment and add it
     * @param projectID
     */
    function addAssignmentForCurrentUser(projectID) {
      if (hasActiveAssignmentProjectID(projectID)) {
        console.log('A project with id ' + projectID + ' already exists as an active assignment');
        return;
      }

      if (hasInactiveAssignmentProjectID(projectID)) {
        getAssignmentMapForProjectID(projectID).set({active: true});
        publishUpdateNotification('Project successfully unarchived.');
      } else {
        var project    = _projectsCollection.getMap(projectID).toObject(),
            person     = _currentUserMap.toObject(),
            assignment = _dataCreator.createAssignment(person, project);

        _assignmentsCollection.addFromObjArray([assignment], 'id', false);
        publishUpdateNotification('Project successfully added to assignments.');
      }
    }

    /**
     * Set and assignment to inactive
     * @param assignmentID
     */
    function archiveAssignmentForCurrentUser(assignmentID) {
      _assignmentsCollection.getMap(assignmentID).set({active: false});
      publishUpdateNotification('Project successfully archived.');
    }

    /**
     * Form has one key, assignment id, and value is object with keys: allocation, endDate, primaryCole, startDate
     * @param dataObj
     */
    function updateAssignmentDataFromForm(formObj) {
      formObj.forEach(function (dataRow) {
        var assignmentID = Object.keys(dataRow)[0];
        updateAssignmentData(assignmentID, dataRow[assignmentID]);
      });

      publishUpdateNotification('Assignments updated successfully.');
    }

    //----------------------------------------------------------------------------
    //  Time Card
    //----------------------------------------------------------------------------

    /**
     * Update assignment timecard data. Data added to the 'timeCardData' key as
     * a new key/value '2015_29':form_data
     * @param id
     */
    // TODO set it as JSON data?
    function updateAssignmentTimeCardData(id, data) {
      getAssignmentMapForID(id).setKeyProp('timeCardData', getTimeModelObj().date, data);
    }

    /**
     * Look at the week's history and test if the last submit entry was a lock or unlock
     * @returns {boolean}
     */
    function isCurrentWeekTimeCardLocked() {
      var currentWeek = _currentUserMap.getKeyProp('timeCardHistory', getTimeModelObj().date),
          lastSubmit  = _.last(currentWeek),
          isSubmitted = false;

      for(var ts in lastSubmit) {
        if(lastSubmit.hasOwnProperty(ts)) {
          isSubmitted = lastSubmit[ts].submitted;
        }
      }

      return isSubmitted;
    }

    function getCurrentTimeCardSubmitMetaData() {
      var obj = {};
      if (isCurrentWeekTimeCardLocked()) {
        obj = _.merge({}, _currentUserMap.getKeyProp('timeCardHistory', getTimeModelObj().date));
      }
      return obj;
    }

    function updateTimeCardDataFromForm(formObj) {
      formObj.forEach(function (dataRow) {
        var assignmentID = Object.keys(dataRow)[0];
        updateAssignmentTimeCardData(assignmentID, dataRow[assignmentID]);
      });

      publishUpdateNotification('Time card updated successfully.');
    }

    function submitCurrentTimeCard() {
      var submitObj                        = Object.create(null);
      submitObj[_timeModel.getTimeStamp()] = {
        submitted: true,
        comment  : ''
      };

      pushToTimeCardHistory(submitObj);
      publishUpdateNotification('Time card submitted successfully ');
    }

    function unlockCurrentTimeCard(comments) {
      var submitObj                        = Object.create(null);
      submitObj[_timeModel.getTimeStamp()] = {
        submitted: false,
        comment  : comments
      };

      pushToTimeCardHistory(submitObj);
      publishUpdateNotification('Time card unlocked successfully ');
    }

    /* Sample history data
     {"2015_32":[{"8-4-15,5:31:11,pm":{"submitted":true,"comment":""}},{"8-4-15,5:31:23,pm":{"submitted":false,"comment":"becasuse"}},{"8-4-15,5:31:51,pm":{"submitted":true,"comment":""}}],"2015_31":[{"8-4-15,5:31:30,pm":{"submitted":true,"comment":""}},{"8-4-15,5:31:43,pm":{"submitted":false,"comment":"fff"}},{"8-4-15,5:31:45,pm":{"submitted":true,"comment":""}}]}
     */

    /**
     * Add a new submit/unlock event entry to the week's data
     * @param obj
     */
    function pushToTimeCardHistory(obj) {
      var currentHistory = _currentUserMap.getKeyProp('timeCardHistory', getTimeModelObj().date);

      if (!currentHistory) {
        console.log('no history for this date!');
        currentHistory = [];
      }

      currentHistory.push(obj);
      _currentUserMap.setKeyProp('timeCardHistory', getTimeModelObj().date, currentHistory);
      console.log(JSON.stringify(_currentUserMap.get('timeCardHistory')));
    }


    //----------------------------------------------------------------------------
    //  Utility
    //----------------------------------------------------------------------------

    /**
     * Utility function
     * @param obj
     * @returns {*}
     */
    function getLocalStorageObject(obj) {
      return localStorage[obj];
    }

    //----------------------------------------------------------------------------
    //  API
    //----------------------------------------------------------------------------

    module.exports.initialize                       = initialize;
    module.exports.getCurrentUserModel              = getCurrentUserModel;
    module.exports.getAssignmentsModel              = getAssignmentsModel;
    module.exports.getTimeModel                     = getTimeModel;
    module.exports.getTimeModelObj                  = getTimeModelObj;
    module.exports.getNow                           = getNow;
    module.exports.handleModelDataChanged           = handleModelDataChanged;
    module.exports.handleUpdateModelData            = handleUpdateModelData;
    module.exports.getProjectsAndIDList             = getProjectsAndIDList;
    module.exports.getNonAssignedProjectsAndIDList  = getNonAssignedProjectsAndIDList;
    module.exports.getAssignmentMapForID            = getAssignmentMapForID;
    module.exports.getAssignmentsForCurrentUser     = getAssignmentsForCurrentUser;
    module.exports.isCurrentWeekTimeCardLocked      = isCurrentWeekTimeCardLocked;
    module.exports.getCurrentTimeCardSubmitMetaData = getCurrentTimeCardSubmitMetaData;
  });
