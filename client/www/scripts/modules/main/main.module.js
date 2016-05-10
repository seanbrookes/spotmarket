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
  'User',
  'Product',
  'Ask',
  'Common',
  'ui.bootstrap',
  'ui.utils'
]);

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

  $rootScope.navRequest = function(state, options) {
    $state.go(state);
  };
  $rootScope.linkRequest = function(url) {
    console.log('Track This', url);
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


/*
*
*
*
*
myapp.config(function($httpProvider) {
 function exampleInterceptor($q, $log) {
 function success(response) {
 $log.info('Successful response: ' + response);
 return response;
 }
 function error(response) {
 var status = response.status;
 $log.error('Response status: ' + status + '. ' + response);
 return $q.reject(response); //similar to throw response;
 }
 return function(promise) {
 return promise.then(success, error);
 }
 }
 $httpProvider.responseInterceptors.push(exampleInterceptor);
 });
*
*
* */
