Main.controller('MainController', [
  '$scope',
  '$log',
  'NAV_CONST',
  '$rootScope',
  '$timeout',
  function($scope, $log, NAV_CONST, $rootScope, $timeout){
    $log.debug('Main Controller');
    //$scope.mainNavCtx = {
    //  activeView: NAV_CONST.MARKET_VIEW
    //};
    $scope.mainNavCtx = {
      activeView: NAV_CONST.WELCOME_VIEW
    };
    $rootScope.$on('$stateChangeStart',
      function(event, toState, toParams, fromState, fromParams, options){
        $log.debug('|');
        $log.debug('|');
        $log.debug('|   CHANGE STATE ', toState.name);
        if (toState.name === 'home') {
          $timeout(function() {
            $scope.mainNavCtx.isHome = true;
          }, 25);
        }
        else {
          $scope.mainNavCtx.isHome = false;
        }
        $log.debug('|');
        $log.debug('|');
      }
    );
    $scope.mainNavCtx.isHome = false;
    $log.debug('Main Controller after  SET CLASS ON BODY');

  }]);
