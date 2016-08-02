Market.controller('MarketMainController', [
  '$scope',
  '$log',
  'MARKET_CONST',
  function($scope, $log, MARKET_CONST) {
    $log.debug('Market Controller');

    $scope.marketCtx = {
      activeView: MARKET_CONST.ASK_VIEW
    };
    function isValidView(event) {
      var retVar = false;
      if (event && event.currentTarget) {
        if (event.currentTarget.attributes && event.currentTarget.attributes['data-name']) {
          if (event.currentTarget.attributes['data-name'].value) {
            retVar = true;
          }
        }
      }


      return retVar;
    }
    $scope.marketCtx.activateView = function(event) {
      if (isValidView(event)) {
        var viewName = event.currentTarget.attributes['data-name'].value;
        $log.debug('show me the view', viewName);
        $scope.marketCtx.activeView = viewName;
      }
    };
    $scope.marketCtx.isActiveView = function(viewName) {
      return viewName === $scope.marketCtx.activeView;
    }

  }

]);
