/*
 Simple wrapper for Underscore / HTML templates

 Matt Perkins
 4/7/15
 */
define('nudoru/component/Templating',
  function (require, module, exports) {

    var _templateHTMLCache = Object.create(null),
        _templateCache     = Object.create(null),
        _DOMUtils          = require('nudoru/browser/DOMUtils');

    /**
     * Get the template html from the script tag with id
     * @param id
     * @returns {*}
     */
    function getSource(id) {
      if (_templateHTMLCache[id]) {
        return _templateHTMLCache[id];
      }

      var src       = document.getElementById(id),
          srchtml   = '',
          cleanhtml = '';

      if (src) {
        srchtml = src.innerHTML;
      } else {
        throw new Error('nudoru/core/NTemplate, template not found: "' + id + '"');
      }

      cleanhtml              = cleanTemplateHTML(srchtml);
      _templateHTMLCache[id] = cleanhtml;
      return cleanhtml;
    }

    /**
     * Returns an underscore template
     * @param id
     * @returns {*}
     */
    function getTemplate(id) {
      if (_templateCache[id]) {
        return _templateCache[id];
      }
      var templ          = _.template(getSource(id));
      _templateCache[id] = templ;
      return templ;
    }

    /**
     * Processes the template and returns HTML
     * @param id
     * @param obj
     * @returns {*}
     */
    function asHTML(id, obj) {
      var temp = getTemplate(id);
      return temp(obj);
    }

    /**
     * Processes the template and returns an HTML Element
     * @param id
     * @param obj
     * @returns {*}
     */
    function asElement(id, obj) {
      return _DOMUtils.HTMLStrToNode(asHTML(id, obj));
    }

    /**
     * Cleans template HTML
     */
    function cleanTemplateHTML(str) {
      //replace(/(\r\n|\n|\r|\t)/gm,'').replace(/>\s+</g,'><').
      return str.trim();
    }

    module.exports.getSource   = getSource;
    module.exports.getTemplate = getTemplate;
    module.exports.asHTML      = asHTML;
    module.exports.asElement   = asElement;

  });
