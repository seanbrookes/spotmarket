sm.User.directive('smUserProfileMain', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/user/templates/user.profile.main.html',
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
sm.User.directive('smUserProfileContact', [
  function() {
    return {
      restrict: 'E',
      link: function(scope, el, attrs) {

        scope.$watch('userProfileCtx.currentProfile', function(newVal, oldVal) {
          if (newVal && newVal.handle) {
            ReactDOM.render(React.createElement(sm.UserProfileContact, {scope:scope}), el[0]);
          }
        }, true);

        scope.$watch('userProfileCtx.isEditContactMode', function(newVal, oldVal) {
          ReactDOM.render(React.createElement(sm.UserProfileContact, {scope:scope}), el[0]);
        }, true);

      }

    }
  }
]);
sm.User.directive('smUserProfileForm', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/user/templates/user.profile.form.html',
      controller: [
        '$scope',
        'Upload',
        'UserSessionService',
        'UserServices',
        '$log',
        '$stateParams',
        '$state',
        function($scope, Upload, UserSessionService, UserServices, $log, $stateParams, $state) {
          $scope.userProfileCtx = {avatarSrc:'', croppedImage:''};
          $scope.userProfileCtx.isEditBioMode = false;

          $scope.profileAvatar = {
            userId:'',
            avatarImage: ''
          };


          $scope.myImage='';
          $scope.userProfileCtx.myCroppedImage = '';
          $scope.userProfileCtx.currentProfile = {
            avatarImage: ''
          };
          $scope.userProfileCtx.isEditMode = false;
          $scope.userProfileCtx.toggleEditMode = function() {
            if (!$scope.userProfileCtx.isEditMode && UserSessionService.isCurrentUserLoggedIn()) {
              $scope.userProfileCtx.isEditMode = true;
            }
            else if (!$scope.userProfileCtx.isEditMode && !UserSessionService.isCurrentUserLoggedIn()) {
              $state.go('login');
            }
            else {
              $scope.userProfileCtx.isEditMode = false;
            }
          };
          $scope.userProfileCtx.isEditCurrentUser = function() {
            return $scope.userProfileCtx.isEditMode;
          };
          $scope.userProfileCtx.saveCurrentProfile = function() {
            UserServices.saveUser($scope.userProfileCtx.currentProfile)
              .then(function(response) {
                $log.debug('Save my profile');
                $scope.userProfileCtx.isEditMode = false;
                $scope.userProfileCtx.isEditMode = false;
                $scope.userProfileCtx.isEditBannerImageMode = false;
                $scope.userProfileCtx.isEditAvatarMode = false;
              });
          };
          //$scope.userProfileCtx.saveBio = function() {
          //
          //
          //
          //  UserServices.saveUser($scope.userProfileCtx.currentProfile)
          //    .then(function(response) {
          //      $scope.userProfileCtx.isEditBioMode = true;
          //    });
          //
          //};


          $scope.userProfileCtx.isReadOnlyCurrentUser = function() {
            // am I current user
            if ((!$stateParams.handle) && (!$scope.userProfileCtx.isEditMode)) {
              return true;
            }
            return false;
            // is the form in edit mode
          };

          $scope.userProfileCtx.saveProfileImage = function() {
            $log.debug('|  Save the Profile Image ', $scope.userProfileCtx.myCroppedImage );
            var profileAvatarUpdate = {
              userId: $scope.userProfileCtx.currentProfile.userId
            };
            if ($scope.userProfileCtx.currentProfile.avatarId) {
              profileAvatarUpdate.id = $scope.userProfileCtx.currentProfile.avatarId;
            }
            profileAvatarUpdate.avatarImage = $scope.userProfileCtx.myCroppedImage;
            UserServices.saveProfileAvatar(profileAvatarUpdate)
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
                $scope.userProfileCtx.avatarSrc = evt.target.result;
              });
            };
            reader.readAsDataURL(file);
          };


          angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);



          $scope.userProfileCtx.triggerEditMode = function() {
            $scope.userProfileCtx.isEditMode = true;
          };

          $scope.userProfileCtx.init = function() {


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
              UserSessionService.getCurrentUserByToken()
                .then(function(response) {
                  if (response.id) {

                    $scope.userProfileCtx.currentProfile = response;
                    if (!$scope.userProfileCtx.currentProfile.bannerImage) {
                      $scope.userProfileCtx.currentProfile.bannerImage = 'http://localhost:4545/images/default-hero.png';
                    }
                    if (!$scope.userProfileCtx.currentProfile.bannerBgColor) {
                      $scope.userProfileCtx.currentProfile.bannerBgColor = '#608052';
                    }
                    if (!$scope.userProfileCtx.currentProfile.bio) {
                      $scope.userProfileCtx.currentProfile.bio = "No bio information available yet";
                    }



                    UserServices.getProfileAvatar(response.id)
                      .then(function(response) {
                        if (response && response.avatarImage) {
                          $log.debug('got the user avatar', response);
                          $scope.userProfileCtx.currentProfile.avatarImage = response.avatarImage;
                          $scope.userProfileCtx.currentProfile.userId = response.userId;
                          $scope.userProfileCtx.currentProfile.avatarId = response.id;

                        }
                        return $scope.userProfileCtx.currentProfile;
                      });

                  }
                });
            }





          };
          $scope.userProfileCtx.init();
        }

      ],
      link: function(scope, el, attrs) {



      }
    }
  }
]);
sm.User.directive('smUserProfileView', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/user/templates/user.profile.view.html',
      controller: [
        '$scope',
        'Upload',
        'UserSessionService',
        'UserServices',
        '$log',
        '$stateParams',
        '$state',
        function($scope, Upload, UserSessionService, UserServices, $log, $stateParams, $state) {

          if (!$scope.userProfileCtx) {
            $scope.userProfileCtx = {};

          }
          $scope.userProfileCtx.mainViews = {
            about: {
              active: true
            },
            preferences: {
              active: false
            }
          };
          $scope.profileAvatar = {
            userId:'',
            avatarImage: ''
          };
          $scope.userProfileCtx.isEditBioMode = false;
          $scope.userProfileCtx.isEditContactMode = false;
          $scope.userProfileCtx.isEditAvatarMode = false;
          $scope.userProfileCtx.isEditBannerImageMode = false;

          $scope.myImage='';
          $scope.userProfileCtx.myCroppedImage = '';
          $scope.userProfileCtx.currentProfile = {
            avatarImage: ''
          };
          $scope.userProfileCtx.isEditMode = false;
          $scope.userProfileCtx.toggleEditMode = function() {
            if (!$scope.userProfileCtx.isEditMode && UserSessionService.isCurrentUserLoggedIn()) {
              $scope.userProfileCtx.isEditMode = true;
            }
            else if (!$scope.userProfileCtx.isEditMode && !UserSessionService.isCurrentUserLoggedIn()) {
              $state.go('login');
            }
            else {
              $scope.userProfileCtx.isEditMode = false;
            }
          };
          $scope.userProfileCtx.isEditCurrentUser = function() {
            return $scope.userProfileCtx.isEditMode;
          };
          $scope.userProfileCtx.isDefaultWeightMeasureChecked = true; // kg
          $scope.$watch('userProfileCtx.isDefaultWeightMeasureChecked', function(newVal, oldVal) {
            if (!$scope.userProfileCtx.currentProfile.preferences) {

              $scope.userProfileCtx.currentProfile.preferences = {};
            }
            var val = 'kg';
            if (!$scope.userProfileCtx.isDefaultWeightMeasureChecked) {
              val = 'lb';
            }
            $scope.userProfileCtx.currentProfile.preferences.weightMeasure = val;
            $scope.saveCurrentProfile();
          }, true);
          $scope.userProfileCtx.isDefaultCurrencyChecked = true; // CAD
          $scope.$watch('userProfileCtx.isDefaultCurrencyChecked', function(newVal, oldVal) {
            if (!$scope.userProfileCtx.currentProfile.preferences) {

              $scope.userProfileCtx.currentProfile.preferences = {};
            }
            var val = 'CAD';
            if (!$scope.userProfileCtx.isDefaultCurrencyChecked) {
              val = 'USD';
            }
            $scope.userProfileCtx.currentProfile.preferences.currency = val;
            $scope.saveCurrentProfile();
          }, true);
          $scope.userProfileCtx.isDefaultDisanceMeasureChecked = true; // km
          $scope.$watch('userProfileCtx.isDefaultCurrencyChecked', function(newVal, oldVal) {
            if (!$scope.userProfileCtx.currentProfile.preferences) {

              $scope.userProfileCtx.currentProfile.preferences = {};
            }
            var val = 'km';
            if (!$scope.userProfileCtx.isDefaultDisanceMeasureChecked) {
              val = 'miles';
            }
            $scope.userProfileCtx.currentProfile.preferences.distance = val;
            $scope.saveCurrentProfile();
          }, true);

          $scope.saveCurrentProfile = function() {
            UserServices.saveUser($scope.userProfileCtx.currentProfile)
              .then(function(response) {
                $scope.userProfileCtx.isEditMode = false;
                $scope.userProfileCtx.isEditAvatarMode = false;
                $scope.userProfileCtx.isEditBannerImageMode = false;
              });
          };
          $scope.userProfileCtx.saveCurrentProfile = function() {
            UserServices.saveUser($scope.userProfileCtx.currentProfile)
              .then(function(response) {
                $scope.userProfileCtx.isEditMode = false;
                $scope.userProfileCtx.isEditBannerImageMode = false;
                $scope.userProfileCtx.isEditAvatarMode = false;
              });
          };
          $scope.userProfileCtx.saveBio = function() {

            UserServices.saveUser($scope.userProfileCtx.currentProfile)
              .then(function(response) {
                $scope.userProfileCtx.currentProfile = response;
                $scope.userProfileCtx.isEditMode = false;
                $scope.userProfileCtx.isEditBioMode = false;
              });
          };
          $scope.userProfileCtx.saveContact = function() {
            UserServices.saveUser($scope.userProfileCtx.currentProfile)
              .then(function(response) {
                $scope.userProfileCtx.currentProfile = response;
                $scope.userProfileCtx.isEditMode = false;
                $scope.userProfileCtx.isEditContactMode = false;
              });
          };
          $scope.userProfileCtx.cancelContactEdit = function() {
            $scope.userProfileCtx.isEditContactMode = false;
          };
          $scope.userProfileCtx.triggerEditBio = function() {
            $scope.userProfileCtx.isEditBioMode = true;
          };
          $scope.userProfileCtx.triggerEditAvatar = function() {
            $scope.userProfileCtx.isEditAvatarMode = true;
          };
          $scope.userProfileCtx.triggerEditContact = function() {
            $scope.userProfileCtx.isEditContactMode = true;
          };
          $scope.userProfileCtx.triggerEditBannerImage = function() {
            $scope.userProfileCtx.isEditBannerImageMode = true;
          };
          $scope.userProfileCtx.triggerPreviewBannerImage = function() {
            $scope.userProfileCtx.isEditBannerImageMode = false;
          };

          $scope.userProfileCtx.isReadOnlyCurrentUser = function() {
            // am I current user
            if ((!$stateParams.handle) && (!$scope.userProfileCtx.isEditMode)) {
              return true;
            }
            return false;
            // is the form in edit mode
          };

          $scope.userProfileCtx.saveProfileImage = function() {
            $log.debug('|  Save the Profile Image ', $scope.userProfileCtx.myCroppedImage );
            var profileAvatarUpdate = {
              userId: $scope.userProfileCtx.currentProfile.userId
            };
            if ($scope.userProfileCtx.currentProfile.avatarId) {
              profileAvatarUpdate.id = $scope.userProfileCtx.currentProfile.avatarId;
            }
            profileAvatarUpdate.avatarImage = $scope.userProfileCtx.myCroppedImage;
            UserServices.saveProfileAvatar(profileAvatarUpdate)
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
                $scope.userProfileCtx.avatarSrc = evt.target.result;
              });
            };
            reader.readAsDataURL(file);
          };


          angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);



          $scope.userProfileCtx.triggerEditMode = function() {
            $scope.userProfileCtx.isEditMode = true;
          };
          $scope.userProfileCtx.showMainView = function(viewName) {

            for (var view in $scope.userProfileCtx.mainViews) {
              if( $scope.userProfileCtx.mainViews.hasOwnProperty(view) ) {
                $scope.userProfileCtx.mainViews[view].active = false;
              }
            }
            $scope.userProfileCtx.mainViews[viewName].active = true;

          };
          $scope.userProfileCtx.amIActive = function(viewName) {
            return $scope.userProfileCtx.mainViews[viewName].active;
          };

          $scope.userProfileCtx.init = function() {


            // check if we have an id/handle param
            // if so then load up that user data
            // if not load current user data
            // provide edit button


            if ($stateParams.handle) {
              // could be id or handle
              //
              // populate editor
              $log.debug('LOOKUP PROFILE BY HANDLE');

              UserServices.findUserByHandle($stateParams.handle)
                .then(function(response) {
                  if (response.id) {

                    $scope.userProfileCtx.currentProfile = response;
                    if (!$scope.userProfileCtx.currentProfile.bannerImage) {
                      $scope.userProfileCtx.currentProfile.bannerImage = 'http://localhost:4545/images/default-hero.png';
                    }
                    if (!$scope.userProfileCtx.currentProfile.bannerBgColor) {
                      $scope.userProfileCtx.currentProfile.bannerBgColor = '#608052';
                    }
                    if (!$scope.userProfileCtx.currentProfile.bio) {
                      $scope.userProfileCtx.currentProfile.bio = "No bio information available yet";
                    }

                    $scope.userProfileCtx.isDefaultWeightMeasureChecked = true; // kg
                    $scope.userProfileCtx.isDefaultCurrencyChecked = true;

                    if ($scope.userProfileCtx.currentProfile.preferences && $scope.userProfileCtx.currentProfile.preferences.currency) {
                      if ($scope.userProfileCtx.currentProfile.preferences.currency === 'USD') {
                        $scope.userProfileCtx.isDefaultCurrencyChecked = false;
                      }
                    }
                    if ($scope.userProfileCtx.currentProfile.preferences && $scope.userProfileCtx.currentProfile.preferences.weightMeasure) {
                      if ($scope.userProfileCtx.currentProfile.preferences.weightMeasure === 'lb') {
                        $scope.userProfileCtx.isDefaultWeightMeasureChecked = false;
                      }
                    }



                  }
                });
            }
            else {
              $log.debug('WE ARE THIS USER');
              // check if current user has a profile avatar
              UserSessionService.getCurrentUserByToken()
                .then(function(response) {
                  if (response.id) {

                    $scope.userProfileCtx.currentProfile = response;
                    if (!$scope.userProfileCtx.currentProfile.bannerImage) {
                      $scope.userProfileCtx.currentProfile.bannerImage = 'http://localhost:4545/images/default-hero.png';
                    }
                    if (!$scope.userProfileCtx.currentProfile.bannerBgColor) {
                      $scope.userProfileCtx.currentProfile.bannerBgColor = '#608052';
                    }
                    if (!$scope.userProfileCtx.currentProfile.bio) {
                      $scope.userProfileCtx.currentProfile.bio = "No bio information available yet";
                    }
                    $scope.userProfileCtx.isDefaultWeightMeasureChecked = true; // kg
                    $scope.userProfileCtx.isDefaultCurrencyChecked = true;

                    if ($scope.userProfileCtx.currentProfile.preferences && $scope.userProfileCtx.currentProfile.preferences.currency) {
                      if ($scope.userProfileCtx.currentProfile.preferences.currency === 'USD') {
                        $scope.userProfileCtx.isDefaultCurrencyChecked = false;
                      }
                    }
                    if ($scope.userProfileCtx.currentProfile.preferences && $scope.userProfileCtx.currentProfile.preferences.weightMeasure) {
                      if ($scope.userProfileCtx.currentProfile.preferences.weightMeasure === 'lb') {
                        $scope.userProfileCtx.isDefaultWeightMeasureChecked = false;
                      }
                    }


                  }
                });
            }





          };
          $scope.userProfileCtx.init();
        }

      ],
      link: function(scope, el, attrs) {



      }
    }
  }
]);

