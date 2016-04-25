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
