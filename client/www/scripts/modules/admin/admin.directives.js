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
Admin.directive('smAdminTracksRecent', [
  '$timeout',
  function($timeout) {
    return {
      restrict: 'E',
      controller: [
        '$scope',
        '$log',
        '$filter',
        'socket',
        'TrackingServices',
        function($scope, $log, $filter, socket, TrackingServices) {
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
          socket.on('broadCastTracks', function(data) {

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

          socket.emit('fetchTracks');
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
Admin.directive('smAdminUsersList', [

  function() {
    return {
      restrict:'E',
      templateUrl: './scripts/modules/admin/templates/admin.users.list.html',
      controller: [
        '$scope',
        'UserServices',
        'socket',
        function($scope, UserServices, socket) {

          $scope.currentUsers = [];
          socket.on('broadCastUsers', function(data) {
            $scope.currentUsers = data;
          });
          function init() {
            socket.emit('fetchUsers');
          }
          init();
        }
      ]
    }
  }
]);
