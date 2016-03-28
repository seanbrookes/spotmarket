Acme.controller('AcmeMainController', [
  '$scope',
  '$log',
  '$http',
  'AcmeServices',
  'UserProfile',
  function($scope, $log, $http, AcmeServices, UserProfile) {
    $log.debug('Hello World Acme Controller');


    //$scope.allUsers = UserProfile.find(filter)
    //  .$promise
    //  .then(function(response) {
    //    return response;
    //  })
    //  .catch(function(error) {
    //    $log.warn('bad get users', error);
    //  });
    var socket = io.connect();

    $scope.allUsers = AcmeServices.getAllUsers()
      .then(function(response) {
        $scope.allUsers = response;
        $scope.allUsers.map(function(user) {
          socket.emit('nickName', user.name);
          socket.emit('setGeometry', user.geometry);
          socket.emit('creatAsk', {
            productType: 'Tomatoes',
            productSubType: 'Heirloom',
            profileId: 'asdf7anqera0fjqwel',
            quantity: '400 kgs',
            price: 'alot of $'
          });
          console.log(socket.name)
        })
      })
      .catch(function(error) {
        $log.warn('bad get users', error);
      });

  }

]);
