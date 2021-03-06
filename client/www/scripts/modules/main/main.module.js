if (!Array.prototype.filter) {
  Array.prototype.filter = function(fun /*, thisp*/) {
    var len = this.length >>> 0;
    if (typeof fun != "function")
      throw new TypeError();

    var res = [];
    var thisp = arguments[1];
    for (var i = 0; i < len; i++) {
      if (i in this) {
        var val = this[i]; // in case fun mutates this
        if (fun.call(thisp, val, i, this))
          res.push(val);
      }
    }
    return res;
  };
}
window.isLocal = function(){
  var host = window.location.hostname;
  var port = window.location.port;
  var isLocal = false;

  if (( host.indexOf('localhost') !== -1 ) || ( port === '4545' )) {
    isLocal = true;
  }

  return isLocal;
};
window.sm = {};

sm.Main = angular.module('Main', [
  'ui.router',
  'ngResource',
  'ngSanitize',
  'ngAnimate',
  'angular-growl',
  'angularSpinner',
  'angularTrix',
  'textAngular',
  'angularMoment',
  '720kb.datepicker',
  'leaflet-directive',
  'lbServices',
  'ngFileUpload',
  'UI',
  'ngCookies',
  'Acme',
  'Home',
  'Admin',
  'Market',
  'Crop',
  'Geo',
  'Tracking',
  'User',
  'Org',
  'Product',
  'Ask',
  'Common',
  'ui.utils'
]);

sm.Main.constant('ACTION_CONST', {
  LOGO_HOME: 'main logo home nav'
});

sm.Main.constant('NAV_CONST', {
  WELCOME_VIEW: 'WelcomeView',
  ABOUT_VIEW: 'AboutView',
  USER_VIEW: 'UserProfileView',
  ORG_VIEW: 'OrgView',
  MARKET_VIEW: 'MarketView',
  GEO_VIEW: 'GeoView',
  ASK_VIEW: 'AskView',
  BLOG_VIEW: 'BlogView'
});


sm.Main.constant('smGlobalConstants', {
  isLocal: false,
  productionUrlBase:'http://spotmarketapi.herokuapp.com/api/',
  localUrlBase: 'http://localhost:4546/api',
  productionSocketBase:'http://spotmarketapi.herokuapp.com/',
  localSocketBase: 'http://localhost:4546/'
});
/*

 - smHandle ( semi persistent user id (initial socket client id))
 - smSessionId ( session id )
 - smUserId ( unique user id associated with a ‘registration’ event / when we create a user account)
 - smEmail ( user primary email )
 - smAuthToken ( unique token generated when logging in, if it doesn’t exist the user is not logged in )
 - smTTL ( time to live for auth token, checked per request to see if expired, if not refresh it  )
 - isCurrentUserLoggedIn returns false if there is no smAuthToken

*/
sm.Main.value('smGlobalValues', {
    currentUser: {}
  }
);

sm.Main.config([
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
sm.Main.config(['$httpProvider', function($httpProvider) {
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
}
]);
sm.Main.config([
  '$stateProvider',
  '$urlRouterProvider',

  function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: './scripts/modules/home/templates/home.main.html'
      })
      .state('login', {
        url: '/login',
        templateUrl: './scripts/modules/user/templates/user.login.main.html'
      })
      .state('register', {
        url: '/register',
        templateUrl: './scripts/modules/user/templates/user.registration.main.html'
      })
      .state('termsconditions', {
        url: '/termsconditions',
        templateUrl: 'temrmsconditions.html'
      })
      .state('forgotpassword', {
        url: '/forgotpassword',
        templateUrl: './scripts/modules/user/templates/user.forgot.password.main.html'
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
      .state('testpage', {
        url: '/testpage',
        templateUrl: './scripts/modules/common/templates/common.test.main.html'
      })
      .state('blog', {
        url: '/blog',
        templateUrl: './scripts/modules/blog/templates/blog.main.html'
      })
      //.state('user', {
      //  url: '/user',
      //  templateUrl: './scripts/modules/user/templates/user.main.html'
      //})
      .state('userprofile', {
        url:'/user',
        templateUrl:'./scripts/modules/user/templates/user.profile.main.html'
      })
      .state('userprofile_detail', {
        url: '/user/:handle',
        templateUrl: './scripts/modules/user/templates/user.profile.main.html'
      })
      .state('userprofile.searchresults', {
        url: '/usersearch?query',
        templateUrl: './scripts/modules/user/templates/user.search.results.main.html'
      })
      .state('org', {
        url:'/org',
        templateUrl:'./scripts/modules/org/templates/org.main.html'
      })
      .state('org_profile', {
        url: '/org/:handle',
        templateUrl: './scripts/modules/org/templates/org.main.html'
      })
      .state('org_searchresults', {
        url: '/orgsearch/?query',
        templateUrl: './scripts/modules/org/templates/org.search.results.main.html'
      })
      .state('market', {
        url: '/market',
        templateUrl: './scripts/modules/market/templates/market.market.main.html'
      })
      .state('geo', {
        url: '/geo',
        templateUrl: './scripts/modules/geo/templates/geo.market.main.html'
      })
      .state('ask', {
        url: '/ask',
        templateUrl: './scripts/modules/ask/templates/ask.market.main.html'
      })
      .state('acme', {
        url: '/acme',
        templateUrl: './scripts/modules/acme/templates/acme.main.html'
      });

  }
]);
sm.Main.config([
  '$httpProvider',
  function ($httpProvider) {
    console.log('|');
    console.log('|');
    console.log('|  MAIN CONFIG 2 $httpProvider.interceptors');
    console.log('|');
    console.log('|');
//http://www.webdeveasy.com/interceptors-in-angularjs-and-useful-examples/
    $httpProvider.interceptors.push('smRequestInterceptor');
  }
]);
sm.Main.run([
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

    if (!UserSessionService.isCookiesEnabled()) {
      /*
       * NO COOKIE SUPPORT !!!
       *
       * */
      // track this issue
      $rootScope.trackRequest({action:'noCookieSupport'});

      $log.warn('Cookies do not appear to be  supported');

    }
    // first thing to check:  do we have an smToken?
    // if so then get the currentUserFromToken
    // if no token then create initial user
    var token = UserSessionService.getValueByKey('smToken');
    if (!token) {
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
      // generate initial user
      smGlobalValues.currentUser = UserServices.createInitialUserProfile()
        .then(function(initialUser) {
          $log.debug('Initial User created');
          if (initialUser && initialUser.smToken) {
            smGlobalValues.currentUser = initialUser;
            if (smGlobalValues.currentUser.smToken) {
              UserSessionService.setValueByKey('smToken',smGlobalValues.currentUser.smToken);
            }
          }
        });
    }
    else {
      // get user based on the token
      UserSessionService.getCurrentUserByToken(token)
        .then(function(currentUserResponse) {
          smGlobalValues.currentUser = currentUserResponse;
          if (smGlobalValues.currentUser.token) {
            UserSessionService.setValueByKey('smToken',smGlobalValues.currentUser.token);
          }
        });
    }


    /*
    *
    * this is where we need to ensure we have a valid smHandle
    * - check the cookie for user tracking information
    * - smHandle
    * - smEmail
    * - smUserName
    * - smUserId
    * - smToken
    *
    * */







    /*
    *
    * Global Methods
    *
    * */
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

        if (!data.meta) {
          data.meta = smGlobalValues.currentUser;
        }
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





