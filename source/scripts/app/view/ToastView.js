/**
 * Created by matt on 12/1/14.
 * modified 3/12/15
 */

APP.createNameSpace('APP.AppView.ToastView');
APP.AppView.ToastView = (function(){

  var _children = [],
      _counter = 0,
      _defaultExpireDuration = 7000,
      _containerEl,
      _templateToast = _.template('<div class="toast" id="<%= id %>">' +
      '<div class="content"><h1><%= title %></h1><p><%= message %></p></div>' +
      '<div class="controls"><button><i class="fa fa-close"></i></button></div></div>');

  function initialize(elID) {
    _containerEl = $(elID);
  }

  function add(title, message, button) {
    button = button || 'OK';
    var newToast = createToastObject(title, message, button);

    $(_containerEl).prepend(newToast.html);

    newToast.index = _children.length;
    newToast.element = $('#'+newToast.id);
    newToast.height = newToast.element.innerHeight();

    newToast.closeBtnStream = Rx.Observable.fromEvent(newToast.element.find('button')[0], 'click');
    newToast.expireTimeStream = Rx.Observable.interval(_defaultExpireDuration);
    newToast.lifeTimeStream = Rx.Observable.merge(newToast.closeBtnStream, newToast.expireTimeStream).take(1)
      .subscribe(function() {
        remove(newToast.id);
      });

    _children.push(newToast);

    transitionIn(newToast.element);

    return newToast.id;
  }

  function createToastObject(title,message,button) {
    var id = 'toast' + (_counter++).toString();
    return {
      id: id,
      index: -1,
      title: title,
      message: message,
      buttonLabel: button,
      status: 'new',
      html: _templateToast({id: id, title: title, message: message}),
      element: null,
      height: 0,
      closeBtnStream: null,
      expireTimeStream: null,
      lifeTimeStream: null
    };
  }

  function transitionIn(el) {
    TweenMax.to(el,0,{alpha: 0});
    TweenMax.to(el,1, {alpha: 1, ease: Quad.easeOut});
    rearrangeToasts();
  }

  function transitionOut(el) {
    TweenMax.to(el, 0.25, {left: '+=300', ease: Quad.easeIn, onComplete: function() {
      onTransitionOutComplete(el);
    }});
  }

  function onTransitionOutComplete(el) {
    var toastIdx = getToastIndexByID(el.attr('id')),
      toast = _children[toastIdx];

    el.remove();

    _children[toastIdx] = null;

    _children.splice(toast.index, 1);
    reindex();
  }

  function reindex() {
    var i = 0,
      len=_children.length;

    for(; i<len; i++) {
      _children[i].index = i;
    }
  }

  function rearrangeToasts(ignore) {
    var i = _children.length - 1,
      current,
      y = 0;

    for(;i>-1; i--) {
      if(i === ignore) {
        continue;
      }
      current = _children[i];
      TweenMax.to(current.element, 0.75, {y: y, ease: Bounce.easeOut});
      y += 10 + current.height;
    }
  }

  function getToastIndexByID(id) {
    var len = _children.length,
      i = 0;

    for(; i<len; i++) {
      if(_children[i].id === id) {
        return i;
      }
    }

    return -1;
  }

  function remove(id) {
    var toastIndex = getToastIndexByID(id),
      toast;

    if(toastIndex > -1) {
      toast = _children[toastIndex];
      transitionOut(toast.element);
      rearrangeToasts(toast.index);
    }
  }

  return {
    initialize: initialize,
    add: add,
    remove: remove
  };

}());