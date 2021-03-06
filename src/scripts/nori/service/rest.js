/**
 * Ajax / Rest module.
 * Returns an RxJS Obervable
 *
 * Usage:
 *
 var request = require('nori/service/Rest');

 var getSub = request.request({
        method: 'GET',
        url   : '/items',
        json  : true
      }).subscribe(
 function success(data) {
          console.log('ok', data);
        },
 function error(data) {
          console.log('err', data);
        });

 var postSub = request.request({
        method: 'POST',
        url   : '/items',
        data  : JSON.stringify({key: 'value'}),
        json  : true
      }).subscribe(
 function success(data) {
          console.log('ok', data);
        },
 function error(data) {
          console.log('err', data);
        });

 var putSub = request.request({
        method: 'PUT',
        url   : '/items/42',
        data  : JSON.stringify({key: 'value'}),
        json  : true
      }).subscribe(
 function success(data) {
          console.log('ok', data);
        },
 function error(data) {
          console.log('err', data);
        });

 var delSub = request.request({
        method: 'DELETE',
        url   : '/items/42',
        json  : true
      }).subscribe(
 function success(data) {
          console.log('ok', data);
        },
 function error(data) {
          console.log('err', data);
        });
 *
 */

define('nori/service/Rest',
  function (require, module, exports) {

    /**
     * Ajax requst using Promises
     * @param reqObj
     * @param success
     * @param error
     */
    function request(reqObj) {
      var xhr    = new XMLHttpRequest(),
          json   = reqObj.json || false,
          method = reqObj.method.toUpperCase() || 'GET',
          url    = reqObj.url,
          data   = reqObj.data || null;

      //return new Promise(function (resolve, reject) {
      return new Rx.Observable.create(function(observer) {
        xhr.open(method, url, true, reqObj.user, reqObj.password);

        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                if (json) {
                  observer.onNext(JSON.parse(xhr.responseText));
                } else {
                  observer.onError(xhr.responseText);
                }
              }
              catch (e) {
                handleError('Result', 'Error parsing JSON result');
              }
            } else {
              handleError(xhr.status, xhr.statusText);
            }
          }
        };

        xhr.onerror   = function () {
          handleError('Network error');
        };
        xhr.ontimeout = function () {
          handleError('Timeout');
        };
        xhr.onabort   = function () {
          handleError('About');
        };

        // set non json header? 'application/x-www-form-urlencoded; charset=UTF-8'
        if (json && method !== "GET") {
          xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        } else if (json && method === "GET") {
          xhr.setRequestHeader("Accept", "application/json, text/*; odata=verbose");  // odata param for Sharepoint
        }

        xhr.send(data);

        function handleError(type, message) {
          message = message || '';
          observer.onError(type + ' ' + message);
        }
      });

    }

    module.exports.request   = request;

  });