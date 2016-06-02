Main.factory('smRequestInterceptor', [
  '$q',
  '$location',
  '$log',
  '$cookieStore',
  'globalValues',
  function ($q, $location, $log, $cookieStore, globalValues) {
    //$log.debug('|');
    //$log.debug('|');
    //$log.debug('|  MAIN FACTORY - REQUEST INTERCEPTOR host:', $location.host());
    //$log.debug('|');
    //$log.debug('|');
    //$log.debug('|');
    //$log.debug('| REQUEST isLocal', isLocal($location.host()));
    //$log.debug('|');
    //$log.debug('|');
    globalValues.isLocal = window.isLocal();
    function isInternal(url, host){
      var isInternal = false;

      if ( url.indexOf('./') === 0 || url.indexOf('/') === 0 ) {
        isInternal = true;
      }
      return isInternal;
    }



    return {
      'request': function (config) {
        var at = $cookieStore.get('smAccessToken');



        // $log.debug('HTTP request intercepted', config);

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
Main.factory('socket',[
  '$rootScope',
  '$log',
  'globalValues',
  function ($rootScope, $log, globalValues) {


  var socket;
  if (globalValues.isLocal) {
    socket = io.connect(globalValues.localSocketBase);
  }
  else {
    socket = io.connect(globalValues.productionSocketBase);
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
}]);
