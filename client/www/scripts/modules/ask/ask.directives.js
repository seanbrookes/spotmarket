Ask.directive('smAsk', [
  function() {
    return {
      restrict:'E',
      templateUrl: './scripts/modules/ask/templates/ask.main.html'
    }
  }
]);
Ask.directive('smLotForm', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/ask/templates/ask.lot.form.html',
      link: [
        function(scope, el, attrs) {

        }
      ]
    }
  }
]);
