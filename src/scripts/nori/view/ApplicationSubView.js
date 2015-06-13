/**
 * A template for a subviews
 */

define('Nori.View.ApplicationSubView',
  function (require, module, exports) {

    var _isInitialized = false,
      _initObj,
      _id,
      _templateObj,
      _html,
      _DOMElement,
      _mountPoint,
      _state = {},
      _children = [],
      _isMounted = false,
      _domUtils = require('Nudoru.Browser.DOMUtils');

    /**
     * Initialization
     * @param initObj
     */
    function initializeSubView(initObj) {
      if(!isInitialized()) {
        _initObj = initObj;
        _id = initObj.id;
        _templateObj = initObj.template;
      }
      this.update();
      _isInitialized = true;

    }

    /**
     * Add a child
     * @param child
     */
    function addChild(child) {
      _children.push(child);
    }

    /**
     * Remove a child
     * @param child
     */
    function removeChild(child) {
      var idx = _children.indexOf(child);
      _children[idx].dispose();
      _children.splice(idx, 1);
    }

    /**
     * Before the iew updates and a rerender occurs
     */
    function viewWillUpdate() {
      // update state
    }

    /**
     * Update state and rerender
     * @param dataObj
     * @returns {*}
     */
    function update() {
      this.viewWillUpdate();

      _children.forEach(function updateChild(child) {
        child.update();
      });

      if(_isMounted) {
        render();
      }
      this.viewDidUpdate();
    }

    /**
     * After the view updates and a rerender occurred
     */
    function viewDidUpdate() {
      // stub
    }

    function viewWillRender() {
      // stub
    }

    /**
     * Render it, need to add it to a parent container, handled in higher level view
     * @returns {*}
     */
    function render() {
      this.viewWillRender();

      _children.forEach(function renderChild(child) {
        child.render();
      });

      _html = _templateObj(_state);
      _DOMElement = _domUtils.HTMLStrToNode(_html);

      this.viewDidRender();

      return _DOMElement;
    }

    function viewDidRender() {
      // stub
    }

    /**
     * Call before it's been added to a view
     */
    function viewWillMount() {
      // stub
    }

    /**
     * Append it to a parent element
     * @param mountEl
     */
    function mount(mountEl) {
      if(!_DOMElement) {
        throw new Error('SubView '+_id+' cannot mount. Call render() first');
      }

      _mountPoint = mountEl;

      this.viewWillMount();
      _mountPoint.appendChild(_DOMElement);
      this.viewDidMount();
    }

    /**
     * Call after it's been added to a view
     */
    function viewDidMount() {
      _isMounted = true;
    }

    /**
     * Call when unloading and switching views
     */
    function viewWillUnmount() {
      // stub
    }

    function unmount() {
      this.viewWillUnmount();
      _mountPoint.removeChild(_DOMElement);
      this.viewDidUnmount();
    }

    function viewDidUnmount() {
      _isMounted = false;

    }

    /**
     * Remove a view and cleanup
     */
    function dispose() {
      // TODO
      this.unmount();
    }

    //----------------------------------------------------------------------------
    //  Accessors
    //----------------------------------------------------------------------------

    function isInitialized() {
      return _isInitialized;
    }

    function setState(obj) {
      _state = obj;
    }

    function getState() {
      return _state;
    }

    function getID() {
      return _id;
    }

    function getTemplate() {
      return _templateObj;
    }

    function getDOMElement() {
      return _DOMElement;
    }

    function setDOMElement(el) {
      _DOMElement = el;
    }

    function getHTML() {
      return _html;
    }

    function setHTML(str) {
      _html = str;
    }

    function getChildren() {
      return _children.slice(0);
    }

    //----------------------------------------------------------------------------
    //  API
    //----------------------------------------------------------------------------

    exports.initializeSubView = initializeSubView;

    exports.isInitialized = isInitialized;
    exports.setState = setState;
    exports.getState = getState;
    exports.getID = getID;
    exports.getTemplate = getTemplate;
    exports.getHTML = getHTML;
    exports.setHTML = setHTML;
    exports.getDOMElement = getDOMElement;
    exports.setDOMElement = setDOMElement;

    exports.viewWillUpdate = viewWillUpdate;
    exports.update = update;
    exports.viewDidUpdate = viewDidUpdate;

    exports.viewWillRender = viewWillRender;
    exports.render = render;
    exports.viewDidRender = viewDidRender;

    exports.viewWillMount = viewWillMount;
    exports.mount = mount;
    exports.viewDidMount = viewDidMount;

    exports.viewWillUnmount = viewWillUnmount;
    exports.unmount = unmount;
    exports.viewDidUnmount = viewDidUnmount;

    exports.addChild = addChild;
    exports.removeChild = removeChild;
    exports.getChildren = getChildren;

  });