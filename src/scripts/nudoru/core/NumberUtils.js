define('Nudoru.Core.NumberUtils',
  function (require, module, exports) {

    module.exports.isInteger = function (str) {
      return (/^-?\d+$/.test(str));
    };

    module.exports.rndNumber = function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    module.exports.clamp = function (val, min, max) {
      return Math.max(min, Math.min(max, val));
    };

    module.exports.inRange = function (val, min, max) {
      return val > min && val < max
    };

    module.exports.distanceTL = function (point1, point2) {
      var xd = (point2.left - point1.left),
        yd = (point2.top - point1.top);

      return Math.sqrt((xd * xd) + (yd * yd));
    };

  });