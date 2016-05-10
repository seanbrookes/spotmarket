User.service('UserServices', [
  'UserProfile',
  function(UserProfile) {
    var svc = this;

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
  '$cookies',
  function($cookies) {

    var svc = this;
    var userName = '';
    var email = '';
    var appSessionId = '';
    var userId = '';
    var authToken = '';

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
      appSessionId = $cookies.get('smAppSessionId');
      return appSessionId;
    };
    svc.clearAppSessionId = function() {
      appSessionId = '';
      $cookies.remove('smAppSessionId');
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

    return svc;

  }
]);
