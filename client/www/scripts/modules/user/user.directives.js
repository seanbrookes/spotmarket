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

        scope.$watch('disabled', function(newVal, oldVal) {
          if (newVal) {
            if (attrs.disabled && attrs.hasOwnProperty('disabled')) {
              var bool = ((scope.disabled === 'false') || (scope.disabled === false));
              if (!bool) {
                scope.disabled = 'disabled';
              }
            }
            ReactDOM.render(React.createElement(TrackedCommand, {scope:scope}), el[0]);

          }
        }, true);
      }
    }
  }
]);
User.directive('smUserContactInput', [
  '$timeout',
  function($timeout) {
    return {
      restrict:'E',
      templateUrl: './scripts/modules/user/templates/user.contact.input.html',
      controller: [
        '$scope',
        '$log',
        'UserServices',
        'UserSessionService',
        'socket',
        'CommonServices',

        function($scope, $log, UserServices, UserSessionService, socket, CommonServices ) {

          $scope.contactCtx = {
            visitMarketUrl: '/#/market',
            visitBlogUrl: '/blog',
            isShowGreeting: true,
            isShowThankYou: false,
            isShowValidation: false,
            isShowCallToAction: false,
            isShowContactForm: true,
            isSubmitButtonDisabled: true
          };

          $scope.isSubmitDisabled = function() {
            if ($scope.contactCtx.email) {
              $scope.contactCtx.isSubmitButtonDisabled = false;
            }
            return $scope.contactCtx.isSubmitButtonDisabled || false;
          };

          function init() {
            $scope.contactCtx.isShowValidation = false;
            $scope.contactCtx.isShowCallToAction = false;
            $scope.contactCtx.isShowThankYou = false;
            var currentUserEmail = UserSessionService.getUserEmail();
            if (currentUserEmail) { //  user has already submitted their email

              $scope.contactCtx.isShowGreeting = false;
              $scope.contactCtx.isShowContactForm = false;
              $scope.contactCtx.isShowCallToAction = true;
            }
          }


          $scope.postContactVisitBlogCallToAction = function() {
            $log.debug('Go to blog site');
          };
          $scope.postContactGotoMarketCallToAction = function() {

          };
          $scope.submitContactEmail = function() {
            if ($scope.contactCtx && $scope.contactCtx.email) {

              var emailToSubmit = $scope.contactCtx.email;
              if (UserServices.isValidEmail(emailToSubmit)) {

                socket.emit('sendEmail', emailToSubmit);

                UserServices.saveUser({email:emailToSubmit})
                  .then(function(response) {
                    $scope.contactCtx.isShowGreeting = false;
                    $scope.contactCtx.isShowContactForm = false;
                    $scope.contactCtx.isShowCallToAction = true;
                    $log.debug('Submit Email', emailToSubmit);
                  });

              }
              else {
                $scope.contactCtx.isShowValidation = true;
              }

            }
          };
          init();
        }

      ],
      link : function(scope, el, attrs) {
        scope.$watch('contactCtx.email', function(emailString, o) {
          $timeout(function() {
            if (!emailString) {
              scope.$apply(function() {
                scope.contactCtx.isSubmitButtonDisabled = true;

              });
            }
            else {
              scope.$apply(function() {
                scope.contactCtx.isSubmitButtonDisabled = false;

              });

            }

          }, 50);


        }, true);
      }
    }
  }
]);
User.directive('smTrackedCommandBak', [
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

        if (el.children(0)[0] && el.children(0)[0].tagName) {
          scope.childTag = el.children(0)[0].tagName;
          var attribDomObj = el.children(0)[0].attributes;
          scope.childAttributes = getReactElementAttributesFromDomObj(attribDomObj);
        }
        if (attrs.disabled && attrs.hasOwnProperty('disabled')) {
          scope.disabled = 'disabled';
        }
        ReactDOM.render(React.createElement(TrackedCommand, {scope:scope}), el[0]);

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

