Org.directive('smOrgProfileMain', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/org/templates/org.profile.main.html',
      controler: [
        '$scope',
        '$log',
        '$stateParams',
        function($scope, $log, $stateParams) {

          $scope.init = function() {
            if ($stateParams.handle) {
              // could be id or handle
              //
              // populate editor
            }
          };

        }
      ]
    }
  }
]);
Org.directive('smOrgListView', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/org/templates/org.list.view.html',
      controller: [
        '$scope',
        '$log',
        'OrgServices',
        function($scope, $log, OrgServices) {

          $scope.orgListCtx = {
            currentOrgList: []
          };
          $scope.orgListCtx.init = function() {
            OrgServices.getOrgs({})
              .then(function(response) {
                if (response && response.map) {
                  $scope.orgListCtx.currentOrgList = response;
                }
              })
          };
          $scope.orgListCtx.init();
        }
      ]
    }
  }
]);
Org.directive('smOrgSearchResultsView', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/org/templates/org.search.results.view.html',
      controller: [
        '$scope',
        '$log',
        '$stateParams',
        function($scope, $log, $stateParams) {
          $scope.orgSearchCtx = {
            results: []
          };
          $scope.orgSearchCtx.searchOrgs = function() {
            if ($scope.orgSearchCtx.currentSearch && $scope.orgSearchCtx.currentSearch.query) {
              OrgServices.searchOrgs($scope.orgSearchCtx.currentSearch.query)
                .then(function(response) {
                  if (response && response.map) {
                    $scope.orgSearchCtx.results = response;
                  }
                })
            }
          };

          $scope.orgSearchCtx.init = function() {
            if ($stateParams.query) {
              if (!$scope.orgSearchCtx.currentSearch) {
                $scope.orgSearchCtx.currentSearch = {};
              }
              $scope.orgSearchCtx.currentSearch.query = $stateParams.query;
              $scope.orgSearchCtx.searchOrgs();
            }
          };
          $scope.orgSearchCtx.init();

        }
      ]
    }
  }
]);
Org.directive('smOrgProfileView', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/org/templates/org.profile.view.html',
      controller: [
        '$scope',
        'Upload',
        'OrgSessionService',
        'OrgServices',
        '$log',
        '$stateParams',
        '$state',
        function($scope, Upload, OrgSessionService, OrgServices, $log, $stateParams, $state) {
          $scope.orgProfileCtx = {avatarSrc:'', croppedImage:''};
          $scope.orgProfileCtx.currentProfile = {};
          $scope.profileAvatar = {
            userId:'',
            avatarImg: ''
          };

          $scope.orgProfileCtx.triggerCreateNewOrg = function() {
            $scope.orgCtx.isShowOrgProfileForm = true;
          };
          $scope.orgProfileCtx.cancelNewOrgProfile = function() {
            $scope.orgCtx.isShowOrgProfileForm = false;
            $scope.orgProfileCtx.currentProfile = {};
          };


          $scope.myImage='';
          $scope.orgProfileCtx.myCroppedImage = '';
          $scope.orgProfileCtx.currentProfile = {
            avatarImage: ''
          };
          $scope.orgProfileCtx.isEditMode = false;
          $scope.orgProfileCtx.toggleEditMode = function() {
            if (!$scope.orgProfileCtx.isEditMode && OrgSessionService.isCurrentOrgLoggedIn()) {
              $scope.orgProfileCtx.isEditMode = true;
            }
            else if (!$scope.orgProfileCtx.isEditMode && !OrgSessionService.isCurrentOrgLoggedIn()) {
              $state.go('login');
            }
            else {
              $scope.orgProfileCtx.isEditMode = false;
            }
          };
          $scope.orgProfileCtx.isEditCurrentOrg = function() {
            return $scope.orgProfileCtx.isEditMode;
          };
          $scope.orgProfileCtx.saveCurrentProfile = function() {
            OrgServices.saveOrg($scope.orgProfileCtx.currentProfile)
              .then(function(response) {
                $log.debug('Save my profile');
                $scope.orgProfileCtx.isEditMode = false;
                $scope.orgProfileCtx.currentProfile = {};
              });
          };

          $scope.orgProfileCtx.isReadOnlyCurrentOrg = function() {
            // am I current user
            if ((!$stateParams.handle) && (!$scope.orgProfileCtx.isEditMode)) {
              return true;
            }
            return false;
            // is the form in edit mode
          };

          $scope.orgProfileCtx.saveProfileImage = function() {
            $log.debug('|  Save the Profile Image ', $scope.orgProfileCtx.myCroppedImage );
            var profileAvatarUpdate = {
              userId: $scope.orgProfileCtx.currentProfile.userId
            };
            if ($scope.orgProfileCtx.currentProfile.avatarId) {
              profileAvatarUpdate.id = $scope.orgProfileCtx.currentProfile.avatarId;
            }
            profileAvatarUpdate.avatarImage = $scope.orgProfileCtx.myCroppedImage;
            OrgServices.saveProfileAvatar(profileAvatarUpdate)
              .then(function(response) {
                document.location.reload();
              })
              .catch(function(error) {
                $log.warn('bad save profile avatar ', error);
              });


          };

          var handleFileSelect = function(evt) {
            var file = evt.currentTarget.files[0];
            var reader = new FileReader();
            reader.onload = function (evt) {
              $scope.$apply(function($scope){
                $scope.orgProfileCtx.avatarSrc = evt.target.result;
              });
            };
            reader.readAsDataURL(file);
          };


          angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);



          $scope.orgProfileCtx.triggerEditMode = function() {
            $scope.orgProfileCtx.isEditMode = true;
          };

          $scope.orgProfileCtx.init = function() {


            // check if we have an id/handle param
            // if so then load up that user data
            // if not load current user data
            // provide edit button


            if ($stateParams.handle) {
              // could be id or handle
              //
              // populate editor
              $log.debug('LOOKUP PROFILE BY HANDLE');
            }
            else {
              $log.debug('WE ARE THIS USER');
              // check if current user has a profile avatar

            }





          };
          $scope.orgProfileCtx.init();
        }

      ],
      link: function(scope, el, attrs) {



      }
    }
  }
]);

