Ask.directive('ggtAsk', [
  function() {
    return {
      restrict:'E',
      templateUrl: './scripts/modules/ask/templates/ask.main.html'
    }
  }
]);
Ask.directive('ggtLotForm', [
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
