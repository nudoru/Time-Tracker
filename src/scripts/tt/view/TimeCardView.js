define('TT.View.TimeCardView',
  function (require, module, exports) {

    var _self,
      _columnNames = ['alloc', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      _columnObj = Object.create(null),
      _cardTotal = 0,
      _submitButtonEl,
      _submitButtonLabelEl,
      _isSubmitted = false,
      _isLocked = false,
      _lockedStatusEl,
      _inProgressStatusEl,
      _domUtils = require('Nudoru.Browser.DOMUtils'),
      _toolTip = require('Nudoru.Component.ToolTipView');

    //--------------------------------------------------------------------------
    // Core
    //--------------------------------------------------------------------------

    /**
     * Initialize and set up events
     * @param initObj
     */
    function initialize(initObj) {
      _self = this;
      if (!this.isInitialized()) {
        this.setProjectsModel();
        this.initializeSubView(initObj);
        this.setEvents({
          'change #tc_p_table': handleInputChangeEvent,
          'click #tc_btn-submit': handleTimeCardSubmit,
          'click #tc_btn-prevwk': handleNotImpl,
          'click #tc_btn-nextwk': handleNotImpl,
          'click #tc_btn-unlock': handleUnlockTimeCard
        });
      }
    }

    /**
     * Update from the model
     */
    function viewWillUpdate() {
      this.updateStateFromProjectsModel();
    }

    /**
     * Render and set from the DOM elements
     */
    function viewDidMount() {
      _inProgressStatusEl = document.getElementById('tc_status_inprogress');
      _lockedStatusEl = document.getElementById('tc_status_locked');

      _submitButtonEl = document.getElementById('tc_btn-submit');
      _submitButtonLabelEl = document.getElementById('tc_btn-submit-label');

      buildFieldList();
      this.buildProjectRows();
      updateColumnSums();
      setProjectToolTips();

      unlockCard();
      updateCardStatusText('Testing!');
    }

    /**
     * View is going away, remove anything that it created: Cleanup
     */
    function viewWillUnmount() {
      this.closeAllAlerts();
    }


    //--------------------------------------------------------------------------
    // Custom
    //--------------------------------------------------------------------------

    function updateCardStatusText(text) {
      var textEl;

      if(_isLocked || _isSubmitted) {
        textEl = _lockedStatusEl.querySelector('span');
      } else {
        textEl = _inProgressStatusEl.querySelector('span');
      }

      textEl.innerHTML = text;
    }

    /**
     * Build an array of all of the form fields on the screen
     */
    function buildFieldList() {
      var allInputEls = _self.getDOMElement().querySelectorAll('input');
      var allInputIDs = Array.prototype.slice.call(allInputEls, 0).map(function (el) {
        return el.getAttribute('id');
      });

      _columnNames.forEach(function (col, i) {
        _columnObj[col] = Object.create(null);
        _columnObj[col].fieldIDs = allInputIDs.filter(function (id) {
          return id.indexOf(col) > 0;
        });
        _columnObj[col].sumEl = document.getElementById('tc_sum_' + col);
        _columnObj[col].type = i === 0 ? '%' : 'hrs';
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
     * Update sums, data when a field changes and looses focus
     * @param evt
     */
    function handleInputChangeEvent(evt) {
      // visual indicator
      _self.flashProjectRow(evt.target.getAttribute('id'));

      updateColumnSums();

      // DEBUG
      _self.getProjectRowData();
    }

    /**
     * Itterate over the columns and sum them all
     */
    function updateColumnSums() {
      _cardTotal = 0;

      for (var col in _columnObj) {
        var sum = sumFieldGroup(_columnObj[col].fieldIDs), isWarn = false;
        if (_columnObj[col].type === 'hrs') {
          _cardTotal += sum;
          if (sum > 9) {
            isWarn = true;
          }
        } else if (_columnObj[col].type === '%') {
          if (sum > 100) {
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

    /**
     * When the submit button is clicked
     */
    function handleTimeCardSubmit() {
      if(_isSubmitted || _isLocked) {
        _self.showAlert('Unlock the time card to make edits and submit changes.');
        return;
      }

      if (_cardTotal < 30) {
        _self.showAlert('Whoa there! ' + _cardTotal + ' hours doesn\'t seem quite right. Please enter atleast 30 hours to submit.');
        return;
      }

      TT.view().mbCreator().confirm('Read to submit this time card?',
        'Only submit your time card when all data for the week has been entered. Editing a submitted time card will require justification.<br><br>Ready to submit?',
        function () {
          lockCard();
          _isSubmitted = true;

          TT.view().addMessageBox({
            title: 'Success',
            content: 'Your ' + _cardTotal + ' hours were submitted successfully! Thanks for all you do. +1xp earned.',
            type: 'default',
            modal: true,
            buttons: [
              {
                label: 'Got it',
                id: 'close',
                type: 'positive',
                icon: 'thumbs-up'
              }
            ]
          });
        },
        true);
    }

    /**
     * If the time card was previously submitted
     */
    function handleUnlockTimeCard() {
      TT.view().mbCreator().prompt('Modify Time Card',
        'This time card has been submitted. Please let us know why you\'re modifying it.',
        function(data) {
          _isSubmitted = false;
          unlockCard();
        },
        true);
    }

    /**
     * Set tool tips to display on hover of project name
     */
    function setProjectToolTips() {
      var allTrEls = document.querySelectorAll('tr');
      Array.prototype.slice.call(allTrEls, 0).map(function (el) {
        var rowID = el.getAttribute('id');
        if (rowID) {
          if (rowID.indexOf('tc_p_') === 0) {
            var projectID = rowID.split('tc_p_')[1],
              projectDesc = _self.getState().projects[projectID].projectDescription,
              headingCellEl = el.querySelector('th');

            _toolTip.add({
              title: '',
              content: projectDesc,
              position: 'R',
              targetEl: headingCellEl,
              type: 'information',
              width: 400
            });
          }
        }

      });
    }

    function lockCard() {
      _isLocked = true;
      _self.disableForm();
      _domUtils.addClass(_submitButtonEl, 'button-disabled');
      _domUtils.addClass(_inProgressStatusEl, 'hidden');
      _domUtils.removeClass(_lockedStatusEl, 'hidden');
    }

    function unlockCard() {
      _isLocked = false;
      _self.enableForm();
      _domUtils.removeClass(_submitButtonEl, 'button-disabled');
      _domUtils.removeClass(_inProgressStatusEl, 'hidden');
      _domUtils.addClass(_lockedStatusEl, 'hidden');
    }

    /**
     * Generic error function
     */
    function handleNotImpl() {
      TT.view().mbCreator().alert('Oooops!','This doesn\'t work yet');
    }

    //--------------------------------------------------------------------------
    // API
    //--------------------------------------------------------------------------

    exports.initialize = initialize;
    exports.viewWillUpdate = viewWillUpdate;
    exports.viewDidMount = viewDidMount;
    exports.viewWillUnmount = viewWillUnmount;
  });