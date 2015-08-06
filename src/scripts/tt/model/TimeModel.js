define('tt/model/TimeModel',

  function (require, module, exports) {
    var _moment,
        _id,
        _appEvents = require('nori/events/EventCreator');

    function initialize() {
      _moment = moment();
      _id     = 'timeModel';
    }

    function now() {
      return moment().format('YY-M-D@h:m:s a');
    }

    function prettyNow() {
      return moment().format('MMM Do YYYY, h:mm a');
    }

    function getTimeStamp() {
      return moment().format('M-D-YY,h:mm:ss,a');
    }

    function getCurrentWeek() {
      return _moment.week();
    }

    function getCurrentYear() {
      return _moment.year();
    }

    function resetToCurrent() {
      _moment = moment();
      dispatchChange();
    }

    function forwardWeek() {
      var wk = _moment.week();
      _moment.week(++wk);
      dispatchChange();
    }

    function backwardWeek() {
      var wk = _moment.week();
      _moment.week(--wk);
      dispatchChange();
    }

    function debug() {
      console.log(getCurrentWeek(), getCurrentYear(), getPrettyDateString(), getDateString());
    }

    function getDateString() {
      return getCurrentYear() + '_' + getCurrentWeek();
    }

    function getPrettyDateString(format) {
      format = format || 'MMM Do, YYYY';
      return _moment.format(format);
    }

    function dispatchChange() {
      _appEvents.modelChanged({
        id     : _id,
        type   : 'time_move',
        mapType: 'time',
        mapID  : ''
      });
    }

    module.exports.initialize          = initialize;
    module.exports.now                 = now;
    module.exports.prettyNow           = prettyNow;
    module.exports.getTimeStamp        = getTimeStamp;
    module.exports.getPrettyDateString = getPrettyDateString;
    module.exports.getDateString       = getDateString;
    module.exports.getCurrentWeek      = getCurrentWeek;
    module.exports.getCurrentYear      = getCurrentYear;
    module.exports.resetToCurrent      = resetToCurrent;
    module.exports.forwardWeek         = forwardWeek;
    module.exports.backwardWeek        = backwardWeek;

  });