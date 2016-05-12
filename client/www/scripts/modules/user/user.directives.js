User.directive('smTrackedCommand', [
  '$log',
  '$timeout',
  function($log, $timeout) {
    return {
      restrict: 'E',
      scope: {
        label: '@',
        action: '@',
        className: '@',
        disabled: '@'
      },
      link: function(scope, el, attrs) {


        function getReactElementAttributesFromDomObj(obj) {
          var retVar = {};

          if (obj && obj.length) {
            for (var i = 0;i < obj.length;i++) {
              var attributeName = obj[i].name;
              if (attributeName === 'class') {
                attributeName = 'className';
              }
              retVar[attributeName] = obj[i].value;
            }
          }
          return retVar;
        }
        $timeout(function() {
          if (el.children(0)[0] && el.children(0)[0].tagName) {
            scope.childTag = el.children(0)[0].tagName;
            var attribDomObj = el.children(0)[0].attributes;
            scope.childAttributes = getReactElementAttributesFromDomObj(attribDomObj);
          }
          if (attrs.disabled && attrs.hasOwnProperty('disabled')) {
            scope.disabled = 'disabled';
          }
          ReactDOM.render(React.createElement(TrackedCommand, {scope:scope}), el[0]);
        }, 100);
      }
    }
  }
]);
User.directive('smTrackLink', [
  function() {
    return {
      restrict: 'A',
      link:function(scope, el, attrs) {

      }
    }
  }
]);
User.directive('ggtTrackedCommand-bak', [
  '$log',
  function($log) {
    return {
      restrict: 'E',
      scope: {
        label: '=',
        ggtClick: '='
      },
      templateUrl: './scripts/modules/user/templates/tracked.command.button.html',
      link: function(scope, el, attrs) {
        $log.debug('TRACEKD Command', scope.label);
      }
    }
  }
]);
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
                $log.debug('Email address does not seem to be valid');
              }
            }
          }

        }
      ]
    }
  }
]);
