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

Main.run(function($rootScope, $state) {
  $rootScope.navRequest = function(state, options) {
    $state.go(state);
  };
});
