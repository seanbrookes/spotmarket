
Main.directive('ggtHomeContent', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/home/templates/home.content.html',
      controller:['$scope', function($scope) {
        $scope.hopfarmUrl = '/#hopreport';
      }]
    }
  }
]);
