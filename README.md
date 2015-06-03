# NORI App Framework

Handy starting template for my JS projects based on some of the ideas of: AS3 Robotlegs, Backbone, Ember + other random ideas I've found and liked.

Dependencies: RxJS, GSAP TweenLite, Lowdash and my Nudoru utility classes.

## To create new application

**Keep in mind***

- Update the grunt file as needed.
- I've created my own define/require module thing based on CommonJS. All require statements refer to that. See below.

The config.js file contains a global configuration JSON object. Nori wraps it and exposed it via: Nori.getConfig().appConfig

Create Make an app.js file

In here you need to create the global application instance:
```javascript
window.MyApp = Nori.create();
```

You need to create a module for the main view ... [steps later] ... and make the object:
```javascript
var appView = Nori.extend(require('myviewmodule.id'), require('Nori.View'));
```

Initialize the application with the view. This is required so that routes can be properly mapped
```javascript
MyApp.initialize({view:appView});
```

Map events to command modules. Commands are controllers that are triggered when an event is emitted. Sample:
```javascript
MyApp.mapEventCommand(_appEvents.ROUTE_CHANGED, ‘TT.RouteChangedCommand’);
```

Map routes to view modules. The Router module monitors the URL hash for changes and will instruct the view to load the HTML template id [‘template__whateverID’] with the subview module. Sample:
```javascript
MyApp.mapRouteView(‘/route’, ‘whateverID’, ‘MyApp.view.whaterverIDview’);
```

Define models, load data, etc.

Clear the loading message that display while all of this happens
```javascript
MyApp.view().removeLoadingMessage();
```

Execute the current URL route
```javascript
MyApp.setCurrentRoute(MyApp.router().getCurrentRoute()); 
```

Profit!

## Define / Require

This is in the source/nudoru/require.js file

I created my own define/require module system that works without the need to for a build process packager. Modules are based on the CommonJS format.

**Everything in Nori is a module** except for the main Nori object.

Define a module:
```javascript
define(‘MyApp.Module’,
  function (require, module, exports) {
		exports.method = function() { … };
  });
```

Require a module:

**Get a singleton instance**
```javascript
var module = require(‘MyApp.Module’);
```

**Get a unique instance**
```javascript
var module = requireUnique(‘MyApp.Module’);
```


# Nudoru Components / Utils

Collection of utility and helper classes.

## nudoru/components

A few view modules

## nudoru/events

EventDispatcher and EventCommandMap enable event driven functionality. Simple pub/sub system that can drive a command based controller.

+ A few core/common event "magic string" modules.

## nudoru/utils

Various utility classes. And these

- BrowserInfo, information on the current browser
- NLorem, Lorem Ipsum dummy text generator
- NTemplate, HTML templating system that uses Underscore
- Router, enables view routing from URL hash fragments