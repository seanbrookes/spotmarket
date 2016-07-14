Ask.controller('AskMainController', [
  '$scope',
  '$log',
  '$http',
  'ProductServices',
  'UserSessionService',
  'AskServices',
  function($scope, $log, $http, ProductServices, UserSessionService, AskServices) {

    $scope.askCtx = {};
    $scope.lotCtx = {currentLot:{}};
    function resetCurrentLot() {
      $scope.lotCtx.currentLot = {};
    }


    $scope.helpCtx = {
      content :{
        askHeadline: 'Headlines are your way of quickly describing what you are selling',
        lotMeasurePopover: 'Lot measure is the metric used to set your base price.'
      }
    };

    $scope.isShowFullDetails = false;

    $scope.dynamicPopover = {
      content: $scope.helpCtx.content['askHeadline'],
      title: 'Headine'
    };
    $scope.lotMeasurePopover = {
      content: $scope.helpCtx.content['lotMeasurePopover'],
      title: 'Lot size metric'
    };



    function initializeCurrentAsk() {
      $scope.askCtx.currentAsk = {
        productType: '',
        productSubType: '',
        headline: 'I am selling: ',
        lotPrices: []
      };
    }

    $scope.isShowAddLotPrice = false;
    $scope.togglePriceLotForm = function() {
      $scope.isShowAddLotPrice = !$scope.isShowAddLotPrice;
      resetCurrentLot();
    };
    $scope.addLotPriceToAsk = function() {
      if ($scope.lotCtx.currentLot && $scope.lotCtx.currentLot.price &&  $scope.lotCtx.currentLot.size &&  $scope.lotCtx.currentLot.measure) {
        $scope.askCtx.currentAsk.lotPrices.push($scope.lotCtx.currentLot);
        resetCurrentLot();
      }
    };

    $scope.productCtx = {
      currentProductType: {},
      isShowProductTypeMenu: false,
      isShowProductSubTypeMenu: false,
      currentProductSubType: {},
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
    $scope.askCtx.setCurrentProductType = function(productType) {
      $scope.askCtx.currentAsk.productType = productType;
      $scope.askCtx.currentAsk.headline = 'I am selling: ' + $scope.askCtx.currentAsk.productType;
      if ($scope.askCtx.currentAsk.productSubType) {
        $scope.askCtx.currentAsk.headline += ' variety: ' +  $scope.askCtx.currentAsk.productSubType
      }
      $scope.productCtx.isShowProductTypeMenu = false;
    };
    $scope.askCtx.setCurrentProductSubType = function(productSubType) {
      $scope.askCtx.currentAsk.productSubType = productSubType.name;
      $scope.askCtx.currentAsk.headline = 'I am selling: ' + $scope.askCtx.currentAsk.productType;
      if ($scope.askCtx.currentAsk.productSubType) {
        $scope.askCtx.currentAsk.headline += ' variety: ' +  $scope.askCtx.currentAsk.productSubType
      }

      $scope.productCtx.isShowProductSubTypeMenu = false;
    };

    $scope.askCtx.clearCurrentProductType = function() {
      $scope.currentAsk.productType = '';
    };
    loadProductTypes();
    loadProductSubTypes();

    $scope.productCtx.toggleProductTypeMenu = function() {
      $scope.productCtx.isShowProductTypeMenu = !$scope.productCtx.isShowProductTypeMenu;
    };
    $scope.isShowOtherLotMeasureInput = false;
    $scope.askCtx.onOtherLotMeasureChoice = function() {
      $scope.isShowOtherLotMeasureInput = true;
      $scope.lotCtx.currentLot.measure = '';
    };
    $scope.askCtx.onLotMeasureChoice = function() {
      $scope.isShowOtherLotMeasureInput = false;
      $scope.lotCtx.currentLot.otherMeasure = '';
    };
    $scope.productCtx.toggleProductSubTypeMenu = function() {
      $scope.productCtx.isShowProductSubTypeMenu = !$scope.productCtx.isShowProductSubTypeMenu;
    };
    $scope.addProductType = function() {
      if ($scope.productCtx.currentProductType) {
        ProductServices.saveProductType({name:$scope.productCtx.currentProductType})
          .then(function(response) {
            $scope.productCtx.currentProductType = '';
            loadProductTypes();
          });
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
    $scope.askCtx.isFormValid = function() {
      if ($scope.askCtx.currentAsk.productType && $scope.askCtx.currentAsk.productSubType && ($scope.askCtx.currentAsk.lotPrices.length > 0)) {
        return true;
      }
      return false;
    };
    $scope.askCtx.clearCurrentAsk = function() {
      initializeCurrentAsk();
    };

    $scope.saveAsk = function() {
      if ($scope.askCtx.currentAsk.productType) {
        var tempCurrentUser = UserSessionService.getCurrentUserFromClientState();
        var tempPos = JSON.parse(tempCurrentUser.smCurrentPosition);
        var tLon = parseFloat(tempPos.geometry.coordinates[0]);
        var tLat = parseFloat(tempPos.geometry.coordinates[1]);

        tempPos.geometry.coordinates[0] = tLon;
        tempPos.geometry.coordinates[1] = tLat;
        $scope.askCtx.currentAsk.geopoint = {
          'lng': tLon,
          'lat': tLat
        };

        $scope.askCtx.currentAsk.position = tempPos.geometry;
        AskServices.saveAsk($scope.askCtx.currentAsk)
          .then(function(response) {
            $log.debug('Ask Saved')
          });
      }
    };
    initializeCurrentAsk();
  }


]);
