Market.directive('smMarketMain', [
  function() {
    return {
      restrict:'E',
      templateUrl: './scripts/modules/market/templates/market.main.html',
      controller: [
        '$scope',
        '$log',
        function($scope, $log) {
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
