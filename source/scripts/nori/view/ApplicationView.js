define('Nori.ApplicationView',
  function (require, module, exports) {

    var _appContainerEl,
      _appEl,
      _notificationView = require('nudoru.components.ToastView'),
      _toolTipView = require('nudoru.components.ToolTipView'),
      _messageBoxView = require('nudoru.components.MessageBoxView'),
      _modalCoverView = require('nudoru.components.ModalCoverView');

    //----------------------------------------------------------------------------
    //  Accessors
    //----------------------------------------------------------------------------

    function getAppContainerEl() {
      return _appContainerEl;
    }

    function getAppEl() {
      return _appEl;
    }

    //----------------------------------------------------------------------------
    //  Initialization
    //----------------------------------------------------------------------------

    function initialize() {
      initializeApplicationElements();
      initializeComponents();
    }

    function render() {
      ///
    }

    function initializeApplicationElements() {
      _appContainerEl = document.getElementById('app__container');
      _appEl = document.getElementById('app__contents');
    }

    function initializeComponents() {
      _toolTipView.initialize('tooltip__container');
      _notificationView.initialize('toast__container');
      _messageBoxView.initialize('messagebox__container');
      _modalCoverView.initialize();
    }

    /**
     * Alter the UI on resize or scroll
     * @param sizeObj Props: width, height
     * @param scrollObj Props: left, top
     */
    function layoutUI(sizeObj, scrollObj) {
      //
    }

    //----------------------------------------------------------------------------
    //  Messaging
    //----------------------------------------------------------------------------

    /**
     * Show a message box
     * @param obj
     */
    function addMessageBox(obj) {
      _messageBoxView.add(obj);
    }

    /**
     * Show a popup message box
     * @param message
     */
    function showAlert(message) {
      addMessageBox({
        title: 'Alert',
        content: message,
        type: _messageBoxView.type().DEFAULT,
        modal: false
      });
    }

    /**
     * Show notificiation
     * @param obj
     */
    function addNotification(obj) {
      _notificationView.add(obj);
    }

    /**
     * Display a notification "toast"
     * @param title The title
     * @param message The message
     */
    function showNotification(message, title, type) {
      addNotification({
        title: title || "Notification",
        type: type || _notificationView.type().DEFAULT,
        message: message
      });
    }

    /**
     * After app initialization, remove the loading message
     */
    function removeLoadingMessage() {
      var cover = document.getElementById('initialization__cover'),
        message = document.getElementsByClassName('initialization__message')[0];

      TweenLite.to(cover, 1, {
        alpha: 0, ease: Quad.easeOut, onComplete: function () {
          document.body.removeChild(cover);
        }
      });

      TweenLite.to(message, 2, {
        top: "+=50px", ease: Quad.easeIn, onComplete: function () {
          cover.removeChild(message);
        }
      });
    }

    //----------------------------------------------------------------------------
    //  API
    //----------------------------------------------------------------------------

    exports.initialize = initialize;

    exports.initializeApplicationElements = initializeApplicationElements;
    exports.initializeComponents = initializeComponents;

    exports.addMessageBox = addMessageBox;
    exports.addNotification = addNotification;
    exports.alert = showAlert;
    exports.notify = showNotification;
    exports.removeLoadingMessage = removeLoadingMessage;
    exports.layoutUI = layoutUI;
    exports.getAppContainerEl = getAppContainerEl;
    exports.getAppEl = getAppEl;

  });