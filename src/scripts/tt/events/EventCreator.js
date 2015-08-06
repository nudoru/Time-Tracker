define('tt/events/EventCreator',
  function (require, module, exports) {

    var _dispatcher            = require('nori/utils/Dispatcher'),
        _ttEventConstants     = require('tt/events/EventConstants');

    module.exports.addAssignment = function(projectID) {
      _dispatcher.publish({
        type: _ttEventConstants.ADD_ASSIGNMENT,
        payload: {
          projectID: projectID
        }
      });
    };

    module.exports.archiveAssignment = function(assignmentID) {
      _dispatcher.publish({
        type: _ttEventConstants.ARCHIVE_ASSIGNMENT,
        payload: {
          assignmentID: assignmentID
        }
      });
    };

    module.exports.updateAssignments = function(data) {
      _dispatcher.publish({
        type: _ttEventConstants.UPDATE_ASSIGNMENTS,
        payload: {
          data: data
        }
      });
    };

    module.exports.submitTimeCard = function() {
      _dispatcher.publish({
        type: _ttEventConstants.SUBMIT_TIMECARD,
        payload: {}
      });
    };

    module.exports.unSubmitTimeCard = function(comments) {
      _dispatcher.publish({
        type: _ttEventConstants.UNLOCK_TIMECARD,
        payload: {
          comments: comments
        }
      });
    };

    module.exports.updateTimeCard = function(data) {
      _dispatcher.publish({
        type: _ttEventConstants.UPDATE_TIMECARD,
        payload: {
          data: data
        }
      });
    };

    module.exports.goWeekForward = function() {
      _dispatcher.publish({
        type: _ttEventConstants.TIMECARD_WEEKFORWARD,
        payload: {}
      });
    };

    module.exports.goWeekBackward = function() {
      _dispatcher.publish({
        type: _ttEventConstants.TIMECARD_WEEKBACKWARD,
        payload: {}
      });
    };

  });