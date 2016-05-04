User.directive('ggtUserRegistration', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/user/templates/user.registration.html',
      controller: [
        '$scope',
        '$log',
        'UserServices',
        'socket',
        function($scope, $log, UserServices, socket) {
          if (!$scope.registrationCtx) {
            $scope.registrationCtx = {};
          }
          $scope.registrationCtx.submitRegistration = function() {

            if ($scope.registrationCtx.email && $scope.registrationCtx.password && $scope.registrationCtx.confirmPassword) {
              $log.debug('CREATE ACCOUNT: ', $scope.registrationCtx.email );
            }

          };

          //socket.on('newMoreInfoSignUp', function(data) {
          //  $log.debug('you hea', data);
          //  $scope.userCtx.allUsers = data;
          //
          //})
        }
      ]
    }
  }
]);
User.directive('ggtUserMoreInfoList', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/user/templates/user.list.html',
      controller: [
        '$scope',
        '$log',
        'UserServices',
        'socket',
        function($scope, $log, UserServices, socket) {
          if (!$scope.userCtx) {
            $scope.userCtx = {};
          }
          if (!$scope.userCtx.allUsers) {
            $scope.userCtx.allUsers = [];
          }
          socket.on('newMoreInfoSignUp', function(data) {
            $log.debug('you hea', data);
            $scope.userCtx.allUsers = data;

          })
        }
      ]
    }
  }
]);
User.directive('ggtUserMoreInfo', [
  function() {
    return {
      restrict:'E',
      templateUrl: './scripts/modules/user/templates/user.more.info.html',
      controller: [
        '$scope',
        '$log',
        'UserServices',
        'socket',
        function($scope, $log, UserServices, socket) {

          if (!$scope.userCtx) {
            $scope.userCtx = {};
          }
          if (!$scope.userCtx.allUsers) {
            $scope.userCtx.allUsers = [];
          }
          function loadUsers() {
            UserServices.getUsers()
              .then(function(response) {
                $scope.userCtx.allUsers = response;
                log.debug('all users', response);
              });
          }
          socket.on('newMoreInfoSignUp', function(data) {
            $log.debug('you hea 2', data);
            $scope.userCtx.allUsers = data;

          });
          $scope.submitMoreInfoEmail = function() {
            if ($scope.userCtx.moreInfoEmail) {
              var emailToSubmit = $scope.userCtx.moreInfoEmail;
              if (UserServices.isValidEmail(emailToSubmit)) {

                socket.emit('sendEmail', emailToSubmit);

                UserServices.saveUser({email:emailToSubmit})
                  .then(function(response) {
                    $log.debug('Submit Email', emailToSubmit);
                  });

              }
              else {
                $log.debug('Email address doesn\'t seem to vbe valid');
              }
            }
          }

        }
      ]
    }
  }
]);
