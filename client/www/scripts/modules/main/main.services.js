sm.Main.factory('smRequestInterceptor', [
  '$q',
  '$location',
  '$log',
  '$cookies',
  'smGlobalConstants',
  function ($q, $location, $log, $cookies, smGlobalConstants) {
    //$log.debug('|');
    $log.debug('|');
    $log.debug('|  MAIN FACTORY - REQUEST INTERCEPTOR host:', $location.host());
    $log.debug('|');
    //$log.debug('|');
    //$log.debug('|');
    //$log.debug('| REQUEST isLocal', isLocal($location.host()));
    //$log.debug('|');
    //$log.debug('|');
    smGlobalConstants.isLocal = window.isLocal();
    function isInternal(url, host){
      var isInternal = false;

      if ( url.indexOf('./') === 0 || url.indexOf('/') === 0 ) {
        isInternal = true;
      }
      return isInternal;
    }



    return {
      'request': function (config) {
        var ut = $cookies.get('smToken');
        var at = $cookies.get('smAuthToken');

        config.headers['sm-token'] = ut;
        if (at) {
          config.headers['sm-auth-token'] = at;
        }

        return config;
      },
      responseError: function (rejection) {
        if (rejection.status == 401) {

        }
        return $q.reject(rejection);
      }
    };
  }
]);
sm.Main.factory('smGeolocationService', [
  '$q',
  '$log',
  '$window',
  function ($q, $log, $window) {

  'use strict';

  function getCurrentPosition() {
    var deferred = $q.defer();

    if (!$window.navigator.geolocation) {
      // TODO track this
      $log.warn('Geolocation not support in user agent');
      deferred.reject('Geolocation not supported.');
    }
    else {
      $window.navigator.geolocation.getCurrentPosition(
        function (position) {
          deferred.resolve(position);
        },
        function (err) {
          deferred.reject(err);
        });
    }

    return deferred.promise;
  }

  return {
    getCurrentPosition: getCurrentPosition
  };
}]);
sm.Main.factory('smSocket',[
  '$rootScope',
  '$log',
  'smGlobalConstants',
  function ($rootScope, $log, smGlobalConstants) {


    var socket;
    if (smGlobalConstants.isLocal) {
      socket = io.connect(smGlobalConstants.localSocketBase);
    }
    else {
      socket = io.connect(smGlobalConstants.productionSocketBase);
    }


    return {
      on: function (eventName, callback) {
        socket.on(eventName, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      },
      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        })
      }
    };
  }
]);