sm.User.directive('smTrackedCommand', [
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
sm.User.directive('smUserContactInput', [
  '$timeout',
  'CommonServices',
  function($timeout, CommonServices) {
    return {
      restrict:'E',
      templateUrl: './scripts/modules/user/templates/user.contact.input.html',
      controller: [
        '$scope',
        '$log',
        'UserServices',
        'UserSessionService',
        'smSocket',
        function($scope, $log, UserServices, UserSessionService, smSocket ) {

          smSocket.emit('fetchUserTag');

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
            var currentUserEmail = UserSessionService.getValueByKey('smEmail');
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
                var currentUser = UserSessionService.getCurrentUserByToken()
                  .then(function(currentUser) {
                    // check if currentUser has existing email
                    if (currentUser && currentUser.email && (currentUser.email !== emailToSubmit)) {
                      // if so create alias with existing email
                      //  CREATE ALIAS HERE

                      UserServices.saveEmailAlias(currentUser);
                    }
                    currentUser.email = emailToSubmit;
                    UserSessionService.setValueByKey('smEmail', emailToSubmit);
                    // reset email to new value
                    UserServices.saveUser(currentUser)
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
          $scope.$parent.trackViewInit('smUserContactInput');
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

sm.User.directive('smUserRegistration', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/user/templates/user.registration.html',
      controller: [
        '$scope',
        '$log',
        'UserServices',
        'UserSessionService',
        'smGlobalValues',
        '$state',
        function($scope, $log, UserServices, UserSessionService, smGlobalValues, $state) {
          if (!$scope.registrationCtx) {
            $scope.registrationCtx = {};
          }
          $scope.registrationCtx.isExistingEmail = false;
          $scope.registrationCtx.urlNavRequest = function(state) {
            $state.go(state);
          };
          $scope.registrationCtx.clearCurrentUser = function() {
            UserSessionService.clearCurrentCacheUser();
            window.location.reload();

          };
          $scope.registrationCtx.submitRegistration = function() {

            if (!$scope.registrationCtx.agreeTAC) {
              $log.warn('you need to agree to the terms and conditions');
              return;
            }
            if (!UserServices.isValidEmail($scope.registrationCtx.email)) {
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
            UserServices.findUserByEmail($scope.registrationCtx.email)
              .then(function(response) {
                if (response && response.length > 0) {
                  $log.warn('email address already linked to an account');
                  return;
                }
                var tempCurrentUser = UserSessionService.getCurrentUserFromClientState();
                if (tempCurrentUser && tempCurrentUser.smToken) {
                  // register existing user
                  $scope.registrationCtx.smToken = tempCurrentUser.smToken;
                  UserSessionService.registerExistingUser({user:$scope.registrationCtx})
                    .then(function(response) {
                      $log.debug('Account created ', $scope.registrationCtx.email );
                      $scope.registrationCtx.registrationComplete = true;
                    });
                }
              });

          };
          $scope.registrationCtx.init = function() {
            var currUser = UserSessionService.getCurrentUserFromClientState();
            if (currUser.smAuthToken) {
              $state.go('home');
            }
            if (currUser.smHandle) {
              $scope.registrationCtx.handle = currUser.smHandle;
              $scope.registrationCtx.isPreExistingHandle = true;
            }
            if (currUser.smEmail) {
              $scope.registrationCtx.isExistingEmail = true;
              $scope.registrationCtx.email = currUser.smEmail;
            }
          };
          $scope.registrationCtx.init();
        }
      ]
    }
  }
]);

sm.User.directive('smUserHandle', [
  function() {
    return {
      restrict: 'E',
      scope: {
        ctx:'='
      },
      templateUrl: './scripts/modules/user/templates/user.handle.html',
      controller: [
        '$scope',
        'UserServices',
        'UserSessionService',
        function($scope, UserServices, UserSessionService) {
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
            $scope.handleCtx.currentHandle = UserSessionService.generateNewUserTag(options)
              .then(function (response) {
                $scope.handleCtx.currentHandle = response;
                UserSessionService.addUserHandleSuggestionToHistory($scope.handleCtx.currentHandle);
                $scope.handleCtx.handleSuggestionHistoryIndex = 0;
              });
          };
          $scope.handleCtx.goBackOneHandleSuggestion = function () {
            var currentHistory = $scope.handleCtx.handleSuggestionHistory = UserSessionService.getUserHandleSuggestionHistory();
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
            var currentHistory = $scope.handleCtx.handleSuggestionHistory = UserSessionService.getUserHandleSuggestionHistory();
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
              user = UserSessionService.getCurrentUserFromClientState();
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
sm.User.directive('smUserLogin', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/user/templates/user.login.html',
      controller: [
        '$scope',
        '$log',
        'UserSessionService',
        '$state',
        function($scope, $log, UserSessionService, $state) {

          $scope.loginCtx = {
            isLoginActive:false,
            isUserAuth:false,
            rememberMe:true
          };

          $scope.loginCtx.init = function() {
            if (UserSessionService.getCurrentAuthToken()) {
              // user is authenticated
              $scope.loginCtx.isUserAuth = true;
              $state.go('home');

            }
            $scope.loginCtx.isLoginActive = false;
            $scope.loginCtx.email = '';
            $scope.loginCtx.password = '';

          };
          $scope.submitLoginRequest =  function() {
            var targetEmail = $scope.loginCtx.email;
            if (targetEmail && $scope.loginCtx.password ) {
              UserSessionService.requestLoginToken($scope.loginCtx)
                .then(function(response) {

                  if (response.authToken) {
                    // save the token
                    UserSessionService.setValueByKey('smAuthToken', response.authToken);
                    UserSessionService.setValueByKey('smToken', response.authToken);
                    if (response.handle) {
                      UserSessionService.setValueByKey('smHandle', response.handle);
                    }
                    else {
                      UserSessionService.deleteValueByKey('smHandle');
                    }
                    UserSessionService.setValueByKey('smEmail', response.email);

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
sm.User.directive('smUserForgotPassword', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/user/templates/user.forgot.password.html',
      controller: [
        '$scope',
        '$log',
        'UserServices',
        'UserSessionService',
        'smGlobalValues',
        function($scope, $log, UserServices, UserSessionService, smGlobalValues) {
          if (!$scope.forgotPasswordCtx) {
            $scope.forgotPasswordCtx = {};
          }
          $scope.forgotPasswordCtx.submitResetPassword = function() {

            if ($scope.forgotPasswordCtx.email) {

              // make sure email address is valid

              // check to see if there is a userProfile with this email address
              UserServices.findUserByEmail($scope.forgotPasswordCtx.email)
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
sm.User.directive('ggtUserMoreInfoList', [
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

