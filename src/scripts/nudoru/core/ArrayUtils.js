define('nudoru/core/ArrayUtils',
  function (require, module, exports) {

    var _numberUtils = require('nudoru/core/NumberUtils');

    module.exports.isArray = function (test) {
      return Object.prototype.toString.call(test) === "[object Array]";
    };

    // Reference: http://jhusain.github.io/learnrx/index.html
    module.exports.mergeAll = function () {
      var results = [];

      this.forEach(function (subArr) {
        subArr.forEach(function (elm) {
          results.push(elm);
        });
      });

      return results;
    };

    // http://www.shamasis.net/2009/09/fast-algorithm-to-find-unique-items-in-javascript-array/
    module.exports.unique = function (arry) {
      var o = {},
          i,
          l = arry.length,
          r = [];
      for (i = 0; i < l; i += 1) {
        o[arry[i]] = arry[i];
      }
      for (i in o) {
        r.push(o[i]);
      }
      return r;
    };

    module.exports.removeIndex = function (arr, idx) {
      return arr.splice(idx, 1);
    };

    module.exports.removeItem = function (arr, item) {
      var idx = arr.indexOf(item);
      if (idx > -1) {
        arr.splice(idx, 1);
      }
    };

    module.exports.rndElement = function (arry) {
      return arry[_numberUtils.rndNumber(0, arry.length - 1)];
    };

    module.exports.getRandomSetOfElements = function (srcarry, max) {
      var arry = [],
          i    = 0,
          len  = _numberUtils.rndNumber(1, max);

      for (; i < len; i++) {
        arry.push(this.rndElement(srcarry));
      }

      return arry;
    };

    module.exports.getDifferences = function (arr1, arr2) {
      var dif = [];

      arr1.forEach(function (value) {
        var present = false,
            i       = 0,
            len     = arr2.length;

        for (; i < len; i++) {
          if (value === arr2[i]) {
            present = true;
            break;
          }
        }

        if (!present) {
          dif.push(value);
        }

      });

      return dif;
    };

  });