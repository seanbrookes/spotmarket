sm.Main.directive('smMainNav', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/main/templates/main.navigation.html',
      controller: [
        '$scope',
        'NAV_CONST',
        '$state',
        function($scope, NAV_CONST, $state) {
          if (!$scope.mainNavCtx) {
            $scope.mainNavCtx = {};
          }

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


          function isPage(viewName) {
            if (viewName === NAV_CONST.ABOUT_VIEW) {
              return true;
            }
            else if (viewName === NAV_CONST.BLOG_VIEW) {
              return true;
            }
            return false;

          }
          function getPageUrl(viewName) {

            switch(viewName) {
              case NAV_CONST.ABOUT_VIEW:
                return '/about.html';
              case NAV_CONST.BLOG_VIEW:
                return '/blog';
              default:
                return '/';
            }
          }
          function getStateForViewName(viewName) {
            switch(viewName) {
              case NAV_CONST.MARKET_VIEW:
                return 'market';
              case NAV_CONST.GEO_VIEW:
                return 'geo';
              case NAV_CONST.ASK_VIEW:
                return 'ask';
              case NAV_CONST.USER_VIEW:
                return 'userprofile';
              case NAV_CONST.ORG_VIEW:
                return 'org';
              default:
                return 'home';
            }
          }
          function getViewNameFromState(state) {
            switch(state) {
              case 'market':
                return NAV_CONST.MARKET_VIEW;
              case 'geo':
                return NAV_CONST.GEO_VIEW;
              case 'ask':
                return NAV_CONST.ASK_VIEW;
              case 'userprofile':
                return NAV_CONST.USER_VIEW;
              case 'org':
                return NAV_CONST.ORG_VIEW;
              default:
                return NAV_CONST.WELCOME_VIEW;
            }
          }

          $scope.mainNavCtx.activateView = function(event) {
            if (isValidView(event)) {
              var viewName = event.currentTarget.attributes['data-name'].value;
              $scope.mainNavCtx.activeView = viewName;
              if (isPage(viewName)) {
                document.location.href = getPageUrl(viewName);
              }
              else {
                var stateName = getStateForViewName(viewName);
                $state.go(stateName);
              }

            }
          };
          $scope.mainNavCtx.setActiveView = function(viewConst) {
            $scope.mainNavCtx.activeView = NAV_CONST[viewConst];
          };
          $scope.mainNavCtx.isActiveView = function(viewName) {
            return viewName === $scope.mainNavCtx.activeView;
          };

          $scope.mainNavCtx.init = (function() {
            var statt = $state.current.name;
            $scope.mainNavCtx.activeView = NAV_CONST.WELCOME_VIEW;
            if (statt) {
              $scope.mainNavCtx.activeView = getViewNameFromState(statt);
            }

          })();
        }
      ]
    }
  }
]);
