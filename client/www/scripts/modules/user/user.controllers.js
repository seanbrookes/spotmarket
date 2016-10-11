sm.User.controller('AskMainController', [
  '$scope',
  '$log',
  '$http',
  '$stateParams',
  'UserServices',
  function($scope, $log, $http, $stateParams, UserServices) {

    $scope.userCtx = {};
    $scope.userCtx = {
      isShowOrgProfileForm: false,
      currentOrgProfile: {}
    };

    $scope.userCtx.loadUserProfile = function(handle) {
      $scope.userCtx.currentOrgProfile = UserServices.findUserByHandle(handle)
        .then(function(response) {
          if (response) {
            $scope.userCtx.currentUserProfile = response;
          }
        });

    };
    $scope.userCtx.init = function() {
      if ($stateParams.handle) {
        $scope.userCtx.loadOrgProfile($stateParams.handle);
      }
    };
    $scope.userCtx.init();
  }


]);
