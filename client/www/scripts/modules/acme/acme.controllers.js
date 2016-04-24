Acme.controller('AcmeMainController', [
  '$scope',
  '$log',
  '$http',
  'AcmeServices',
  'UserProfile',
  function($scope, $log, $http, AcmeServices, UserProfile) {
    $log.debug('Hello World Acme Controller');
    var socket = io.connect('http://spotmarketapi.herokuapp.com/');

    $scope.doSocketStuff = function() {
      $log.debug('Do socket stuff');
      socket.emit('nickName', 'Do socket stuff');
    };
    $scope.sendEmail = function() {
      $log.debug('send email');
      socket.emit('sendEmail', 'Do socket stuff');

    };
    $scope.sendText = function() {
      $log.debug('send text');
      socket.emit('sendText', 'Do socket stuff');

    };
    socket.on('sendEmailReceived', function(data) {
      $log.debug('ya it is working send email');
    });
    socket.on('sendTextReceived', function(data) {
      $log.debug('ya it is working send text');
    });

    //$scope.allUsers = UserProfile.find(filter)
    //  .$promise
    //  .then(function(response) {
    //    return response;
    //  })
    //  .catch(function(error) {
    //    $log.warn('bad get users', error);
    //  });

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