Org.directive('smTrackedCommand', [
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

        ReactDOM.render(React.createElement(sm.TrackedCommand, {scope:scope}), el[0]);

        scope.$watch('disabled', function(newVal, oldVal) {
          if (newVal) {
            if (attrs.disabled && attrs.hasOwnProperty('disabled')) {
              var bool = ((scope.disabled === 'false') || (scope.disabled === false));
              if (!bool) {
                scope.disabled = 'disabled';
              }
            }
            ReactDOM.render(React.createElement(sm.TrackedCommand, {scope:scope}), el[0]);
          }
        }, true);
      }
    }
  }
]);
Org.directive('smOrgContactInput', [
  '$timeout',
  'CommonServices',
  function($timeout, CommonServices) {
    return {
      restrict:'E',
      templateUrl: './scripts/modules/org/templates/org.contact.input.html',
      controller: [
        '$scope',
        '$log',
        'OrgServices',
        'OrgSessionService',
        'smSocket',
        function($scope, $log, OrgServices, OrgSessionService, smSocket ) {

          smSocket.emit('fetchOrgTag');

          smSocket.on('smHandle', function(data) {
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

          function init() {
            $scope.contactCtx.isShowValidation = false;
            $scope.contactCtx.isShowCallToAction = false;
            $scope.contactCtx.isShowThankYou = false;
            var currentOrgEmail = OrgSessionService.getValueByKey('smEmail');
            if (currentOrgEmail) { //  user has already submitted their email

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
              if (OrgServices.isValidEmail(emailToSubmit)) {

                smSocket.emit('sendEmail', emailToSubmit);
                var currentOrg = OrgSessionService.getCurrentOrgByToken()
                  .then(function(currentOrg) {
                    // check if currentOrg has existing email
                    if (currentOrg && currentOrg.email && (currentOrg.email !== emailToSubmit)) {
                      // if so create alias with existing email
                      //  CREATE ALIAS HERE

                      OrgServices.saveEmailAlias(currentOrg);
                    }
                    currentOrg.email = emailToSubmit;
                    OrgSessionService.setValueByKey('smEmail', emailToSubmit);
                    // reset email to new value
                    OrgServices.saveOrg(currentOrg)
                      .then(function(response) {
                        $scope.contactCtx.isShowGreeting = false;
                        $scope.contactCtx.isShowContactForm = false;
                        $scope.contactCtx.isShowThankYou = true;
                        $scope.contactCtx.isShowCallToAction = true;

                      });
                  });



              }
              else {
                $scope.contactCtx.isShowValidation = true;
              }

            }
          };
          init();
          $scope.$parent.trackViewInit('smOrgContactInput');
        }

      ],
      link : function(scope, el, attrs) {
        scope.$watch('contactCtx.email', function(emailString, o) {
          if (emailString) {
            $timeout(function() {
              scope.contactCtx.isSubmitButtonDisabled = !CommonServices.isValidEmail(emailString);
            }, 50);
          }
        }, true);
      }
    }
  }
]);

Org.directive('smOrgRegistration', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/org/templates/org.registration.html',
      controller: [
        '$scope',
        '$log',
        'OrgServices',
        'OrgSessionService',
        'smGlobalValues',
        '$state',
        function($scope, $log, OrgServices, OrgSessionService, smGlobalValues, $state) {
          if (!$scope.registrationCtx) {
            $scope.registrationCtx = {};
          }
          $scope.registrationCtx.isExistingEmail = false;
          $scope.registrationCtx.urlNavRequest = function(state) {
            $state.go(state);
          };
          $scope.registrationCtx.clearCurrentOrg = function() {
            OrgSessionService.clearCurrentCacheOrg();
            window.location.reload();

          };
          $scope.registrationCtx.submitRegistration = function() {

            if (!$scope.registrationCtx.agreeTAC) {
              $log.warn('you need to agree to the terms and conditions');
              return;
            }
            if (!OrgServices.isValidEmail($scope.registrationCtx.email)) {
              $log.warn('email address does not seem to be valid');
              return;
            }
            if (!$scope.registrationCtx.password || !$scope.registrationCtx.confirmPassword) {
              $log.warn('you need to supply a password');
              return;
            }
            if ($scope.registrationCtx.password !== $scope.registrationCtx.confirmPassword) {
              $log.warn('the passwords do not match');
              return;
            }
            // check if user already has an account
            OrgServices.findOrgByEmail($scope.registrationCtx.email)
              .then(function(response) {
                if (response && response.length > 0) {
                  $log.warn('email address already linked to an account');
                  return;
                }
                var tempCurrentOrg = OrgSessionService.getCurrentOrgFromClientState();
                if (tempCurrentOrg && tempCurrentOrg.smToken) {
                  // register existing user
                  $scope.registrationCtx.smToken = tempCurrentOrg.smToken;
                  OrgSessionService.registerExistingOrg({user:$scope.registrationCtx})
                    .then(function(response) {
                      $log.debug('Account created ', $scope.registrationCtx.email );
                      $scope.registrationCtx.registrationComplete = true;
                    });
                }
              });

          };
          $scope.registrationCtx.init = function() {
            var currOrg = OrgSessionService.getCurrentOrgFromClientState();
            if (currOrg.smAuthToken) {
              $state.go('home');
            }
            if (currOrg.smHandle) {
              $scope.registrationCtx.handle = currOrg.smHandle;
              $scope.registrationCtx.isPreExistingHandle = true;
            }
            if (currOrg.smEmail) {
              $scope.registrationCtx.isExistingEmail = true;
              $scope.registrationCtx.email = currOrg.smEmail;
            }
          };
          $scope.registrationCtx.init();
        }
      ]
    }
  }
]);

