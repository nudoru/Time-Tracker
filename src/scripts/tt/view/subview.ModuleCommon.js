/**
 * This module defines common functionality that Assignments, Time Card and
 * Capacity Forecast share
 */

define('tt/view/ModuleCommon',
  function (require, module, exports) {

    var _messageBoxIDs  = [],
        _assignmentRows = [],
        _domUtils       = require('nudoru/browser/DOMUtils'),
        _toolTip        = require('nudoru/component/ToolTipView');

    function initializeCommon() {
      // nothing
    }

    //----------------------------------------------------------------------------
    //  Model
    //----------------------------------------------------------------------------

    /**
     * Rebuild the state object for the View. Called from update() -> viewWillUpdate()
     */
    function updateStateFromProjectsModel() {
      var obj = Object.create(null);

      // Will hold active assignments, key is assignment ID
      obj.assignments = Object.create(null);

      // will get all assignments where the current user is assigned
      TT.model().getAssignmentsForCurrentUser().forEach(function (assignment) {
        if(assignment.get('active') === true) {
          obj.assignments[assignment.get('id')] = {
            assignmentID      : assignment.get('id'),
            projectTitle      : assignment.get('projectTitle'),
            projectID         : assignment.get('projectID'),
            projectDescription: assignment.get('projectDescription'),
            projectType       : assignment.get('projectType'),
            role              : assignment.get('role'),
            startDate         : assignment.get('startDate'),
            endDate           : assignment.get('endDate'),
            allocation        : assignment.get('allocation'),
            weekData          : assignment.get('timeCardData'),
            submitHistory     : assignment.get('submitHistory')
          };
        }
      });

      // calendar is the common MomentJS instance
      obj.calendar = TT.model().getTimeModelObj();

      this.setState(obj);
    }

    /**
     * Build an array of table > tr's that pertain to project data
     * @param prefix For timecard: 'tc_p_', for assignments: 'asn_p_'
     */
    function buildAssignmentRows(prefix) {
      _assignmentRows = getTRElementsWithIDMatchingPrefix.call(this, prefix);
    }

    function getTRElementsWithIDMatchingPrefix(prefix) {
      return _domUtils.getQSElementsAsArray(this.getDOMElement(), 'tr').filter(function (row) {
        var rowid = row.getAttribute('id');
        if (!rowid) {
          return false;
        }
        return rowid.indexOf(prefix) === 0;
      });
    }

    function getAssignmentRows() {
      return _assignmentRows;
    }

    /**
     * Returns an array of objects: key is ID, prop is object of form data inputs
     * @returns {Array}
     */
    function getAssignmentRowData(prefix) {
      var packet = Object.create(null),
          arry   = [];

      this.getAssignmentRows().forEach(function (row) {
        var id  = row.getAttribute('id').split(prefix)[1],
            obj = Object.create(null);
        obj[id] = _domUtils.captureFormData(row);
        arry.push(obj);
      });

      packet.state = this.getState();
      packet.form  = arry;

      return packet;
    }

    /**
     * Set tool tips to display on hover of project name
     */
    function setProjectTitleCellToolTips(prefix) {
      var state = this.getState();
      this.getAssignmentRows().forEach(function (el) {
        var projectID     = el.getAttribute('id').split(prefix)[1],
            headingCellEl = el.querySelector('th');

        _toolTip.add({
          title   : '',
          content : state.assignments[projectID].projectDescription,
          position: 'B',
          targetEl: headingCellEl,
          type    : 'information',
          width   : 500
        });
      });
    }

    /**
     * Remove tool tips to display on hover of project name
     */
    function removeProjectTitleCellToolTips() {
      this.getAssignmentRows().forEach(function (el) {
        _toolTip.remove(el.querySelector('th'));
      });
    }

    /**
     * Visual indicator, flash the
     * @param elIDStr
     */
    function flashAssignmentRow(elIDStr) {
      return;

      // Disabled
      //var row, animTimeLine;
      //
      //elIDStr = parseProjectID(elIDStr);
      //
      //row = this.getAssignmentRows().filter(function (rowEl) {
      //  if (rowEl.getAttribute('id').indexOf(elIDStr) > 0) {
      //    return true;
      //  }
      //  return false;
      //});
      //
      //if (row) {
      //  animTimeLine = new TimelineLite();
      //  animTimeLine.to(row, 0.25, {
      //    boxShadow: "0 0 2px 2px rgba(0,94,184,0.25) inset",
      //    ease     : Circ.easeOut
      //  });
      //  animTimeLine.to(row, 0.5, {
      //    boxShadow: "0 0 0px 0px rgba(0,94,184,0) inset",
      //    ease     : Circ.easeOut
      //  });
      //  animTimeLine.play();
      //}
    }

    /**
     * Returns the project id from a element ID
     * Element id's on the forms are similar to: 'tc_p_#####'
     * @param elIDStr
     * @returns {*}
     */
    function parseProjectID(elIDStr) {
      return _.last(elIDStr.split('_'));
    }

    /**
     * Disable all elements on the form
     */
    function disableForm() {
      var inputs       = _domUtils.getQSElementsAsArray(this.getDOMElement(), 'input'),
          selects      = _domUtils.getQSElementsAsArray(this.getDOMElement(), 'select'),
          formElements = inputs.concat(selects);

      formElements.forEach(function (els) {
        els.disabled = true;
      });

    }

    /**
     * Enable all elements on the form
     */
    function enableForm() {
      var inputs       = _domUtils.getQSElementsAsArray(this.getDOMElement(), 'input'),
          selects      = _domUtils.getQSElementsAsArray(this.getDOMElement(), 'select'),
          formElements = inputs.concat(selects);

      formElements.forEach(function (els) {
        els.disabled = false;
      });

    }

    //----------------------------------------------------------------------------
    //  Utility
    //----------------------------------------------------------------------------

    function showAlert(message, cb) {
      _messageBoxIDs.push(TT.view().mbCreator().alert('Alert', message, false, cb));
    }

    function closeAllAlerts() {
      _messageBoxIDs.forEach(function (id) {
        TT.view().removeMessageBox(id);
      });
      _messageBoxIDs = [];
    }

    //----------------------------------------------------------------------------
    //  API
    //----------------------------------------------------------------------------

    module.exports.initializeCommon             = initializeCommon;
    module.exports.updateStateFromProjectsModel = updateStateFromProjectsModel;
    module.exports.showAlert                    = showAlert;
    module.exports.closeAllAlerts               = closeAllAlerts;
    module.exports.buildAssignmentRows          = buildAssignmentRows;
    module.exports.getAssignmentRows            = getAssignmentRows;
    module.exports.getAssignmentRowData         = getAssignmentRowData;
    module.exports.setProjectTitleCellToolTips  = setProjectTitleCellToolTips;
    module.exports.removeProjectTitleCellToolTips  = removeProjectTitleCellToolTips;
    module.exports.flashAssignmentRow           = flashAssignmentRow;
    module.exports.parseProjectID               = parseProjectID;
    module.exports.disableForm                  = disableForm;
    module.exports.enableForm                   = enableForm;
  });