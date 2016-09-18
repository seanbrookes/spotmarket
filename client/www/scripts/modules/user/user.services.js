User.service('UserServices', [
  'UserProfile',
  'smGlobalValues',
  'UserSessionService',
  'UserLocation',
  'ProfileAvatar',
  'AliasEmail',
  '$log',
  function(UserProfile, smGlobalValues, UserSessionService, UserLocation, ProfileAvatar, AliasEmail, $log) {
    var svc = this;

    var _profileAvatars = [];



    svc.updateCurrentUserPosition = function(position) {
      if (position && position.geometry) {
        var userId = UserSessionService.getValueByKey('smHandle');
        UserSessionService.getUserProfileById(userId)
          .then(function(responseUser) {
            responseUser.lastPosition = position;
            svc.saveUser(responseUser)
              .then(function(responseUpdatedUser) {
                UserSessionService.setValueByKey('smCurrentPosition', JSON.stringify(position));
                return responseUpdatedUser;
              })
              .catch(function(error) {
                $log.warn('bad update user latest position', error);
              });
            var timestamp = new Date().getTime();
            var newLocation = {
              userId: responseUser.id,
              location: position,
              timestamp:timestamp
            };
            UserLocation.create(newLocation)
              .$promise
              .then(function(resopnseLocation) {
                $log.debug('ADDED NEW POSITION HISTORY');
              })
              .catch(function(error) {
                $log.warn('bad add new location');
              });
            //svc.saveUser(responseUser)
            //  .then(function(responseUpdatedUser) {
            //    return responseUpdatedUser;
            //  })
            //  .catch(function(error) {
            //    $log.warn('bad update user latest position', error);
            //  });
          })
          .catch(function(error) {
            $log.warn('bad get user profile', error);
          });

      }
    };
    svc.saveEmailAlias = function(user) {
      var emailAliasDoc = {
        email:user.email,
        profileId:user.id,
        createdDate: new Date().getTime(),
        lastUpdate: new Date().getTime()
      };
      AliasEmail.upsert(emailAliasDoc)
        .$promise
        .then(function(response) {
          // all good
        })
        .catch(function(error) {
          $log.debug('bad update email alias', error);
        });
    };
    svc.getProfileAvatars = function() {
      return ProfileAvatar.find({})
        .$promise
        .then(function(response) {
          return response;
        })
        .catch(function(error) {
          $log.warn('bad get all profile avatars', error);
        });
    };
    svc.getAllEmails = function() {
      return UserProfile.knownEmails({})
        .$promise
        .then(function(response) {
          return response;
        })
        .catch(function(error) {
          $log.warn('bad get all emails', error);
        });
    };
    svc.getAllHandles = function() {
      return UserProfile.knownHandles({})
        .$promise
        .then(function(response) {
          return response;
        })
        .catch(function(error) {
          $log.warn('bad get all hanles', error);
        });
    };
    function getDefaultAvatarImgString() {
      return 'data:image/png;base64,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';
    }
    svc.getProfileAvatar = function(profileId) {
      if (_profileAvatars && _profileAvatars.map && _profileAvatars.length > 0) {

      }
      else {
        return _profileAvatars = svc.getProfileAvatars()
          .then(function(response) {
            var retVal;
            response.map(function(avatar) {

              if (avatar.userId === profileId) {
                retVal = avatar;
              }

            });
            if (retVal.avatarImage) {
              return retVal;
            }
            // profile doesen't have an avatar yet
            // so create a default one
            var newProfileAvatar = {
              createdDate: new Date().getTime(),
              userId:profileId,
              avatarImg: getDefaultAvatarImgString()
            };
            return ProfileAvatar.create(newProfileAvatar)
              .$promise
              .then(function(response) {
                return response;
              })
              .catch(function(error) {
                $log.warn('bad create default avatar', error);
              });


          })
      }
    };
    svc.saveProfileAvatar = function(targetAvatar) {
      if (targetAvatar) {
        targetAvatar.lastUpdate = new Date().getTime();
        if (targetAvatar.userId) {
          // update
          return ProfileAvatar.upsert(targetAvatar)
            .$promise
            .then(function(response) {
              return response;
            })
            .catch(function(error) {
              $log.warn('bad create profile avatar', error);
            });

        }
        else {
          // create
          targetAvatar.createdDate = new Date().getTime();
          return ProfileAvatar.create(targetAvatar)
            .$promise
            .then(function(response) {
              return response;
            })
            .catch(function(error) {
              $log.warn('bad create profile avatar', error);
            });
        }
      }
    };

    svc.saveUser = function(user) {
      if (!user.createdDate) {
        user.createdDate = (new Date).getTime();
      }
      user.lastUpdate = (new Date).getTime();
      if (user.id) {
        return UserProfile.upsert(user)
          .$promise
          .then(function(response) {
            return response;
          });

      }
      else {
        return UserProfile.create(user)
          .$promise
          .then(function(response) {
            return response;
          });
      }
    };
    function checkEmail() {

      var email = document.getElementById('txtEmail');
      var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

      if (!filter.test(email.value)) {
        //alert('Please provide a valid email address');
        email.focus;
        return false;
      }
    }
    svc.isValidEmail = function(targetEmail) {
      if (!targetEmail) {
        return false;
      }
      var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

      if (!filter.test(targetEmail)) {
        return false;
      }
      return true;
    };
    svc.deleteUser = function(userId) {
      if (userId) {
        //return UserProfile.deleteById({id:userId})
        //  .$promise
        //  .then(function(response) {
        //    return response;
        //  });
      }
    };
    svc.findUserByEmail = function(email) {
      if (email && svc.isValidEmail(email)) {
        return UserProfile.find({filter:{where:{authEmail:email}}})
          .$promise
          .then(function(response) {
            return response;
          })
          .catch(function(error) {
            $log.warn('bad find user by email', error);
            return error;
          })
      }
    };
    svc.getUsers = function(filter) {
      if (!filter) {
        filter = {};
      }
      return UserProfile.find(filter)
        .$promise
        .then(function(response) {
          return response || [];
        });
    };
    svc.createInitialUserProfile = function() {
      return UserProfile.create({createdDate:new Date().getTime(), lastUpdate:new Date().getTime()})
        .$promise
        .then(function(currentUserResponse) {
          if (currentUserResponse.token) {

            UserSessionService.setValueByKey('smToken', currentUserResponse.token);

            return UserSessionService.getCurrentUserFromClientState();
          }
        })
        .catch(function(error) {
          $log.warn('bad create tagged user', error);
          return {};
        });
    };

    return svc;
  }
]);
User.service('UserSessionService', [
  'UserProfile',
  '$cookies',
  '$log',
  '$timeout',
  '$http',
  'UserLocation',
  'smGlobalValues',
  function(UserProfile, $cookies, $log, $timeout, $http, UserLocation, smGlobalValues) {

    var svc = this;
    var userName = '';
    var email = '';
    var appSessionId = '';
    var userId = '';
    var authToken = '';


    function synchUserProfileData() {
      //
    }

    svc.isCookiesEnabled = function() {
      $cookies.put('smTestCookiesEnabled', 'true');
      if (!$cookies.get('smTestCookiesEnabled')) {
        return false;
      }
      return true;
    };
    svc.getValueByKey = function(key) {
      if (key) {
        return $cookies.get(key);
      }
      return null;
    };
    svc.setValueByKey = function(key, value) {
      $cookies.put(key, value);
      smGlobalValues.currentUser[key] = value;
      // synch user
      // - db
      // get user from
      // - local storage
      // - global user
    };
    svc.deleteValueByKey = function(key) {
      $cookies.remove(key);
    };
    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    var arrayOfWordsOne = [];
    var arrayOfWordsTwo = [];
    svc.generateNewUserTag = function(options) {
      $log.debug('|  Generate new user tag');
      var returnVal;


      if ((arrayOfWordsOne.length === 0) || (arrayOfWordsTwo.length === 0)) {
        return $http.get("./scripts/modules/user/1syllableadjectives.txt")
          .then(function(response) {
            $log.debug('|  Here are the damn words', response.data);
            arrayOfWordsOne = response.data.split(/\r\n|\r|\n/g);
            $log.debug('| word count:', arrayOfWordsOne.length);

            return $http.get("./scripts/modules/user/common-english-words-3letters-plus.txt")
              .then(function(response) {
                $log.debug('|  Here are the damn second words', response.data);
                arrayOfWordsTwo = response.data.split(',');
                $log.debug('| word count 2:', arrayOfWordsTwo.length);
                var randno1 = Math.floor ( Math.random() * arrayOfWordsOne.length );
                var randno2 = Math.floor ( Math.random() * arrayOfWordsTwo.length );
                var randno3 = Math.floor ( Math.random() * 99 );
                var returnVal = capitalizeFirstLetter(arrayOfWordsOne[randno1]) + capitalizeFirstLetter(arrayOfWordsTwo[randno2]);
                if (options && !options.aphaOnly) {
                  returnVal = returnVal + randno3;
                }
                return  returnVal;
              });

          });
      }
      else {
        return $timeout(function() {
          var randno1 = Math.floor ( Math.random() * arrayOfWordsOne.length );
          var randno2 = Math.floor ( Math.random() * arrayOfWordsTwo.length );
          var randno3 = Math.floor ( Math.random() * 99 );
          var returnVal = capitalizeFirstLetter(arrayOfWordsOne[randno1]) + capitalizeFirstLetter(arrayOfWordsTwo[randno2]);
          if (options && !options.aphaOnly) {
            returnVal = returnVal + randno3;
          }
          return  returnVal;

        }, 25);
      }

      // get random list of nouns
      // get random list of adjectives
      // get random number

      //return $timeout(function() {
      //  return 'LikeBison09';
      //})
    };
    svc.getLocationHistory = function(filter) {
      if (!filter) {
        filter = {};
      }
      return UserLocation.find(filter)
        .$promise
        .then(function(responseLocations) {
          $log.debug('got location history', responseLocations);
          return responseLocations;
        })
        .catch(function(error) {
          $log.warn('bad find location history');
        });
    };
    svc.deleteLocationHistoryById = function(id) {
      return UserLocation.deleteById({id:id})
        .$promise
        .then(function(response) {
          return response;
        })
        .catch(function(error) {
          $log.warn('bad delete location history', error);
        });
    };
    svc.getCurrentUserLocationHistory = function() {

      // get current user id
      return svc.getCurrentUserByToken()
        .then(function(currentUser) {
          var locationHistoryFilter = {
            userId:currentUser.id
          };
          return svc.getLocationHistory(locationHistoryFilter)
            .then(function(locationHistoryResponse) {
              return locationHistoryResponse;
            });
        });
    };
    svc.getCurrentToken = function() {
      var token;
      if (svc.isCookiesEnabled() && $cookies.get('smToken')) {
        token = $cookies.get('smToken');
      }
      return token;
    };
    svc.getCurrentAuthToken = function() {
      var authToken;
      if (svc.isCookiesEnabled() && $cookies.get('smAuthToken')) {
        authToken = $cookies.get('smAuthToken');
      }
      return authToken;
    };
    svc.isCurrentUserLoggedIn = function() {
      if ($cookies.get('smAuthToken')) {
        return true;
      }
      //var currentTimeStamp = new Date().getTime();
      //var ttl = $cookies.get('smTTL');
      //
      //if (currentTimeStamp > ttl) {
      //  // track the problem / issue
      //  return false;
      //}
      //if (currentTimeStamp < ttl) {
      //  return true;
      //}
      return false;
    };
    svc.isEmailUnique = function(targetEmail) {

    };
    svc.isHandleUnique = function(targetHandle) {
      //return UserServices.
    };


    svc.requestLoginToken = function(loginCtx) {

      if (loginCtx.email && loginCtx.password) {
        loginCtx.smToken = svc.getCurrentToken();

        return UserProfile.login({ctx:loginCtx})
          .$promise
          .then(function(response) {
            if (response && response.authState) {
              var authState = response.authState;
              if (authState.authToken) {
                // save the token
                svc.setValueByKey('smAuthToken', authState.authToken);
              }
              if (authState.token) {
                svc.setValueByKey('smToken', authState.authToken);
              }
              if (authState.handle) {
                svc.setValueByKey('smHandle', authState.handle);
              }
              else {
                svc.deleteValueByKey('smHandle');
              }
              if (authState.email) {
                svc.setValueByKey('smEmail', authState.email);
              }
              return authState;
            }
            return;

          })
          .catch(function(error){
            $log.warn('bad login attempt', error);
            return error;
          });
      }
    };
    svc.registerExistingUser = function(userCtx) {
      return UserProfile.registerExistingUser(userCtx)
        .$promise
        .then(function(registrationResponse) {
          $log.debug('good register existing user', registrationResponse);
          if (registrationResponse.authToken) {
            // save the token
            svc.setValueByKey('smAuthToken', registrationResponse.authToken);
          }
          if (registrationResponse.token) {
            svc.setValueByKey('smToken', registrationResponse.token);
          }
          if (registrationResponse.handle) {
            svc.setValueByKey('smHandle', registrationResponse.handle);
          }
          else {
            svc.deleteValueByKey('smHandle');
          }
          if (registrationResponse.email) {
            svc.setValueByKey('smEmail', registrationResponse.email);
          }


          return registrationResponse;

        })
        .catch(function(error) {
          $log.warn('bad register existing user', error);
        });
    };



    svc.logout = function() {
      return $timeout(function() {
        return svc.deleteValueByKey('smAuthToken');
      }, 25);
    };
    svc.clearCurrentCacheUser = function() {
        // save the token
      svc.deleteValueByKey('smAuthToken');
      svc.deleteValueByKey('smToken');
      svc.deleteValueByKey('smEmail');
      svc.deleteValueByKey('smTraceId');
      svc.deleteValueByKey('smHandle');
      return;

    };
    svc.getUserHandleSuggestionHistory = function() {
      var retVal = [];

      var rawString = window.localStorage.getItem('smUserHandleHistory');
      if (rawString) {
        var rawArray = JSON.parse(rawString);
        if (rawArray && rawArray.length > 0) {
          retVal = rawArray.reverse();
        }
      }
      return retVal;
    };
    svc.addUserHandleSuggestionToHistory = function(handleSuggestion) {
      if (handleSuggestion) {
        var rawArray = [];
        var rawString = window.localStorage.getItem('smUserHandleHistory');
        if (!rawString) {
          window.localStorage.setItem('smUserHandleHistory', JSON.stringify([handleSuggestion]));
        }
        else {
          var rawArray = JSON.parse(rawString);
          if (rawArray.length > 50) {
            rawArray.shift();
          }
          rawArray.push(handleSuggestion);
          window.localStorage.setItem('smUserHandleHistory', JSON.stringify(rawArray));
        }
      }

      return handleSuggestion;
    };
    svc.getCurrentUserFromClientState = function() {
      var user = {};
      user.smHandle = svc.getValueByKey('smHandle');
      user.smSessionId = svc.getValueByKey('smSessionId');
      user.smUserId = svc.getValueByKey('smUserId');
      user.smUserPreferences = svc.getValueByKey('smUserPreferences');
      user.smToken = svc.getValueByKey('smToken');
      user.smEmail = svc.getValueByKey('smEmail');
      user.smUserName = svc.getValueByKey('smUserName');
      user.smAuthToken = svc.getValueByKey('smAuthToken');
      user.smCurrentPosition = svc.getValueByKey('smCurrentPosition');
      user.smTTL = svc.getValueByKey('smTTL');
      user.isCurrentUserLoggedIn = svc.getValueByKey('isCurrentUserLoggedIn');

      return user;

    };
    svc.getUserProfileById = function(id) {
      return UserProfile.find({userId: id})
        .$promise
        .then(function(response) {
          if (response && response.length && response.length > 0) {

            var returnUser = response[0];
            var clientStateUser = svc.getCurrentUserFromClientState();
            return angular.extend(returnUser, clientStateUser);
          }
          else {
            return null;
          }
        })
        .catch(function(error) {
          $log.warn('bad get user profile', error);
        })
    };
    svc.getCurrentUserByToken = function() {
      var currentToken = svc.getCurrentToken();
      if (currentToken) {
        return UserProfile.findByToken({token: currentToken})
          .$promise
          .then(function(response) {
            if (response.user && response.user.length && response.user.length > 0) {

              $log.debug('Response current User request', response.user[0]);
              var returnUser = response.user[0];
              var clientStateUser = svc.getCurrentUserFromClientState();
              return angular.extend(returnUser, clientStateUser);
            }
            else {
              return null;
            }
          })
          .catch(function(error) {
            $log.warn('bad get user by token', error);
          });

      }
      else {
        $log.warn(' no current token found on client');
        $timeout(function() {
          return;

        }, 25);

      }


    };
    return svc;

  }
]);
