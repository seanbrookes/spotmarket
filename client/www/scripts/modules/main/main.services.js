Main.factory('smRequestInterceptor', [
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
        var ut = $cookies.get('smUserTag');
        var at = $cookies.get('smAccessToken');



         //$log.debug('HTTP request intercepted', config);

        //if (at) {
        //  if (isLocal(config.url, $location.host())) {
        //    config.headers.authorization = at;
        //  } else {
        //    delete config.headers.authorization;
        //  }
        //}

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
Main.factory('smSocket',[
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
