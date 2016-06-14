window.isLocal = function(){
  var host = window.location.hostname;
  var isLocal = false;

  if ( host.indexOf('localhost') !== -1 ) {
    isLocal = true;
  }

  return isLocal;
};

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
  'Market',
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


Main.constant('smGlobalConstants', {
  isLocal: false,
  productionUrlBase:'//spotmarketapi.herokuapp.com/api/',
  localUrlBase: '//localhost:4546/api/',
  productionSocketBase:'//spotmarketapi.herokuapp.com/',
  localSocketBase: '//localhost:4546/'
});
/*

 - smUserTag ( semi persistent user id (initial socket client id))
 - smSessionId ( session id )
 - smUserId ( unique user id associated with a ‘registration’ event / when we create a user account)
 - smEmail ( user primary email )
 - smAuthToken ( unique token generated when logging in, if it doesn’t exist the user is not logged in )
 - smTTL ( time to live for auth token, checked per request to see if expired, if not refresh it  )
 - isCurrentUserLoggedIn returns false if there is no smAuthToken

*/
Main.value('smGlobalValues', {
    currentUser: {}
  }
);

Main.config([
  'LoopBackResourceProvider',
  'smGlobalConstants',
  function(LoopBackResourceProvider, smGlobalConstants) {

  // Use a custom auth header instead of the default 'Authorization'
  //LoopBackResourceProvider.setAuthHeader('X-Access-Token');

  var urlBase = '';

  //console.log('|   HOST CONFIG 3 ', window.location.hostname);


  if (window.isLocal()) {
    LoopBackResourceProvider.setUrlBase(smGlobalConstants.localUrlBase);
  }
  else {
    LoopBackResourceProvider.setUrlBase(smGlobalConstants.productionUrlBase);
  }
  /*
  *
    * var urlBase = "http://localhost:4546/api";
   //var urlBase = "http://spotmarketapi.herokuapp.com/api";
  * */

  // Change the URL where to access the LoopBack REST API server

}]);
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
Main.config([
  '$httpProvider',
  function ($httpProvider) {
    //console.log('|');
    //console.log('|');
    //console.log('|  MAIN CONFIG 2 $httpProvider.interceptors');
    //console.log('|');
    //console.log('|');
//http://www.webdeveasy.com/interceptors-in-angularjs-and-useful-examples/
    $httpProvider.interceptors.push('smRequestInterceptor');
  }
]);
Main.run([
  '$rootScope',
  '$state',
  'Track',
  'UserSessionService',
  'UserServices',
  '$log',
  'smSocket',
  '$cookies',
  'smGlobalValues',
  function($rootScope, $state, Track, UserSessionService, UserServices, $log, smSocket, $cookies, smGlobalValues) {

    $log.debug('|');
    $log.debug('|');
    $log.debug('| Main Run');
    $log.debug('|');
    $log.debug('|');
    if (!smGlobalValues.currentUser) {
      $log.warn('no currentUser defined');

    }
    /*
    *
    * this is where we need to ensure we have a valid smUserTag
    * - check the cookie for user tracking information
    * - smUserTag
    * - smEmail
    * - smUserName
    * - smUserId
    *
    * */

    // check if there is a
    if (!smGlobalValues.currentUser.smUserTag) {
      // generate a user
      smGlobalValues.currentUser.smUserTag = UserServices.createTaggedUser()
        .then(function(response) {
          $log.debug('User created');
          // then set the jwt
          // then store the jwt on the client
          // then initialize the socket connection / authentication
        });

    }
    else {
      // update the user last visit
      // then initialize the socket connection / authentication
    }



    smSocket.on('smRealTimeConnection', function(socketClientId) {
      $log.debug('|');
      $log.debug('|');
      $log.debug('| smRealTimeConnection');
      $log.debug('|');
      $log.debug('|');
      /*
      * NO COOKIE SUPPORT !!!
      *
      * */
      if (!UserSessionService.isCookiesEnabled()) {
        // track this issue
        $rootScope.trackRequest({action:'noCookieSupport', options:socketClientId});

        $log.warn('Cookies do not appear to be  supported');

        // TODO set global values currentUser values

        smGlobalValues.currentUser.smUserTag = socketClientId;

        smGlobalValues.currentUser.smSessionId = socketClientId;

        smGlobalValues.currentUser.smUserId = socketClientId;

      }



      else {
        // make sure smUserTag has been set in the coookie.
        // if not then set it

        var currentUser = UserServices.getCurrentUser();

        if (!currentUser.smUserTag) {
          currentUser.smUserTag = socketClientId;
          UserSessionService.putValueByKey('smUserTag', currentUser.smUserTag);
        }
        if (!currentUser.smSessionId) {
          currentUser.smSessionId = socketClientId;
          UserSessionService.putValueByKey('smSessionId', currentUser.smSessionId);
        }
        if (!currentUser.smUserId) {
          currentUser.smUserId = socketClientId;
          UserSessionService.putValueByKey('smUserId', currentUser.smSessionId);
        }
        else {
          // the user has a preset smUserId
          // we need to 'inflate' the user profile from the server
          UserSessionService.getUserSessionProfileById(currentUser.smUserId)
            .then(function(response) {
              if (response && response.length && response.length > 0) {
                $log.debug('we have a pre existing user');
              }
              else {
                $log.debug('we do not have a pre existing user');
                $log.debug('we should create one with this id: ', currentUser.smUserId);
                // we should create one
              }

          });
        }
        $log.debug('|   currentUser.smUserId', currentUser.smUserId);
      }

      /*
      *
      * Register the user
      *
      * - make sure we have an id from the server
      * - (what if we don't get an id)
      * - check if user allows cookies
      * - what if they don't
      * - pass the userid to the user sesssion service
      * - check if id already exists
      * - if so, then leave it
      * - if not then add to cookie
      * - ensure userprofile created or updated
      * - last visit / update visit count
      *
      * */
    });

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
    $rootScope.trackRequest = function(data) {
      if (data) {
        //
        //data.sessionId = getUserSessionId();
        //data.userId = UserSessionService.getUserId();
        //data.email = UserSessionService.getUserEmail();
        //data.appSessionId = UserSessionService.getAppSessionId();


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
    $rootScope.trackError = function(data) {
      if (data) {
        data.sessionId = UserSessionService.getUserSessionId();
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

  }
]);





