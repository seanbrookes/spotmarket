Admin.directive('smAdminMain', [
  function() {
    return {
      restrict:'E',
      templateUrl: './scripts/modules/admin/templates/admin.main.html'
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
