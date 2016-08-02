User.service('UserServices', [
  'UserProfile',
  'smGlobalValues',
  'UserSessionService',
  'UserLocation',
  '$log',
  function(UserProfile, smGlobalValues, UserSessionService, UserLocation, $log) {
    var svc = this;


    svc.registerExistingUser = function(userCtx) {
      return UserProfile.registerExistingUser(userCtx)
        .$promise
        .then(function(registrationResponse) {
          $log.debug('good register existing user', registrationResponse);
          return registrationResponse;

        })
        .catch(function(error) {
          $log.warn('bad register existing user', error);
        });
    };
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
        alert('Please provide a valid email address');
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
        return UserProfile.deleteById({id:userId})
          .$promise
          .then(function(response) {
            return response;
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
      return UserProfile.create({})
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
  function(UserProfile, $cookies, $log, $timeout, $http, UserLocation) {

    var svc = this;
    var userName = '';
    var email = '';
    var appSessionId = '';
    var userId = '';
    var authToken = '';

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
    // User Name
    svc.setUserName = function(username) {
      if (username) {
        userName = username;
        $cookies.put('smUserName', username);
      }
    };
    svc.getUserName = function() {
      userName = $cookies.get('smUserName');
      return userName;
    };
    svc.clearUserName = function() {
      userName = '';
      $cookies.remove('smUserName');
    };
    // User Id
    svc.setUserId = function(userid) {
      if (userid) {
        userId = userid;
        $cookies.put('smUserId', userid);
      }
    };
    svc.getUserId = function() {
      userId = $cookies.get('smUserId');
      return userId;
    };
    svc.setUserTag = function(userTag) {
      if (svc.isCookiesEnabled()) {
        $cookies.put('smHandle', userTag);
        return true;
      }
      return false;

    };
    svc.setToken = function(token) {
      if (svc.isCookiesEnabled()) {
        $cookies.put('smToken', token);
        return true;
      }
      return false;
    };
    svc.setAuthToken = function(authToken) {
      if (svc.isCookiesEnabled()) {
        $cookies.put('smAuthToken', authToken);
        return true;
      }
      return false;
    };
    svc.getCurrentUserTag = function() {
      var userTag;
      if (svc.isCookiesEnabled() && $cookies.get('smHandle')) {
        userTag = $cookies.get('smHandle');
      }
      return userTag;
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
    svc.clearUserId = function() {
      userId = '';
      $cookies.remove('smUserId');
    };
    // App Session Id
    svc.setUserSessionId = function(appsessionid) {
      if (appsessionid) {
        appSessionId = appsessionid;
        $cookies.put('smAppSessionId', appSessionId);
      }
    };
    svc.getUserSessionId = function() {
      appSessionId = $cookies.get('smTraceId');
      return appSessionId;
    };
    svc.clearAppSessionId = function() {
      appSessionId = '';
      $cookies.remove('smTraceId');
    };
    //  Email
    svc.setUserEmail = function(email) {
      if (email) {
        email = email;
        $cookies.put('smEmail', email);
      }
    };
    svc.getUserEmail = function() {
      email = $cookies.get('smEmail');
      return email;
    };
    svc.clearUserEmail = function() {
      email = '';
      $cookies.remove('smEmail');
    };
    //  AuthToken
    svc.setAuthToken = function(token) {
      if (token) {
        authToken = token;
        $cookies.put('smAuthToken', authToken);
      }
    };
    svc.getAuthToken = function() {
      authToken = $cookies.get('smAuthToken');
      return authToken;
    };
    svc.clearAuthToken = function() {
      authToken = '';
      $cookies.remove('smAuthToken');
    };
    svc.isCurrentUserLoggedIn = function() {
      if (!$cookies.get('smAuthToken')) {
        return false;
      }
      var currentTimeStamp = new Date().getTime();
      var ttl = $cookies.get('smTTL');

      if (currentTimeStamp > ttl) {
        // track the problem / issue
        return false;
      }
      if (currentTimeStamp < smTTL) {
        return true;
      }
      return false;
    };
    svc.requestLoginToken = function(loginCtx) {
      if (loginCtx.email && loginCtx.password) {
        loginCtx.smToken = svc.getCurrentToken();
        return UserProfile.login({ctx:loginCtx})
          .$promise
          .then(function(response) {
            return response.token;
          })
          .catch(function(error){
            $log.warn('bad login attempt');
            return null;
          });
      }
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
        return UserProfile.findByToken({token: svc.getCurrentToken()})
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