Org.directive('smOrgHandle', [
  function() {
    return {
      restrict: 'E',
      scope: {
        ctx:'='
      },
      templateUrl: './scripts/modules/org/templates/org.handle.html',
      controller: [
        '$scope',
        'OrgServices',
        'OrgSessionService',
        function($scope, OrgServices, OrgSessionService) {
          $scope.handleCtx = {};
          $scope.handleCtx.handleSuggestionHistory = [];
          $scope.handleCtx.handleSuggestionHistoryIndex = 0;
          $scope.handleCtx.handleSearchDefaultHandleAlphaOnly = false;

          /*
           *
           * HANDLE GENERATOR METHODS
           *
           * */
          $scope.handleCtx.refreshSuggestedHandle = function () {
            var options = {aphaOnly: $scope.handleCtx.handleSearchDefaultHandleAlphaOnly};
            $scope.handleCtx.currentHandle = OrgSessionService.generateNewOrgTag(options)
              .then(function (response) {
                $scope.handleCtx.currentHandle = response;
                OrgSessionService.addOrgHandleSuggestionToHistory($scope.handleCtx.currentHandle);
                $scope.handleCtx.handleSuggestionHistoryIndex = 0;
              });
          };
          $scope.handleCtx.goBackOneHandleSuggestion = function () {
            var currentHistory = $scope.handleCtx.handleSuggestionHistory = OrgSessionService.getOrgHandleSuggestionHistory();
            var currentIndex = $scope.handleCtx.handleSuggestionHistoryIndex;

            var historyLength = currentHistory.length;

            if (historyLength > 0) {
              if (currentIndex !== (historyLength - 1)) {
                currentIndex = $scope.handleCtx.handleSuggestionHistoryIndex = (currentIndex + 1);
                $scope.handleCtx.currentHandle = currentHistory[currentIndex];
              }

            }
          };
          $scope.handleCtx.goForwardOneHandleSuggestion = function () {
            var currentHistory = $scope.handleCtx.handleSuggestionHistory = OrgSessionService.getOrgHandleSuggestionHistory();
            var currentIndex = $scope.handleCtx.handleSuggestionHistoryIndex;

            var historyLength = currentHistory.length;

            if (historyLength > 0) {
              if (currentIndex !== 0) {
                currentIndex = $scope.handleCtx.handleSuggestionHistoryIndex = (currentIndex - 1);
                $scope.handleCtx.currentHandle = currentHistory[currentIndex];
              }

            }
          };
          $scope.handleCtx.toggleAlphaOnly = function() {

          };

          $scope.handleCtx.init = function(user) {
            if (!user) {
              user = OrgSessionService.getCurrentOrgFromClientState();
            }
            if (user.smHandle) {
              $scope.handleCtx.currentHandle = user.smHandle;
            }
            else {
              // generate default handle
              $scope.handleCtx.refreshSuggestedHandle();
            }
          };
          $scope.handleCtx.init();
          // end handle generation methods
        }
      ],
      link: function(scope, el, attrs) {
        scope.$watch('handleCtx.currentHandle', function(newVal, oldVal) {
          if (newVal) {
            scope.ctx.handle = newVal;
          }
        }, true);
      }
    }
  }
]);
Org.directive('smOrgLogin', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/org/templates/org.login.html',
      controller: [
        '$scope',
        '$log',
        'OrgSessionService',
        '$state',
        function($scope, $log, OrgSessionService, $state) {

          $scope.loginCtx = {
            isLoginActive:false,
            isOrgAuth:false,
            rememberMe:true
          };

          $scope.loginCtx.init = function() {
            if (OrgSessionService.getCurrentAuthToken()) {
              // user is authenticated
              $scope.loginCtx.isOrgAuth = true;
              $state.go('home');

            }
            $scope.loginCtx.isLoginActive = false;
            $scope.loginCtx.email = '';
            $scope.loginCtx.password = '';

          };
          $scope.submitLoginRequest =  function() {
            var targetEmail = $scope.loginCtx.email;
            if (targetEmail && $scope.loginCtx.password ) {
              OrgSessionService.requestLoginToken($scope.loginCtx)
                .then(function(response) {

                  if (response.authToken) {
                    // save the token
                    OrgSessionService.setValueByKey('smAuthToken', response.authToken);
                    OrgSessionService.setValueByKey('smToken', response.authToken);
                    if (response.handle) {
                      OrgSessionService.setValueByKey('smHandle', response.handle);
                    }
                    else {
                      OrgSessionService.deleteValueByKey('smHandle');
                    }
                    OrgSessionService.setValueByKey('smEmail', response.email);

                    // clear the login
                    //$scope.loginCtx.init();
                    window.document.location.href = '/';
                    // redirect if necessary
                  }
                });
            }

          };
          $scope.activateLogin = function() {
            $scope.loginCtx.isLoginActive = true;
          };

          $scope.loginCtx.urlNavRequest = function(stateRequest) {
            $state.go(stateRequest);
          };
          $scope.loginCtx.init();
        }
      ]
    }
  }
]);
Org.directive('smOrgForgotPassword', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/org/templates/org.forgot.password.html',
      controller: [
        '$scope',
        '$log',
        'OrgServices',
        'OrgSessionService',
        'smGlobalValues',
        function($scope, $log, OrgServices, OrgSessionService, smGlobalValues) {
          if (!$scope.forgotPasswordCtx) {
            $scope.forgotPasswordCtx = {};
          }
          $scope.forgotPasswordCtx.submitResetPassword = function() {

            if ($scope.forgotPasswordCtx.email) {

              // make sure email address is valid

              // check to see if there is a userProfile with this email address
              OrgServices.findOrgByEmail($scope.forgotPasswordCtx.email)
                .then(function(response) {
                  if (response.email) {
                    // yay
                    $log.debug('we found a user by that email address');
                  }
                  else {
                    // no user exists
                    $log.debug('no user by that email address');
                  }
                });

              // if so then commence reset

              // if not then warn user




            }

          };

        }
      ]
    }
  }
]);
Org.directive('ggtOrgMoreInfoList', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/org/templates/org.list.html',
      controller: [
        '$scope',
        '$log',
        'OrgServices',
        function($scope, $log, OrgServices) {
          if (!$scope.orgCtx) {
            $scope.orgCtx = {};
          }
          if (!$scope.orgCtx.allOrgs) {
            $scope.orgCtx.allOrgs = [];
          }
          smSocket.on('newMoreInfoSignUp', function(data) {
            $log.debug('you hea', data);
            $scope.orgCtx.allOrgs = data;

          });
        }
      ]
    }
  }
]);

