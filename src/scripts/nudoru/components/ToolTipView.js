/**
 * Created by matt on 5/21/15
 * last updated 7/9/15
 */

define('nudoru/component/ToolTipView',
  function (require, module, exports) {

    var _children     = [],
        _counter      = 0,
        _defaultWidth = 200,
        _types        = {
          DEFAULT    : 'default',
          INFORMATION: 'information',
          SUCCESS    : 'success',
          WARNING    : 'warning',
          DANGER     : 'danger',
          COACHMARK  : 'coachmark'
        },
        _typeStyleMap = {
          'default'    : '',
          'information': 'tooltip__information',
          'success'    : 'tooltip__success',
          'warning'    : 'tooltip__warning',
          'danger'     : 'tooltip__danger',
          'coachmark'  : 'tooltip__coachmark'
        },
        _positions    = {
          T : 'T',
          TR: 'TR',
          R : 'R',
          BR: 'BR',
          B : 'B',
          BL: 'BL',
          L : 'L',
          TL: 'TL'
        },
        _positionMap  = {
          'T' : 'tooltip__top',
          'TR': 'tooltip__topright',
          'R' : 'tooltip__right',
          'BR': 'tooltip__bottomright',
          'B' : 'tooltip__bottom',
          'BL': 'tooltip__bottomleft',
          'L' : 'tooltip__left',
          'TL': 'tooltip__topleft'
        },
        _mountPoint,
        _template     = require('nudoru/component/Templating'),
        _domUtils     = require('nudoru/browser/DOMUtils');

    function initialize(elID) {
      _mountPoint = document.getElementById(elID);
    }

    //obj.title, obj.content, obj.type, obj.target, obj.position
    function add(initObj) {
      initObj.type = initObj.type || _types.DEFAULT;

      var tooltipObj = createToolTipObject(initObj.title,
        initObj.content,
        initObj.position,
        initObj.targetEl,
        initObj.gutter,
        initObj.alwaysVisible);

      _children.push(tooltipObj);
      _mountPoint.appendChild(tooltipObj.element);

      tooltipObj.arrowEl = tooltipObj.element.querySelector('.arrow');
      assignTypeClassToElement(initObj.type, initObj.position, tooltipObj.element);

      TweenLite.set(tooltipObj.element, {
        css: {
          autoAlpha: tooltipObj.alwaysVisible ? 1 : 0,
          width    : initObj.width ? initObj.width : _defaultWidth
        }
      });

      // cache these values, 3d transforms will alter size
      tooltipObj.width  = tooltipObj.element.getBoundingClientRect().width;
      tooltipObj.height = tooltipObj.element.getBoundingClientRect().height;

      assignEventsToTargetEl(tooltipObj);
      positionToolTip(tooltipObj);

      if (tooltipObj.position === _positions.L || tooltipObj.position === _positions.R) {
        centerArrowVertically(tooltipObj);
      }

      if (tooltipObj.position === _positions.T || tooltipObj.position === _positions.B) {
        centerArrowHorizontally(tooltipObj);
      }

      return tooltipObj.element;
    }

    function assignTypeClassToElement(type, position, element) {
      if (type !== 'default') {
        _domUtils.addClass(element, _typeStyleMap[type]);
      }
      _domUtils.addClass(element, _positionMap[position]);
    }

    function createToolTipObject(title, message, position, target, gutter, alwaysVisible) {
      var id  = 'js__tooltip-tooltipitem-' + (_counter++).toString(),
          obj = {
            id           : id,
            position     : position,
            targetEl     : target,
            alwaysVisible: alwaysVisible || false,
            gutter       : gutter || 15,
            elOverStream : null,
            elOutStream  : null,
            height       : 0,
            width        : 0,
            element      : _template.asElement('template__component--tooltip', {
              id     : id,
              title  : title,
              message: message
            }),
            arrowEl      : null
          };

      return obj;
    }

    function assignEventsToTargetEl(tooltipObj) {
      if (tooltipObj.alwaysVisible) {
        return;
      }

      tooltipObj.elOverStream = Rx.Observable.fromEvent(tooltipObj.targetEl, 'mouseover')
        .subscribe(function (evt) {
          showToolTip(tooltipObj.id);
        });

      tooltipObj.elOutStream = Rx.Observable.fromEvent(tooltipObj.targetEl, 'mouseout')
        .subscribe(function (evt) {
          hideToolTip(tooltipObj.id);
        });
    }

    function showToolTip(id) {
      var tooltipObj = getObjByID(id);

      if (tooltipObj.alwaysVisible) {
        return;
      }

      positionToolTip(tooltipObj);
      transitionIn(tooltipObj.element);
    }

    function positionToolTip(tooltipObj) {
      var gutter   = tooltipObj.gutter,
          xPos     = 0,
          yPos     = 0,
          tgtProps = tooltipObj.targetEl.getBoundingClientRect();

      if (tooltipObj.position === _positions.TL) {
        xPos = tgtProps.left - tooltipObj.width;
        yPos = tgtProps.top - tooltipObj.height;
      } else if (tooltipObj.position === _positions.T) {
        xPos = tgtProps.left + ((tgtProps.width / 2) - (tooltipObj.width / 2));
        yPos = tgtProps.top - tooltipObj.height - gutter;
      } else if (tooltipObj.position === _positions.TR) {
        xPos = tgtProps.right;
        yPos = tgtProps.top - tooltipObj.height;
      } else if (tooltipObj.position === _positions.R) {
        xPos = tgtProps.right + gutter;
        yPos = tgtProps.top + ((tgtProps.height / 2) - (tooltipObj.height / 2));
      } else if (tooltipObj.position === _positions.BR) {
        xPos = tgtProps.right;
        yPos = tgtProps.bottom;
      } else if (tooltipObj.position === _positions.B) {
        xPos = tgtProps.left + ((tgtProps.width / 2) - (tooltipObj.width / 2));
        yPos = tgtProps.bottom + gutter;
      } else if (tooltipObj.position === _positions.BL) {
        xPos = tgtProps.left - tooltipObj.width;
        yPos = tgtProps.bottom;
      } else if (tooltipObj.position === _positions.L) {
        xPos = tgtProps.left - tooltipObj.width - gutter;
        yPos = tgtProps.top + ((tgtProps.height / 2) - (tooltipObj.height / 2));
      }

      TweenLite.set(tooltipObj.element, {
        x: xPos,
        y: yPos
      });
    }

    function centerArrowHorizontally(tooltipObj) {
      var arrowProps = tooltipObj.arrowEl.getBoundingClientRect();
      TweenLite.set(tooltipObj.arrowEl, {x: (tooltipObj.width / 2) - (arrowProps.width / 2)});
    }

    function centerArrowVertically(tooltipObj) {
      var arrowProps = tooltipObj.arrowEl.getBoundingClientRect();
      TweenLite.set(tooltipObj.arrowEl, {y: (tooltipObj.height / 2) - (arrowProps.height / 2) - 2});
    }

    function hideToolTip(id) {
      var tooltipObj = getObjByID(id);

      if (tooltipObj.alwaysVisible) {
        return;
      }

      transitionOut(tooltipObj.element);
    }

    function transitionIn(el) {
      TweenLite.to(el, 0.5, {
        autoAlpha: 1,
        ease     : Circ.easeOut
      });
    }

    function transitionOut(el) {
      TweenLite.to(el, 0.05, {
        autoAlpha: 0,
        ease     : Circ.easeOut
      });
    }

    function remove(el) {
      getObjByElement(el).forEach(function (tooltip) {
        if (tooltip.elOverStream) {
          tooltip.elOverStream.dispose();
        }
        if (tooltip.elOutStream) {
          tooltip.elOutStream.dispose();
        }

        TweenLite.killDelayedCallsTo(tooltip.element);

        _mountPoint.removeChild(tooltip.element);

        var idx = getObjIndexByID(tooltip.id);

        _children[idx] = null;
        _children.splice(idx, 1);
      });
    }

    function getObjByID(id) {
      return _children.filter(function (child) {
        return child.id === id;
      })[0];
    }

    function getObjIndexByID(id) {
      return _children.map(function (child) {
        return child.id;
      }).indexOf(id);
    }

    function getObjByElement(el) {
      return _children.filter(function (child) {
        return child.targetEl === el;
      });
    }

    module.exports.initialize = initialize;
    module.exports.add        = add;
    module.exports.remove     = remove;
    module.exports.type       = function () {
      return _types
    };
    module.exports.position   = function () {
      return _positions
    };

  });