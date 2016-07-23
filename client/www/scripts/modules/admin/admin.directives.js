Admin.directive('smAdminMain', [
  function() {
    return {
      restrict:'E',
      templateUrl: './scripts/modules/admin/templates/admin.main.html',
      controller: ['AdminServices', function(AdminServices) {

      }]
    }
  }
]);
Admin.directive('smAdminProductType', [
  function() {
    return {
      restrict:'E',
      templateUrl: './scripts/modules/admin/templates/admin.product.type.html',
      controller: [
        '$scope',
        '$log',
        'AdminServices',
        'ProductServices',
        function($scope, $log, AdminServices, ProductServices) {
          $scope.productTypeCtx = {
            currentProductType : {
              name: ''
            },
            currentProductTypes: []
          };
          function resetCurrentProductType() {
            $scope.productTypeCtx.currentProductType = {name:''};
          }
          function loadCurrentProductTypes() {
            $scope.productTypeCtx.currentProductTypes = ProductServices.getProductTypes()
              .then(function(allProductTypes) {
                $scope.productTypeCtx.currentProductTypes = allProductTypes;
              });
          }
          $scope.editProductType = function(productType) {
            if (productType.name) {
              $scope.productTypeCtx.currentProductType = productType;
            }

          };
          $scope.deleteProductType = function(id) {
            if (confirm('delete product type?')) {
              // what about the implication of existing and historical asks and their product type name references
              $log.debug('this functionality needs more consideration before implementation');
            }
          };

          $scope.saveCurrentProductType = function() {
            if ($scope.productTypeCtx.currentProductType.name) {
              ProductServices.saveProductType($scope.productTypeCtx.currentProductType)
                .then(function(saveProductTypeResponse) {
                  resetCurrentProductType();
                  loadCurrentProductTypes();
                });
            }
          };

          function init() {
            loadCurrentProductTypes();
          }
          init();
        }
      ]
    }
  }
]);
Admin.directive('smAdminTracksRecent', [
  '$timeout',
  function($timeout) {
    return {
      restrict: 'E',
      controller: [
        '$scope',
        '$log',
        '$filter',
        'smSocket',
        'TrackingServices',
        function($scope, $log, $filter, smSocket, TrackingServices) {
          $scope.trackAdminCtx = {
            recentTracks: []
          };


          $scope.titleSearchValue = '';
          $scope.isFilterChanged = false;
          $scope.sortDir = {};
          $scope.sortDir['action'] = true;
          $scope.sortDir['options'] = true;
          $scope.sortDir['email'] = true;
          $scope.sortDir['userAgent'] = true;
          $scope.sortDir['sessionId'] = true;
          $scope.sortDir['language'] = true;
          $scope.sortDir['userName'] = true;
          $scope.sortDir['referer'] = true;
          $scope.isReverse = function(colName) {
            return $scope.sortDir[colName] = !$scope.sortDir[colName];
          };
          $scope.sortTracks = function(colName) {
            $scope.currentTracks = $filter('orderBy')($scope.currentTracks, colName, $scope.isReverse(colName));
          };


          $scope.currentTracks = [];
          smSocket.on('broadCastTracks', function(data) {

            if (data && data.map) {
              data.map(function(trackItem) {
                if (!trackItem.meta) {
                  trackItem.meta = {};
                }
                trackItem.email = trackItem.meta.smEmail || '';
                trackItem.userAgent = trackItem.headers['user-agent'];
                trackItem.sessionId = trackItem.meta.smTraceId || '';
                trackItem.language = trackItem.headers['accept-language'];
                trackItem.userName = trackItem.meta.currentUserName || '';
                trackItem.referer = trackItem.headers.referer;
              })
            }
            data = $filter('orderBy')(data, 'timestamp', true);

            $scope.trackAdminCtx.recentTracks = data;
            $scope.currentTracks = $scope.trackAdminCtx.recentTracks;



          });

          smSocket.emit('fetchTracks');
          //$scope.trackAdminCtx.recentTracks = TrackingServices.getRecentTracks()
          //  .then(function (response) {
          //
          //  });
        }
      ],
      link: function(scope, el, attrs) {

        scope.$watch('currentTracks', function(newVal, oldVal) {
          $timeout(function() {
            ReactDOM.render(React.createElement(RecentTracks, {scope:scope}), el[0]);

          }, 400);
        });
      }
    }
  }
]);

/*
*
*
* app.controller( 'MainCtrl', function( $scope, AuthService ) {
 $scope.$watch( AuthService.isLoggedIn, function ( isLoggedIn ) {
 $scope.isLoggedIn = isLoggedIn;
 $scope.currentUser = AuthService.currentUser();
 });
 });
*
* */
Admin.directive('smAdminUsersList', [

  function() {
    return {
      restrict:'E',
      templateUrl: './scripts/modules/admin/templates/admin.users.list.html',
      controller: [
        '$scope',
        'UserServices',
        'smSocket',
        'UserSessionService',
        function($scope, UserServices, smSocket, UserSessionService) {

          $scope.$watch( UserSessionService.isLoggedIn, function ( isLoggedIn ) {
            $scope.isLoggedIn = isLoggedIn;
            $scope.currentUser = UserSessionService.getCurrentUserFromClientState();
          });

          $scope.currentUsers = [];
          smSocket.on('broadCastUsers', function(data) {
            $scope.currentUsers = data;
          });
          function init() {
            smSocket.emit('fetchUsers');
          }
          init();
        }
      ]
    }
  }
]);
