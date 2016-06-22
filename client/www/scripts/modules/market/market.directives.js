Market.directive('smMarketMain', [
  function() {
    return {
      restrict:'E',
      templateUrl: './scripts/modules/market/templates/market.main.html',
      controller: [
        '$scope',
        '$log',
        'smSocket',
        'UserSessionService',
        function($scope, $log, smSocket, UserSessionService) {

          // we need a user
          // user needs a location
          /*
          *
          * - could be country based on ip
          * - type ahead city / state
          * - html5 geolocation
          * - type in an address
          * - click on a map
          *
          * */




          // make sure we have a user (token)
          // open a socket
          // need a geo element on user
          // get latest market updates
          /*
           *
           * Socket Initialization
           *
           * */
          smSocket.on('smRealTimeConnection', function(socketClientId) {
            $log.debug('|');
            $log.debug('|');
            $log.debug('| smRealTimeConnection socketClientId', socketClientId);
            $log.debug('|');
            $log.debug('|');

            UserSessionService.putValueByKey('smSocketClientId', socketClientId);

            //$log.debug('|   currentUser.smUserId', smGlobalValues.currentUser.smSocketClientId);

          });


          $scope.activateAskForm = false;

          $scope.postAnAsk = function() {
            $log.debug('POST AN ASK');

              $scope.activateAskForm = true;
            /*
            * In order to post an ask a user must register
            * should follow the process that craigslist does
            * - simple wizard
            * - post up what you have for sale
            * - email address and password (if not logged in)
            * - on submit check email address
            * - send post to email
            * - request for password (login if has account)
            * - updload images and or video
            * - preview to confirm
            * - make sure we have geo relevant info
            * - post to market
            *
            *
            * */
          }
        }
      ]
    }
  }
]);
