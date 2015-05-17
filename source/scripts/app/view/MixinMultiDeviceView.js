/**
 * DeviceView handles responding to browser width changes and showing/hiding
 * the mobile UI drawer
 *
 * Extracted from View 5/6/15
 */

define('APP.View.MixinMultiDeviceView',
  function (require, module, exports) {

    var _drawerEl,
      _drawerToggleButtonEl,
      _drawerToggleButtonStream,
      _appEl,
      _browserResizeStream,
      _isMobile,
      _tabletBreakWidth,
      _phoneBreakWidth,
      _drawerWidth,
      _isDrawerOpen,
      _currentViewPortSize,
      _appEvents = require('APP.AppEvents'),
      _browserInfo = require('nudoru.utils.BrowserInfo'),
      _emitter = require('nudoru.events.EventDispatcher');

    function initialize(initObj) {
      _isMobile = false;
      _tabletBreakWidth = 750;
      _phoneBreakWidth = 475;
      _drawerWidth = 250;
      _isDrawerOpen = false;

      _appEl = document.getElementById('app__contents');
      _drawerEl = document.getElementById('drawer');
      _drawerToggleButtonEl = document.querySelector('.drawer__menu-spinner-button > input');

      if(_drawerEl) {
        TweenLite.to(_drawerEl, 0, {x: _drawerWidth * -1});
      }

      configureStreams();
      handleViewPortResize();
    }

    function configureStreams() {
      _browserResizeStream = Rx.Observable.fromEvent(window, 'resize')
        .throttle(10)
        .subscribe(function () {
          handleViewPortResize();
        });

      if(_drawerToggleButtonEl) {
        _drawerToggleButtonStream = Rx.Observable.fromEvent(_drawerToggleButtonEl, 'change')
          .subscribe(function () {
            toggleDrawer();
          });
      }
    }

    function handleViewPortResize() {
      setViewPortSize();
      checkForMobile();
    }

    function setViewPortSize() {
      _currentViewPortSize = {
        width: window.innerWidth,
        height: window.innerHeight
      };
    }

    /**
     * Usually on resize, check to see if we're in mobile
     */
    function checkForMobile() {
      if (_currentViewPortSize.width <= _tabletBreakWidth || _browserInfo.mobile.any()) {
        switchToMobileView();
      } else if (_currentViewPortSize.width > _tabletBreakWidth) {
        switchToDesktopView();
      }
    }

    function switchToMobileView() {
      if (_isMobile) {
        return;
      }
      _isMobile = true;
      _emitter.publish(_appEvents.VIEW_CHANGE_TO_MOBILE);
    }

    function switchToDesktopView() {
      if (!_isMobile) {
        return;
      }
      _isMobile = false;
      closeDrawer();
      _emitter.publish(_appEvents.VIEW_CHANGE_TO_DESKTOP);
    }

    function toggleDrawer() {
      if (_isDrawerOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    }

    function openDrawer() {
      _isDrawerOpen = true;
      TweenLite.to(_drawerEl, 0.5, {x: 0, ease: Quad.easeOut});
      TweenLite.to(_appEl, 0.5, {x: _drawerWidth, ease: Quad.easeOut});
    }

    function closeDrawer() {
      _isDrawerOpen = false;
      TweenLite.to(_drawerEl, 0.5, {x: _drawerWidth * -1, ease: Quad.easeOut});
      TweenLite.to(_appEl, 0.5, {x: 0, ease: Quad.easeOut});
    }

    exports.initialize = initialize;
    exports.openDrawer = openDrawer;
    exports.closeDrawer = closeDrawer;
    exports.checkForMobile = checkForMobile;
});