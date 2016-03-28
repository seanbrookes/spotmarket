Product.controller('ProductMainController', [
  '$scope',
  '$log',
  '$http',
  'ProductServices',
  function($scope, $log, $http, ProductServices) {
    $log.debug('Hello World Product Controller');

    var socket = io.connect();

    $scope.productCtx = {
      currentProductType: '',
      currentProductSubType: '',
      currentProductSubTypes: [],
      currentProductTypes: []
    };
    loadProductTypes = function() {
      ProductServices.getProductTypes()
        .then(function(response) {
          $scope.productCtx.currentProductTypes = response;
        });
    };
    loadProductSubTypes = function() {
      ProductServices.getProductSubTypes()
        .then(function(response) {
          $scope.productCtx.currentProductSubTypes = response;
        });
    };
    loadProductTypes();
    loadProductSubTypes();
    $scope.addProductType = function() {
      if ($scope.productCtx.currentProductType) {
        ProductServices.saveProductType({name:$scope.productCtx.currentProductType})
          .then(function(response) {
            $scope.productCtx.currentProductType = '';
            loadProductTypes();
          });
      }
    };
    $scope.deleteProductType = function(typeRef) {
      if (typeRef) {
        if (confirm('delete type?')) {
          ProductServices.deleteProductType(typeRef.id)
            .then(function(response) {
              $scope.productCtx.currentProductType = '';
              loadProductTypes();
            });

        }

      }
    };
    $scope.addProductSubType = function() {
      if ($scope.productCtx.currentProductSubType) {
        ProductServices.saveProductSubType({name:$scope.productCtx.currentProductSubType})
          .then(function(response) {
            $scope.productCtx.currentProductSubType = '';
            loadProductSubTypes();
          });
      }
    };
  }

]);
