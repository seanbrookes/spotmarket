sm.Org.controller('OrgMainController', [
  '$scope',
  '$log',
  '$http',
  'OrgServices',
  '$stateParams',
  function($scope, $log, $http, OrgServices, $stateParams) {

    $scope.orgCtx = {
      isShowOrgProfileForm: false,
      isShowAllOrgList: true,
      currentOrgProfile: {}
    };

    $scope.orgCtx.loadOrgProfile = function(handle) {
      $scope.orgCtx.currentOrgProfile = OrgServices.findOrgByHandle(handle)
        .then(function(response) {
          if (response) {
            $scope.orgCtx.currentOrgProfile = response;
          }
        });

    };
    $scope.orgCtx.init = function() {
      if ($stateParams.handle) {
        $scope.orgCtx.loadOrgProfile($stateParams.handle);
      }
    };
    $scope.orgCtx.init();

  }


]);
