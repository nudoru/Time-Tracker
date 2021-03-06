define('tt/view/TimeCardView',
  function (require, module, exports) {

    var _this,
        _prefix            = 'tc_p_',
        _columnNames       = ['alloc', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        _columnObj         = Object.create(null),
        _cardTotal         = 0,
        _submitButtonEl,
        _submitButtonLabelEl,
        _isLocked          = false,
        _lockedStatusEl,
        _inProgressStatusEl,
        _domUtils          = require('nudoru/browser/DOMUtils'),
        _ttEvents          = require('tt/events/EventCreator'),
        _arrayUtils        = require('nudoru/core/ArrayUtils'),
        _appEventConstants = require('nori/events/EventConstants'),
        _dispatcher        = require('nori/utils/Dispatcher');
    _successMessages       = ['Thanks for all you do!',
      '"What ever you\'re goal is in life, embrace it visualize it, and for it will be yours."',
      'Success is 1% inspiration, 98% perspiration and 2% attention to detail.',
      '"Land is always on the mind of a flying bird."',
      '"Do or do not, there is no try." -Yoda',
      '"Life is not easy for any of us. But what of that? We must have perseverance and above all confidence in ourselves. We must believe that we are gifted for something and that this thing must be attained." -Marie Curie',
      '"Perseverance is not a long race; it is many short races one after the other." -Walter Elliot'
    ];

    //--------------------------------------------------------------------------
    // Core
    //--------------------------------------------------------------------------

    /**
     * Initialize and set up events
     * @param initObj
     */
    function initialize(initObj) {
      _this = this;
      if (!this.isInitialized()) {
        this.initializeComponent(initObj);
        this.setEvents({
          'change #tc_p_table'  : handleInputChangeEvent,
          'click #tc_btn-submit': handleTimeCardSubmitClick,
          'click #tc_btn-unlock': handleUnlockTimeCardClick,
          'click #tc_btn-prevwk': handlePreviousWeekClick,
          'click #tc_btn-nextwk': handleNextWeekClick
        });
        //TT.model().getTimeModel().subscribe(this.update.bind(this));
        this.bindMap(TT.model().getTimeModel());
      }
    }

    /**
     * Update from the model
     */
    function viewWillUpdate() {
      // In subview.ModuleCommon
      this.updateStateFromProjectsModel();
    }

    /**
     * Render and set from the DOM elements
     */
    function viewDidMount() {
      _inProgressStatusEl  = document.getElementById('tc_status_inprogress');
      _lockedStatusEl      = document.getElementById('tc_status_locked');
      _submitButtonEl      = document.getElementById('tc_btn-submit');
      _submitButtonLabelEl = document.getElementById('tc_btn-submit-label');

      buildColumnFieldsObject();
      this.buildAssignmentRows(_prefix);
      this.setProjectTitleCellToolTips(_prefix);

      populateFormData();
      updateColumnSums();

      if (TT.model().isCurrentWeekTimeCardLocked()) {
        lockCard();
        updateCardStatusText(TT.model().getCurrentTimeCardSubmitMetaData().time);
      } else {
        unlockCard();
        updateCardStatusText('In progress');
      }

      if (this.getAssignmentRows().length === 0) {
        this.showAlert('You don\'t have any active assignments. Click on the <strong>Assignments</strong> button to add them and then return here to enter hours.', function () {
          _dispatcher.publish({
            type   : _appEventConstants.CHANGE_ROUTE,
            payload: {route: '/Assignments'}
          });
        });
      }
    }

    /**
     * View is going away, remove anything that it created: Cleanup
     */
    function viewWillUnmount() {
      this.closeAllAlerts();
      this.removeProjectTitleCellToolTips();
    }

    //--------------------------------------------------------------------------
    // UI
    //--------------------------------------------------------------------------

    /**
     * Updates the status LI>SPAN text to show status of the current card
     */

    function updateCardStatusText(text) {
      var textEl;

      if (_isLocked) {
        textEl = _lockedStatusEl.querySelector('span');
      } else {
        textEl = _inProgressStatusEl.querySelector('span');
      }

      textEl.innerHTML = text;
    }

    /**
     * Update sums, data when a field changes and looses focus
     * @param evt
     */
    function handleInputChangeEvent(evt) {
      _this.flashAssignmentRow(evt.target.getAttribute('id'));
      updateColumnSums();

      _ttEvents.updateTimeCard(_this.getAssignmentRowData(_prefix));
    }

    /**
     * When the submit button is clicked
     */
    function handleTimeCardSubmitClick() {
      if (_isLocked) {
        _this.showAlert('Unlock the time card to make edits and submit changes.');
        return;
      }

      //if (_cardTotal === 0) {
      //  _this.showAlert('Whoa there! ' + _cardTotal + ' hours doesn\'t seem quite right.'); // Please enter at least 30 hours to submit.
      //  return;
      //}

      promptForCardSubmit();
    }

    /**
     * If the time card was previously submitted
     */
    function handleUnlockTimeCardClick() {
      promptForCardUnlock();
    }

    function populateFormData() {
      var assignments   = _this.getState().assignments,
          assignmentIDs = Object.keys(assignments);

      assignmentIDs.forEach(function (aid) {
        var assignment = assignments[aid],
            weekData   = assignment.weekData[_this.getState().calendar.date];

        if (weekData) {
          console.log(aid, weekData);
          document.getElementById('tc_p_alloc_' + aid).value     = weekData.allocation;
          document.getElementById('tc_p_monday_' + aid).value    = weekData.monday;
          document.getElementById('tc_p_tuesday_' + aid).value   = weekData.tuesday;
          document.getElementById('tc_p_wednesday_' + aid).value = weekData.wednesday;
          document.getElementById('tc_p_thursday_' + aid).value  = weekData.thursday;
          document.getElementById('tc_p_friday_' + aid).value    = weekData.friday;
          document.getElementById('tc_p_work_' + aid).value      = weekData.worktype;
          document.getElementById('tc_p_comment_' + aid).value   = weekData.comments;
        } else {
          //console.log('No data for week');
        }


      });
    }

    //--------------------------------------------------------------------------
    // Card data
    //--------------------------------------------------------------------------

    /**
     * Build an array of all of the form fields on the screen
     */
    function buildColumnFieldsObject() {
      var allInputEls = _this.getDOMElement().querySelectorAll('input');
      var allInputIDs = Array.prototype.slice.call(allInputEls, 0).map(function (el) {
        return el.getAttribute('id');
      });

      _columnNames.forEach(function (col, i) {
        _columnObj[col]          = Object.create(null);
        _columnObj[col].fieldIDs = allInputIDs.filter(function (id) {
          return id.indexOf(col) > 0;
        });
        _columnObj[col].sumEl    = document.getElementById('tc_sum_' + col);
        _columnObj[col].type     = 'hrs';
        _columnObj[col].index    = i;
      });

    }

    /**
     * Get a sum for a column of input fields
     * If the field has a NaN value, set it to 0
     * If it's ok, set the field to the parsed value, '6t' => '6'
     * @param idList
     * @returns {number}
     */
    function sumFieldGroup(idList) {
      var sum = 0;
      idList.forEach(function (id) {
        var inputValue = document.getElementById(id).value,
            valueFloat = parseFloat(inputValue);
        sum += valueFloat || 0;
        if (!valueFloat) {
          if (inputValue.length) {
            document.getElementById(id).value = '0';
          }
        } else {
          document.getElementById(id).value = valueFloat;
        }

      });
      return sum;
    }

    /**
     * Itterate over the columns and sum them all
     */
    function updateColumnSums() {
      _cardTotal = 0;

      for (var col in _columnObj) {
        var sum = sumFieldGroup(_columnObj[col].fieldIDs), isWarn = false;
        // The first column is the allocation column
        if (_columnObj[col].index === 0) {
          if (sum > 40) {
            isWarn = true;
          }
        } else {
          _cardTotal += sum;
          if (sum > 9) {
            isWarn = true;
          }
        }
        _columnObj[col].sumEl.innerHTML = sum + ' ' + _columnObj[col].type;

        if (isWarn) {
          _domUtils.addClass(_columnObj[col].sumEl, 'label-warning');
        } else {
          _domUtils.removeClass(_columnObj[col].sumEl, 'label-warning');
        }

      }

      _submitButtonLabelEl.innerHTML = 'Submit ' + _cardTotal + ' hrs';

      if (_cardTotal > 50) {
        _domUtils.addClass(_submitButtonEl, 'button-warning');
      } else {
        _domUtils.removeClass(_submitButtonEl, 'button-warning');
      }

    }

    function promptForCardSubmit() {
      TT.view().mbCreator().confirm('Read to submit this time card?',
        'Only submit your time card when all data for the week has been entered. Editing a submitted time card will require justification.<br><br>Ready to submit?',
        function () {
          submitCard();

          TT.view().addMessageBox({
            title  : 'Success',
            content: 'Your ' + _cardTotal + ' hours were submitted successfully! <br><br>' + _arrayUtils.rndElement(_successMessages),
            type   : 'default',
            modal  : true,
            buttons: [
              {
                label: 'Got it',
                id   : 'close',
                type : 'positive',
                icon : 'thumbs-up'
              }
            ]
          });

          updateCardStatusText(TT.model().getCurrentTimeCardSubmitMetaData().time);
        },
        true);
    }

    function promptForCardUnlock() {
      TT.view().mbCreator().prompt('Modify Time Card',
        'This time card has been submitted. Please let us know why you\'re modifying it.',
        function (data) {
          unSubmitCard(data.response);
        },
        true);
    }

    function submitCard() {
      lockCard();
      _ttEvents.submitTimeCard();
    }

    function unSubmitCard(comments) {
      unlockCard();
      _ttEvents.unSubmitTimeCard(comments);
    }

    function lockCard() {
      _isLocked = true;
      _this.disableForm();
      _domUtils.addClass(_submitButtonEl, 'button-disabled');
      _domUtils.addClass(_inProgressStatusEl, 'hidden');
      _domUtils.removeClass(_lockedStatusEl, 'hidden');
    }

    function unlockCard() {
      _isLocked = false;
      _this.enableForm();
      _domUtils.removeClass(_submitButtonEl, 'button-disabled');
      _domUtils.removeClass(_inProgressStatusEl, 'hidden');
      _domUtils.addClass(_lockedStatusEl, 'hidden');
    }

    function handlePreviousWeekClick() {
      _ttEvents.goWeekBackward();
    }

    function handleNextWeekClick() {
      _ttEvents.goWeekForward();
    }

    //--------------------------------------------------------------------------
    // API
    //--------------------------------------------------------------------------

    module.exports.initialize      = initialize;
    module.exports.viewWillUpdate  = viewWillUpdate;
    module.exports.viewDidMount    = viewDidMount;
    module.exports.viewWillUnmount = viewWillUnmount;
  });
