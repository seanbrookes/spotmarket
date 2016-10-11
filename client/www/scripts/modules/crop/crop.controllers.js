sm.Crop.controller('CropMainController', [
  '$scope',
  '$log',
  '$http',
  'CropServices',
  function($scope, $log, $http, CropServices) {
    $log.debug('Hello World Crop Controller');

    $scope.cropCtx = {
      currentCropType: '',
      currentCropSubType: '',
      currentCropSubTypes: [],
      currentCropTypes: []
    };
    loadCropTypes = function() {
      CropServices.getCropTypes()
        .then(function(response) {
          $scope.cropCtx.currentCropTypes = response;
        });
    };
    loadCropSubTypes = function() {
      CropServices.getCropSubTypes()
        .then(function(response) {
          $scope.cropCtx.currentCropSubTypes = response;
        });
    };
    loadCropTypes();
    loadCropSubTypes();
    $scope.addCropType = function() {
      if ($scope.cropCtx.currentCropType) {
        CropServices.saveCropType({name:$scope.cropCtx.currentCropType})
          .then(function(response) {
            $scope.cropCtx.currentCropType = '';
            loadCropTypes();
          });
      }
    };
    $scope.deleteCropType = function(typeRef) {
      if (typeRef) {
        if (confirm('delete type?')) {
          CropServices.deleteCropType(typeRef.id)
            .then(function(response) {
              $scope.cropCtx.currentCropType = '';
              loadCropTypes();
            });

        }

      }
    };
    $scope.addCropSubType = function() {
      if ($scope.cropCtx.currentCropSubType) {
        CropServices.saveCropSubType({name:$scope.cropCtx.currentCropSubType})
          .then(function(response) {
            $scope.cropCtx.currentCropSubType = '';
            loadCropSubTypes();
          });
      }
    };
  }

]);
