UI.directive('smUiCurrencyToggle', [
  '$log',
  function($log) {
    return {
      restrict: 'E',
      scope: {
        priceSrc: '='
      },
      templateUrl: './scripts/modules/ui/templates/ui.currency.toggle.html',
      controller: [
        '$scope',
        function($scope) {
          $scope.isChecked = true;
          if ($scope.priceSrc.currency && ($scope.priceSrc.currency !== 'CAD')) {
            $scope.isChecked = false;
          }
        }
      ],
      link: function(scope, el, attrs) {
        scope.$watch('isChecked', function(newVal, oldVal) {
          console.log('|   Currency Changed');
          if (newVal === true) {
            scope.priceSrc.currency = 'CAD';
          }
        }, true);

      }
    }
  }
]);
UI.directive('smUiAutoSuggest', [
  '$log',
  '$timeout',
  function($log, $timeout) {
    return {
      restrict:'E',
      scope: {
        componentValue: '=value',
        possibleValues: '='
      },
      templateUrl: './scripts/modules/ui/templates/ui.auto.suggest.html',
      controller: [
        '$scope',
        '$log',
        function($scope, $log) {
          $scope.ctx = {};
          $scope.isMenuVisible = false;
          $scope.isAllItmesMenuVisible = true;
          $scope.isMatchMenuVisible = true;
          $scope.ctx.possibleValuesList = [];
          $scope.ctx.itemFilters = {
            itemDirectMatchCollection: [],
            itemIndirectMatchCollection: []
          };

          $scope.resetItemMatchFilters = function() {

            //$timeout(function() {
              $scope.ctx.itemFilters = {
                itemDirectMatchCollection: [],
                itemIndirectMatchCollection: []
              };

            //}, 100);

          };


          $scope.closeMenu = function() {
            $scope.isMenuVisible = false;
          };
          $scope.toggleComponentMenuDisplay = function() {
            $scope.isMenuVisible = !$scope.isMenuVisible;
          };
          $scope.setComponentValue = function(value) {
            if (value) {
              $scope.componentValue = value;
              $timeout(function() {
                $scope.resetItemMatchFilters();
              }, 25);
              $timeout(function() {
                $scope.closeMenu();
              }, 85);



            }
          };


        }
      ],
      link:function(scope, el, attrs) {

        scope.label = attrs.label;
        scope.placeholder = attrs.placeholder;
        function isUniqueProductTypeMatch(testName) {
          if (!testName) {
            return false;
          }
          if (scope.ctx.itemFilters.itemDirectMatchCollection.length === 0) {
            return true;
          }
          var isUnique = true;
          var collection = scope.ctx.itemFilters.itemDirectMatchCollection;
          if (collection.map) {
            collection.map(function(collectionType) {
              if (testName.toLowerCase() === collectionType.name.toLowerCase()) {
                isUnique = false;
              }
            });
          }
          return isUnique;
        }
        function isUniqueProductTypeIndirectMatch(testName) {
          if (!testName) {
            return false;
          }
          if (scope.ctx.itemFilters.itemIndirectMatchCollection.length === 0) {
            return true;
          }
          var isUnique = true;
          var collection = scope.ctx.itemFilters.itemIndirectMatchCollection;
          if (collection.map) {
            collection.map(function(collectionType) {
              if (testName.toLowerCase() === collectionType.name.toLowerCase()) {
                isUnique = false;
              }
            });
          }
          return isUnique;
        }



        function getSimplifiedList(collection) {
          var retVal = [];
          scope.possibleValues.map(function(item) {
            retVal.push({
              name:item.name,
              value:item.name,
              id:item.id
            });
          });
          return retVal;
        }
        scope.$watch('possibleValues', function(newVal, oldVal) {
          console.log('it changes  B!! yay', newVal);
        //  $timeout(function() {
          if (newVal && newVal.length > 0) {
            scope.possibleValues = newVal;
            $timeout(function() {
              scope.ctx.possibleValuesList = getSimplifiedList(scope.possibleValues);
            }, 25);
          }


          // }, 25);
        }, true);

        scope.$watch('ctx.itemFilters.itemIndirectMatchCollection', function(newVal, oldVal) {
          if (scope.isMenuVisible && newVal && newVal.length > 0) {
            scope.isMatchMenuVisible = true;
            scope.isAllItmesMenuVisible = false;
          }

        }, true);
        scope.$watch('ctx.itemFilters.itemDirectMatchCollection', function(newVal, oldVal) {
          if (scope.isMenuVisible && newVal && newVal.length > 0) {
            scope.isMatchMenuVisible = true;
            scope.isAllItmesMenuVisible = false;
          }
        }, true);

        scope.$watch('componentValue', function(newVal, oldVal) {
          $log.debug('|  Updated Product Type Name Search Value', newVal);
          scope.resetItemMatchFilters();

          if (!newVal || newVal.length < 1) {
            //resetProductTypeUIFilters();
            return;
          }
          scope.isMenuVisible = true;

          if (scope.ctx.possibleValuesList && (scope.ctx.possibleValuesList.length > 0)) {
            var collection = scope.ctx.possibleValuesList;

            var isMatched = false;
            collection.map(function(item) {
              var collectionName = item.name.toLowerCase();
              var comparisonName = newVal.toLowerCase();
              if (collectionName.indexOf(comparisonName) === 0) {
                $log.debug('direct match', comparisonName);
                isMatched = true;
                if (isUniqueProductTypeMatch(collectionName)) {

                  scope.ctx.itemFilters.itemDirectMatchCollection.push(item);

                }
              }
              if (collectionName.indexOf(comparisonName) > 0) {
                $log.debug('indeirect match', comparisonName);
                isMatched = true;
                if (isUniqueProductTypeIndirectMatch(collectionName)) {

                  scope.ctx.itemFilters.itemIndirectMatchCollection.push(item);

                }
              }
            });
            //if (scope.ctx.itemFilters.itemDirectMatchCollection.length > 0 ||
            //  scope.ctx.itemFilters.itemIndirectMatchCollection.length > 0) {
            //  scope.isMenuVisible = true;
            //  scope.isAllItmesMenuVisible = false;
            //}
            //if (!isMatched) {
            //
            //  resetProductTypeUIFilters();
            //
            //}

          }

        }, true);
      }

    }
  }
]);
