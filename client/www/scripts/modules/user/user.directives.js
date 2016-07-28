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

        ReactDOM.render(React.createElement(TrackedCommand, {scope:scope}), el[0]);

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
        'smSocket',
        'CommonServices',

        function($scope, $log, UserServices, UserSessionService, smSocket, CommonServices ) {

          smSocket.emit('fetchUserTag');

          smSocket.on('smUserTag', function(data) {
            //$log.debug('|');
            //$log.debug('|');
            //$log.debug('|  userTag', data);
            //$log.debug('|');
            //$log.debug('|');
          });

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

                smSocket.emit('sendEmail', emailToSubmit);

                UserServices.saveUser({email:emailToSubmit})
                  .then(function(response) {
                    $scope.contactCtx.isShowGreeting = false;
                    $scope.contactCtx.isShowContactForm = false;
                    $scope.contactCtx.isShowThankYou = true;
                    $scope.contactCtx.isShowCallToAction = true;

                  });

              }
              else {
                $scope.contactCtx.isShowValidation = true;
              }

            }
          };
          init();
          $scope.$parent.trackViewInit('smUserContactInput');
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

User.directive('smUserRegistration', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/user/templates/user.registration.html',
      controller: [
        '$scope',
        '$log',
        'UserServices',
        'smGlobalValues',
        function($scope, $log, UserServices, smGlobalValues) {
          if (!$scope.registrationCtx) {
            $scope.registrationCtx = {};
          }
          $scope.registrationCtx.submitRegistration = function() {

            if ($scope.registrationCtx.email && $scope.registrationCtx.password && $scope.registrationCtx.confirmPassword) {

              if ($scope.registrationCtx.password === $scope.registrationCtx.confirmPassword) {
                var tempCurrentUser = smGlobalValues.currentUser;
                if (smGlobalValues.currentUser && smGlobalValues.currentUser.smToken) {
                  // register existing user
                  $scope.registrationCtx.smToken = smGlobalValues.currentUser.smToken;
                  UserServices.registerExistingUser({user:$scope.registrationCtx})
                    .then(function(response) {
                      $scope.registrationCtx = {
                        registrationComplete: true
                      };
                    });
                }
                $log.debug('CREATE ACCOUNT: ', $scope.registrationCtx.email );

              }
              else {
                $log.warn('validation error: passwords do not match');
              }
            }

          };
          $scope.$parent.trackViewInit('smUserRegistration');
        }
      ]
    }
  }
]);
User.directive('smUserLogin', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/user/templates/user.login.html',
      controller: [
        '$scope',
        '$log',
        'UserSessionService',
        function($scope, $log, UserSessionService) {

          $scope.loginCtx = {
            isLoginActive:false
          };
          function resetLoginCtx() {
            $scope.loginCtx = {
              isLoginActive:false
            };
          }
          $scope.submitLoginRequest =  function() {
            $log.debug('submit login');
            if ($scope.loginCtx.email && $scope.loginCtx.password ) {
              UserSessionService.requestLoginToken($scope.loginCtx)
                .then(function(response) {
                  if (response.authToken) {
                    // save the token
                    UserSessionService.setValueByKey('smAuthToken', response.authToken);
                    // clear the login
                    resetLoginCtx();
                    // redirect if necessary
                  }
                })
            }

          };
          $scope.activateLogin = function() {
            $scope.loginCtx.isLoginActive = true;
          };


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
        function($scope, $log, UserServices) {
          if (!$scope.userCtx) {
            $scope.userCtx = {};
          }
          if (!$scope.userCtx.allUsers) {
            $scope.userCtx.allUsers = [];
          }
          smSocket.on('newMoreInfoSignUp', function(data) {
            $log.debug('you hea', data);
            $scope.userCtx.allUsers = data;

          });
        }
      ]
    }
  }
]);

