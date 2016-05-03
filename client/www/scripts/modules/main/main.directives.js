Main.directive('ggtHomeContent', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/main/templates/home.content.html',
      controller:['$scope', function($scope) {
        $scope.hopfarmUrl = '/#hopreport';
      }]
    }
  }
]);
