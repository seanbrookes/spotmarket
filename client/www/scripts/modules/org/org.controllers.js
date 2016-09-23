Org.controller('OrgMainController', [
  '$scope',
  '$log',
  '$http',
  'ProductServices',
  function($scope, $log, $http, ProductServices) {

    $scope.orgCtx = {
      isShowOrgProfileForm: false
    };

  }


]);
