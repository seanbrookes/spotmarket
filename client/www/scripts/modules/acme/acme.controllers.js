Acme.controller('AcmeMainController', [
  '$scope',
  '$log',
  '$http',
  'AcmeServices',
  'UserProfile',
  function($scope, $log, $http, AcmeServices, UserProfile) {
    $log.debug('Hello World Acme Controller');

  }

]);
