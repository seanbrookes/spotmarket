User.service('UserServices', [
  'UserProfile',
  'smGlobalValues',
  'UserSessionService',
  function(UserProfile, smGlobalValues, UserSessionService) {
    var svc = this;

    svc.getCurrentUser = function() {
      smGlobalValues.currentUser.smUserTag = UserSessionService.getValueByKey('smUserTag');
      smGlobalValues.currentUser.smSessionId = UserSessionService.getValueByKey('smSessionId');
      smGlobalValues.currentUser.smUserId = UserSessionService.getValueByKey('smUserId');
      smGlobalValues.currentUser.smEmail = UserSessionService.getValueByKey('smEmail');
      smGlobalValues.currentUser.smAuthToken = UserSessionService.getValueByKey('smAuthToken');
      smGlobalValues.currentUser.smTTL = UserSessionService.getValueByKey('smTTL');
      smGlobalValues.currentUser.isCurrentUserLoggedIn = UserSessionService.getValueByKey('isCurrentUserLoggedIn');

      return smGlobalValues.currentUser;

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

    return svc;
  }
]);
User.service('UserSessionService', [
  'UserProfile',
  '$cookies',
  '$log',
  function(UserProfile, $cookies, $log) {

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
    svc.putValueByKey = function(key, value) {
      $cookies.put(key, value);
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
    svc.clearUserId = function() {
      userId = '';
      $cookies.remove('smUserId');
    };
    // App Session Id
    svc.setAppSessionId = function(appsessionid) {
      if (appsessionid) {
        appSessionId = appsessionid;
        $cookies.put('smAppSessionId', appSessionId);
      }
    };
    svc.getAppSessionId = function() {
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
    svc.getUserSessionProfileById = function(id) {
      return UserProfile.find({userId: id})
        .$promise
        .then(function(response) {
          if (response && response.length && response.length > 0) {

            return response[0];
          }
          else {
            return null;
          }
        })
        .catch(function(error) {
          $log.warn('bad get user profile', error);
        })
    };

    return svc;

  }
]);
