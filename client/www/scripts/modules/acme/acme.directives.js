Acme.directive('ggtAcme', [
  function() {
    return {
      restrict:'E',
      templateUrl: './scripts/modules/acme/templates/acme.main.html'
    }
  }
]);
//https://www.youtube.com/watch?v=3BSZR00b_Nw
Acme.directive('smBannerImageCropper', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/acme/templates/acme.banner.image.cropper.html',
      controller: [
        '$scope',
        function($scope) {
          $scope.bannerImageCtx = {};
          $scope.bannerImageCtx.currentImageData;
          $scope.bannerImageCtx.canvas;
          $scope.theFile;
          $scope.bannerImageCtx.maxWidth = 1500;
          $scope.bannerImageCtx.maxHeight = 380;
          $scope.bannerImageCtx.isShowImageStats = true;
          $scope.bannerImageCtx.closeImageStats = function() {
            $scope.bannerImageCtx.isShowImageStats = false;
          };
          $scope.bannerImageCtx.loadImageToggleSwitch = false;


          $scope.drawScaled = function() {
            var w = canvas.width, h = canvas.height, sw = w * scale, sh = h * scale;

            // Clear the offscreen canvas, and draw the image

            offscreenContext.clearRect(0, 0, canvas.width, canvas.height);
            offscreenContext.drawImage(offscreenCanvasExampleImage, 0, 0, canvas.width, canvas.height);

            context.drawImage(offscreenCanvas, 0, 0, offscreenCanvas.width, offscreenCanvas.height, -sw/2 + w/2 + h/2, sw, sh);
          };

          $scope.bannerImageCtx.uploadFiles = function(file, errFiles) {
            $scope.f = file;
            $scope.errFile = errFiles && errFiles[0];
            if (file) {


              var reader = new FileReader();
              reader.onload = function(event) {

                var maxWidth = 1500;
                var maxHeight = 380;

                var theFile = new Image();
                theFile.src = reader.result;
                $scope.bannerImageCtx.currentImage.src = theFile.src;
                var canvas = document.getElementsByClassName('smBannerImageCropper__Canvas')[0];
                var ctx = canvas.getContext('2d');
                var canvasCopy = document.createElement("canvas");
                var copyContext = canvasCopy.getContext("2d");

                theFile.onload = function() {
                  //if (this.width > max_width || this.height>max_height) {

                  //$scope.bannerImageCtx.currentFile = tempImg;




                  var ratio = 1;

                  if(theFile.width > maxWidth) {
                    ratio = maxWidth / theFile.width;
                  }
                  else if (theFile.height > maxHeight) {
                    ratio = maxHeight / theFile.height;

                  }


                  canvasCopy.width = theFile.width;
                  canvasCopy.height = theFile.height;
                  copyContext.drawImage(theFile, 0, 0);

                  canvas.width = theFile.width * ratio;
                  canvas.height = theFile.height * ratio;
                  ctx.drawImage(canvasCopy, 0, 0, canvasCopy.width, canvasCopy.height, 0, 0, canvas.width, canvas.height);















                  //canvas.width = $scope.bannerImageCtx.maxWidth;
                  //canvas.height = $scope.bannerImageCtx.maxHeight;
                  //
                  //var dimRatio = this.width / this.height;
                  //
                  //
                  //var x = $scope.theFile.height;
                  //var y = x - 380;
                  //var z = y / 2;
                  //var p = $scope.theFile.width;
                  //var q = p - 1500;
                  //var r = q / 2;
                  //
                  //
                  //
                  //var ctx = canvas.getContext('2d');
                  //
                  //ctx.drawImage($scope.theFile, 0, 0);

                  //var dataURL = canvas.toDataURL('image/png', 1);
                  //var n = dataURL.indexOf(',');
                  //var data = dataURL.toString().substring(n+1);

                };

              };

              reader.readAsDataURL(file);

            }
          };


          $scope.bannerImageCtx.chopInHalf = function() {
            var canvas = document.getElementsByClassName('smBannerImageCropper__Canvas')[0];

            canvas.width = $scope.bannerImageCtx.maxWidth;


            console.log('|    CHOP IN HALF', $scope.theFile.width);

            $scope.theFile.height = $scope.theFile.height / 2;
            $scope.theFile.width = $scope.theFile.width / 2;

            var ctx = canvas.getContext('2d');

            ctx.drawImage($scope.theFile, 10, 40);

          };
        }
      ],
      link:function(scope, el, attrs) {



        scope.$watch('bannerImageCtx.loadImageToggleSwitch', function(newVal, oldVal) {
          // recaluculate image?
        }, true);

        scope.testFunction = function() {
          if (scope.bannerImageCtx.currentFile && scope.bannerImageCtx.currentFile.type) {
            return Json.stringify(scope.bannerImageCtx.currentFile);

          }
          else {
            return null;
          }
        };

        //scope.$watch('bannerImageCtx.currentFile', function(newVal, oldVal) {
        //  if (scope.bannerImageCtx && scope.bannerImageCtx.currentFile) {
        //
        //
        //    var reader = new FileReader();
        //
        //    reader.readAsDataURL(scope.bannerImageCtx.currentFile);
        //
        //    reader.addEventListener("load", function (output) {
        //
        //      var imageString = output.target.result;
        //      //scope.$apply(function() {
        //      //  scope.$parent.userProfileCtx.triggerPreviewBannerImage();
        //      //
        //      //});
        //
        //    });
        //
        //  }
        //}, true);



















        //scope.$watch('bannerImageCtx.picFile', function(newVal, oldVal) {
        //  if (newVal && newVal[0]) {
        //    console.log('pick file', scope.askCtx.picFile);
        //
        //    var reader = new FileReader();
        //
        //    reader.readAsDataURL(scope.askCtx.picFile[0]);
        //
        //    reader.addEventListener("load", function (output) {
        //
        //      scope.askCtx.cropImgString = output.target.result;
        //
        //    });
        //
        //  }
        //}, true);
        //ReactDOM.render(React.createElement(sm.BannerImageCropper, {scope:scope}), el[0]);
        //
        //scope.$watch('bannerImageCtx.isShowImageStats', function(newVal, oldVal) {
        //  ReactDOM.render(React.createElement(sm.BannerImageCropper, {scope:scope}), el[0]);
        //
        //}, true);
      }
    }
  }
]);
