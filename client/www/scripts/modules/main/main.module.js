var Main = angular.module('Main', [
  'ui.router',
  'ngResource',
  'ngSanitize',
  'ngAnimate',
  'angular-growl',
  'angularSpinner',
  'lbServices',
  'ngCookies',
  'Acme',
  'Home',
  'Admin',
  'Tracking',
  'User',
  'Product',
  'Ask',
  'Common',
  'ui.bootstrap',
  'ui.utils'
]);

Main.constant('ACTION_CONST', {
  LOGO_HOME: 'main logo home nav'
});

Main.config([
  '$stateProvider',
  '$urlRouterProvider',

  function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: './scripts/modules/home/templates/home.main.html'
      })
      .state('register', {
        url: '/register',
        templateUrl: './scripts/modules/user/templates/user.registration.main.html'
      })
      .state('product', {
        url: '/product',
        templateUrl: './scripts/modules/product/templates/product.main.html'
      })
      .state('hopreport', {
        url: '/hopreport',
        templateUrl: './scripts/modules/common/templates/hop.farm.report.html'
      })
      .state('admin', {
        url: '/admin',
        templateUrl: './scripts/modules/admin/templates/admin.main.html'
      })
      .state('blog', {
        url: '/blog',
        templateUrl: './scripts/modules/blog/templates/blog.main.html'
      })
      .state('market', {
        url: '/market',
        templateUrl: './scripts/modules/market/templates/market.main.html'
      })
      .state('user', {
        url: '/user',
        templateUrl: './scripts/modules/user/templates/user.main.html'
      })
      .state('ask', {
        url: '/ask',
        templateUrl: './scripts/modules/ask/templates/ask.main.html'
      })
      .state('acme', {
        url: '/acme',
        templateUrl: './scripts/modules/acme/templates/acme.main.html'
      });

  }
]);

Main.run([
  '$rootScope',
  '$state',
  'Track',
  'UserSessionService',
  '$log',
  function($rootScope, $state, Track, UserSessionService, $log) {

  function getUserSessionId() {

  }
  function getUserId() {
    // check the cookie and return smUserId if found
  }
  function getUserEmail() {
    // check the cookie and return smEmail if found

  }
  function getUserAppSessionId() {
    // check the cookie and return smUserAppSessionId if found

  }

  $rootScope.navRequest = function(state) {
    $rootScope.trackRequest({action:'navRequest', options:state});
    $state.go(state);
  };
  $rootScope.trackViewInit = function(viewName) {
    $rootScope.trackRequest({action:'viewInit', options:viewName});
  };
  $rootScope.linkRequest = function(url) {
    $rootScope.trackRequest({action:'linkRequest', options:url});
  };
  $rootScope.trackError = function(data) {
    if (data) {
      data.sessionId = getUserSessionId();
      data.userId = UserSessionService.getUserId();
      data.email = UserSessionService.getUserEmail();
      data.appSessionId = UserSessionService.getAppSessionId();
      Track.addErrorTrack({track:data})
        .$promise
        .then(function(response) {
          var trackResponse = JSON.parse(response.ack);
          $log.debug('ERROR Track', trackResponse);
        })
        .catch(function(error) {
          $log.warn('bad create track', error);
        });
    }
  };
  $rootScope.trackRequest = function(data) {
    if (data) {

      data.sessionId = getUserSessionId();
      data.userId = UserSessionService.getUserId();
      data.email = UserSessionService.getUserEmail();
      data.appSessionId = UserSessionService.getAppSessionId();


//      {sessionId:'xyasdfaklsdjfasfdlkj5233524-234234lsdfsdfs',actionMethod:actionMethod, actionData:action.toString(),  userId: 'r4rrwr-wrwer--wesdfsdfs-sdvdfwer-wers', userName:'centrinoblue', email:'sean@greengrowtech.ca'}

      Track.addTrack({track:data})
        .$promise
        .then(function(response) {
          var trackResponse = JSON.parse(response.ack);
          $log.debug('Good Track', trackResponse);
        })
        .catch(function(error) {
          $log.warn('bad create track', error);
        });
    }
  };
}]);


Main.config([
  '$httpProvider',
  function ($httpProvider) {
    $httpProvider.interceptors.push('smRequestInterceptor');
  }
]);

Main.factory('smRequestInterceptor', [
  '$q',
  '$location',
  '$log',
  '$cookieStore',
  function ($q, $location, $log, $cookieStore) {
    function isLocal(url, host){
      var isLocal = false;

      if ( url.indexOf('./') === 0 || url.indexOf('/') === 0 ) {
        isLocal = true;
      } else if ( url.indexOf(host) > -1 ) {
        isLocal = true;
      }

      return isLocal;
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
