UI.directive('smUiCanvasCropper', [
  function() {
    return {
      scope: {
        width: '@',
        height: '@',
        profile: '=',
        property: '@'
      },
      templateUrl: './scripts/modules/ui/templates/ui.canvas.cropper.html',
      controller: [
        '$scope',
        function($scope) {

          $scope.cropperCtx = {
            stateName: 'welcome',
            files: []
          };
          $scope.canvasCropper = {};

          if (!$scope.width) {
            $scope.width = 1500;
            $scope.height = 380;
          }

        }
      ],
      link: function(scope, el, attrs) {

        var element = document.getElementById('files');
        var reader = new FileReader();
        element.addEventListener("change", function (event) {
          scope.cropperCtx.files = event.target.files;

          reader.onload = function(event) {
            scope.cropperCtx.currentImage = new Image();

            scope.cropperCtx.currentImage.onload = function (e) {
              var h = scope.height;
              var w = scope.width;
              if (scope.cropperCtx.currentImage.width < w) {
                console.warn('this image is not very big and will be stretched consider using a larger one');
                var delta = w - scope.cropperCtx.currentImage.width;
                var percent = delta / w;
                scope.cropperCtx.currentImage.width = w;
                scope.cropperCtx.currentImage.height = (1 + percent) * scope.cropperCtx.currentImage.height;
              }
              if (scope.cropperCtx.currentImage.height < h) {
                var delta2 = h - scope.cropperCtx.currentImage.height;
                var percent2 = delta2 / w;
                scope.cropperCtx.currentImage.width = (1 + percent2) * scope.cropperCtx.currentImage.width;
                scope.cropperCtx.currentImage.height = (1 + percent2) * scope.cropperCtx.currentImage.height;

                scope.cropperCtx.currentImage.height = h;
              }
              scope.canvasCropper.initEditorView(scope.cropperCtx.currentImage);
              scope.canvasCropper.zoomScale();
              scope.canvasCropper.drawFrameCanvas();
            };
            scope.cropperCtx.currentImage.src = reader.result;

          };
          reader.readAsDataURL(scope.cropperCtx.files[0]);
        });


        scope.cropperCtx.cropIt = function() {
          scope.profile[scope.property] = scope.canvasCropper.cropIt();
          scope.$parent.saveCurrentProfile();
          scope.canvasCropper.reset();
          scope.cropperCtx.files = [];

        };

        scope.$watch('cropperCtx.stateName', function(newVal, oldVal) {

          switch(scope.cropperCtx.stateName) {

            case 'welcome':

              break;

            case 'active':

              break;

            case 'cropped':

              break;

            default:
              break;

          }


        }, true);
        //scope.cropperCtx.cropIt = function() {
        //  var quality = 0.7;
        //  var output = mainCanvas.toDataURL('image/jpeg', quality);
        //  var textArea = document.getElementById('Output');
        //  textArea.value = output;
        //
        //
        //  document.getElementById("imageid").style.display='block';
        //  document.getElementById("Output").style.display='block';
        //  document.getElementById("controls").style.display= 'none';
        //  document.getElementById("ImageMetrics").style.display= 'none';
        //  document.getElementById('MainCanvas');  // Main Canvas for cropping images
        //  document.getElementById('FrameCanvas'); // Guide Canvas indicating state of zoom and scroll
        //  document.getElementById('ScaleSlider'); // Zoom scale control
        //
        //  document.getElementById("CropButton").style.display='none';
        //  document.getElementById("ResetButton").style.display='none';
        //
        //  // stats display
        //  document.getElementById('scaleOutput');
        //  document.getElementById('scaledWidth');
        //  document.getElementById('scaledHeight');
        //  document.getElementById('sourceWidth');
        //  document.getElementById('sourceHeight');
        //  document.getElementById('scaleLimit');
        //  document.getElementById('scalePercent');
        //
        //
        //
        //
        //  frameCanvas.style.display = 'none';
        //  mainCanvas.style.display = 'none';
        //
        //
        //
        //  scope.profile.bannerImage = output;
        //  scope.$parent.saveCurrentProfile();
        //  that.reset();
        //};





        // stats

        /*
        *            function updateStats() {
         var scaleInstrument = document.getElementById('scaleOutput');
         scaleInstrument.innerHTML = scale;  var scaledWidthEl = document.getElementById('scaledWidth');
         scaledWidthEl.innerHTML = scaledWidth;
         var scaledHeightEl = document.getElementById('scaledHeight');
         scaledHeightEl.innerHTML = scaledHeight;
         var sourceWidth = document.getElementById('sourceWidth');
         sourceWidth.innerHTML = image.width;
         var sourceHeight = document.getElementById('sourceHeight');
         sourceHeight.innerHTML = image.height;
         var scaleLimitEl = document.getElementById('scaleLimit');
         scaleLimitEl.innerHTML = scaleLimit;
         var scalePercentEl = document.getElementById('scalePercent');
         scalePercentEl.innerHTML = scalePercent;
         }
         // stats display
         document.getElementById('scaleOutput');
         document.getElementById('scaledWidth');
         document.getElementById('scaledHeight');
         document.getElementById('sourceWidth');
         document.getElementById('sourceHeight');
         document.getElementById('scaleLimit');
         document.getElementById('scalePercent');
        *
        *
        * */
        scope.reset = function() {


          scope.canvasCropper = (function() {

            var mainCanvas = document.getElementById('MainCanvas');  // Main Canvas for cropping images
            var frameCanvas = document.getElementById('FrameCanvas'); // Guide Canvas indicating state of zoom and scroll
            var scaleSlider = document.getElementById('ScaleSlider'); // Zoom scale control

            var mainContext;
            var guideContext;
            var w, h; // global main canvas target width and height
            var workingCanvas; // working canvas (virtual)
            var workingContext; // working context
            var dragging = false; // flag indicating if draggin is active (mouse down within canvas)
            var orientation = 'landscape'; // default orientation
            var image; // working image
            var mouseZeroY; // y origin for mouse drag events
            var currentMaxY;  // originY * scale percent
            var scale, minimumScale, maximumScale, scalePercent; // slider constraints
            var originY; // y coordinate of fresh source image
            var srcXCoord, srcYCoord;  // x and y coordinates within working canvas of source of sample slice
            var scaledWidth; // width of scaled image
            var scaledHeight;// heigth of scaled image
            var shrinkLimit = false; // if either width or height of scaled image matches the main canvas dimensions
            var guideCurrY;  // where the frame guide is vertically




            document.getElementById("ScaleSlider").style.display='none';
            document.getElementById("CropButton").style.display='none';
           // document.getElementById("ResetButton").style.display='none';

            w = scope.width;
            h = scope.height;


            function _cropIt() {
              var quality = 0.7;
              var output = mainCanvas.toDataURL('image/jpeg', quality);



              document.getElementById("imageid").style.display='block';

              //document.getElementById('MainCanvas');  // Main Canvas for cropping images
              //document.getElementById('FrameCanvas'); // Guide Canvas indicating state of zoom and scroll
              //document.getElementById('ScaleSlider'); // Zoom scale control

              document.getElementById("controls").style.display= 'block';

              document.getElementById("CropButton").style.display='none';
              //document.getElementById("ResetButton").style.display='none';
              document.getElementById("ImageMetrics").style.display='none';




              frameCanvas.style.display = 'none';
              //mainCanvas.style.display = 'none';



              return output;


            }







            var getMouseRef = function(event, element) {
              var offsetX = 0, offsetY = 0, mx, my;
              if (element && element.offsetParent) {
                // Compute the total offset
                if (element.offsetParent !== undefined) {
                  do {
                    offsetX += element.offsetLeft;
                    offsetY += element.offsetTop;
                  } while ((element = element.offsetParent));
                }
                mx = event.pageX - offsetX;
                my = event.pageY - offsetY;
              }
              return {x: mx, y: my};

            };
            function setOrientation() {
              if (image && image.width) {
                orientation = 'landscape';
                if (image.width < image.height) {
                  orientation = 'portrait';
                }
              }
            }












































            function drawMainCanvas() {
              mainContext.clearRect(0, 0, w, h);
              mainContext.drawImage(workingCanvas, srcXCoord, srcYCoord, w, h, 0, 0, w, h);
            }



            function _zoomScale() {
              scale = scaleSlider.value;

              if (scale <= w) {
                scale = w;
                scaleLimit = scale;
                shrinkLimit = true;
              }
              if (scale > w) {
                shrinkLimit = false;
              }


              if (scale > scaleLimit) {
                shrinkLimit = false;
              }


              if (!shrinkLimit) {
                scalePercent = (scale / scaleSlider.max);
                scaledWidth = image.width * scalePercent;
                scaledHeight = image.height * scalePercent;
              }


              if (scaledWidth < w) {
                shrinkLimit = true;
                if (!scaleLimit) {
                  scaleLimit = scale;
                }
                scaledWidth = w;
              }
              else {
                if (scaledHeight > h) {
                  shrinkLimit = false;
                }
              }
              if (scaledHeight < h) {
                shrinkLimit = true;
                if (!scaleLimit) {
                  scaleLimit = scale;
                }
                scaledHeight = h;
              }
              else {
                if (scaledWidth > w) {
                  shrinkLimit = false;
                }
              }

              if (!shrinkLimit) {
                workingCanvas.width = scaledWidth;
                workingCanvas.height = scaledHeight;

                workingContext.clearRect(0, 0, scaledWidth, scaledHeight);
                workingContext.drawImage(image, 0, 0, scaledWidth, scaledHeight);

                srcYCoord = (scaledHeight - h) / 2;
                srcXCoord = (scaledWidth - w) / 2;

                drawMainCanvas();
                scrollFrameGuide();
                updateInstrumentationCanvas();
                //updateStats();
              }

            }

            function scrollImage(y) {
              currentMaxY = scaledHeight - mainCanvas.height;
              if ((srcYCoord > 0) && (srcYCoord < currentMaxY)) {
                drawMainCanvas();
                _drawFrameCanvas();
              }
            }

            function scrollFrameGuide() {
              var guideDisplayWidth = 300;
              var guideDisplayHeight = 200;
              if (orientation === 'portrait') {
                guideDisplayWidth = 200;
                guideDisplayHeight = 300;
              }
              var guideRectWidth = (w / scaledWidth) * guideDisplayWidth;
              var guideRectHeight = (h / scaledHeight) * guideDisplayHeight;

              var guideMaxY = (guideDisplayHeight - guideRectHeight);
              var guideRatio = (srcYCoord * -1) / (scaledHeight - h);
              guideCurrY = guideMaxY * (guideRatio * -1);


              if (guideCurrY > guideMaxY) {
                guideCurrY = guideMaxY;
              }
              if (guideCurrY < 0) {
                guideCurrY = 0;
              }

            }

            function _drawFrameCanvas() {
              var guideDisplayWidth = 300;
              var guideDisplayHeight = 200;
              if (orientation === 'portrait') {
                guideDisplayWidth = 200;
                guideDisplayHeight = 300;
              }
              guideContext.clearRect(0, 0, 300, 300);
              guideContext.drawImage(workingCanvas, 0,0,guideDisplayWidth,guideDisplayHeight);

              // process guide image
              var imageData = guideContext.getImageData(0, 0, guideDisplayWidth, guideDisplayHeight);
              var data = imageData.data;
              var length = data.length;
              for(var idx = 0; idx < length; idx+=4){
                data[idx + 3] = 100;
              }
              guideContext.putImageData(imageData, 0, 0);
              // end draw guide image

              var guideRectWidth = (w / scaledWidth) * guideDisplayWidth;
              var guideRectHeight = (h / scaledHeight) * guideDisplayHeight;
              var guideX = (guideDisplayWidth - guideRectWidth) / 2;



              var guideMaxY = (guideDisplayHeight - guideRectHeight);
              var guideRatio = (srcYCoord * -1) / (scaledHeight - h);
              guideCurrY = guideMaxY * (guideRatio * -1);

              guideContext.fillStyle = "rgba(10,110,220, .45)";
              guideContext.fillRect(guideX, guideCurrY, guideRectWidth, guideRectHeight);

            }

            function updateInstrumentationCanvas(guideY) {
              var guideDisplayWidth = 300;
              var guideDisplayHeight = 200;
              if (orientation === 'portrait') {
                guideDisplayWidth = 200;
                guideDisplayHeight = 300;
              }
              guideContext.clearRect(0, 0, 300, 300);
              guideContext.drawImage(workingCanvas, 0,0,guideDisplayWidth,guideDisplayHeight);
              //
              //// process guide image
              var imageData = guideContext.getImageData(0, 0, guideDisplayWidth, guideDisplayHeight);
              var data = imageData.data;
              var length = data.length;
              for(var idx = 0; idx < length; idx+=4){
                data[idx + 3] = 100;
              }
              guideContext.putImageData(imageData, 0, 0);
              //end draw guide image

              var guideRectWidth = (w / scaledWidth) * guideDisplayWidth;
              var guideRectHeight = (h / scaledHeight) * guideDisplayHeight;
              var guideX = (guideDisplayWidth - guideRectWidth) / 2;

              var guideMaxY = (guideDisplayHeight - guideRectHeight);

              guideContext.fillStyle = "rgba(10,110,220, .45)";
              guideContext.fillRect(guideX, guideCurrY, guideRectWidth, guideRectHeight);

            }

            function updateRange(e) {
              scale = Number(e.target.value);
              if (scale < scaleSlider.min) {
                scale = scaleSlider.min;
                scaleSlider.value = scale;
              }
              else if (scale > scaleSlider.max) {
                scale = scaleSlider.max;
                scaleSlider.value = scale;
              }
              _zoomScale();
            }




// assign event handlers
            scaleSlider.oninput = updateRange;

            mainCanvas.addEventListener('mouseup', function(e) {
              dragging = false;
            }, true);
            document.addEventListener('mouseup', function(e) {
              dragging = false;
            }, true);

//fixes a problem where double clicking causes text to get selected on the canvas
            mainCanvas.addEventListener('selectstart', function(e) {
              e.preventDefault();
              return false;
            }, false);


// Up, down, and move are for dragging
            mainCanvas.addEventListener('mousedown', function(e) {
              var mouse = getMouseRef(e, mainCanvas);
              dragging = true;
              mouseZeroY = mouse.y;
            }, true);


            mainCanvas.addEventListener('mousemove', function(e) {
              if (dragging){
                var mouse = getMouseRef(e, mainCanvas);
                if (mouse.y > mouseZeroY) {
                  srcYCoord = srcYCoord - 5;
                }
                else {
                  srcYCoord = srcYCoord + 5;
                }
                scrollImage();
              }
            }, true);


            frameCanvas.addEventListener('mouseup', function(e) {
              dragging = false;
            }, true);
            document.addEventListener('mouseup', function(e) {
              dragging = false;
            }, true);

//fixes a problem where double clicking causes text to get selected on the canvas
            frameCanvas.addEventListener('selectstart', function(e) {
              e.preventDefault();
              return false;
            }, false);


// Up, down, and move are for dragging
            frameCanvas.addEventListener('mousedown', function(e) {
              var mouse = getMouseRef(e, frameCanvas);
              dragging = true;
              mouseZeroY = mouse.y;
            }, true);


            frameCanvas.addEventListener('mousemove', function(e) {
              console.log('| dragging', dragging);
              if (dragging){
                var mouse = getMouseRef(e, frameCanvas);
                if (mouse.y > mouseZeroY) {
                  if (srcYCoord < currentMaxY) {
                    guideCurrY = guideCurrY + 2;
                    srcYCoord = srcYCoord + 5;
                  }
                  else {
                    guideCurrY = guideCurrY;
                    srcYCoord = srcYCoord;
                  }

                }
                else {
                  if (srcYCoord > 0) {
                    guideCurrY = guideCurrY - 2;
                    srcYCoord = srcYCoord - 5;
                  }
                  else {
                    guideCurrY = guideCurrY;
                    srcYCoord = srcYCoord;
                  }
                }
                updateInstrumentationCanvas(guideCurrY);
                scrollImage();
              }
            }, true);

            return {
              initEditorView: function(imageArg) {
                image = imageArg;
                shrinkLimit = false;
                scalePercent = 0;
                setOrientation();

                dragging = false;
                mainContext = mainCanvas.getContext('2d');
                guideContext = frameCanvas.getContext('2d');
                workingCanvas = document.createElement('canvas');
                workingContext = workingCanvas.getContext('2d');
                scaleSlider.max = image.width;
                scaleSlider.value = image.width;
                scaleSlider.min = w;
                minimumScale = w;
                scaledWidth = image.width;
                scaledHeight = image.height;
                originY = ((image.height - mainCanvas.height) / 2 ) * -1;
                originX = ((image.width - mainCanvas.width) / 2 ) * -1;
                mainContext.clearRect(0, 0, w, h);

                document.getElementById("controls").style.display='block';
                document.getElementById("ImageMetrics").style.display='block';
                document.getElementById("ScaleSlider").style.display='inline-block';
                document.getElementById("CropButton").style.display='inline-block';
                document.getElementById("ResetButton").style.display='inline-block';
                mainCanvas.style.display='block';
                frameCanvas.style.display='block';
              },
              zoomScale: function() {
                _zoomScale();
              },
              drawFrameCanvas: function() {
                _drawFrameCanvas();
              },
              cropIt: function() {
                return _cropIt();
              },
              reset: function() {
                //mainCanvas = document.getElementById('MainCanvas');  // Main Canvas for cropping images
                //frameCanvas = document.getElementById('FrameCanvas'); // Guide Canvas indicating state of zoom and scroll
                //scaleSlider = document.getElementById('ScaleSlider'); // Zoom scale control

                //mainContext;
                //guideContext;
              //  var w, h; // global main canvas target width and height
                //var workingCanvas; // working canvas (virtual)
               // var workingContext; // working context
                dragging = false; // flag indicating if draggin is active (mouse down within canvas)
                orientation = 'landscape'; // default orientation
                image = null; // working image
                shrinkLimit = false; // if either width or height of scaled image matches the main canvas dimensions
               // var guideCurrY;  // where the frame guide is vertically




                document.getElementById("ScaleSlider").style.display='none';
                document.getElementById("CropButton").style.display='none';
                //document.getElementById("ResetButton").style.display='none';

                w = scope.width;
                h = scope.height;
                mainCanvas.width = w;

              }
            };
          }());





















        };


        scope.reset();







      }

    }
  }
]);
UI.directive('smUiBannerImageEditor', [
  function() {
    return {
      restrict: 'E',
      scope: {
        profile: '='
      },
      templateUrl: './scripts/modules/ui/templates/ui.banner.image.editor.html',
      controller: [
        '$scope',
        function($scope) {
          $scope.bannerImageCtx = {};
          $scope.bannerImageCtx.currentFile = {};
          $scope.bannerImageCtx.isShowImageStats = true;

          $scope.bannerImageCtx.closeImageStats = function() {
            $scope.bannerImageCtx.isShowImageStats = false;
          };

        }
      ],
      link: function(scope, el, attrs) {

      }
    }
  }
]);
UI.directive('smUiAvatarEditor', [
  function() {
    return {
      restrict: 'E',
      scope: {
        profile: '=',
        property: '@'
      },
      templateUrl: './scripts/modules/ui/templates/ui.avatar.editor.html',
      controller: [
        '$scope',
        '$timeout',
        function($scope, $timeout) {
          $scope.avatarEditorCtx = {};

          $scope.imageCropStep = 1;
          $scope.avatarEditorCtx.imageCropResult = null;
          $scope.avatarEditorCtx.showImageCropper = false;
          $scope.avatarEditorCtx.isShowReset = false;
          $scope.toggleCropReset = false;

          $scope.$watch('avatarEditorCtx.imageCropResult', function(newVal) {
            if (newVal) {
              console.log('imageCropResult', newVal);
            }
          });

          $scope.avatarEditorCtx.resetEditor = function() {
            $timeout(function() {
              $scope.avatarEditorCtx.isShowReset = false;
              $scope.avatarEditorCtx.isShowCropPreview = false;
              $scope.avatarEditorCtx.imageCropResult = '';
              $scope.avatarEditorCtx.showImageCropper = false;
              $scope.imageCropStep = 1;
              $scope.toggleCropReset = !$scope.toggleCropReset;

            }, 25);

          };
          $scope.avatarEditorCtx.stepBack = function() {
            if ($scope.imageCropStep > 1) {
              $scope.imageCropStep = ($scope.imageCropStep -1);
            }
          };
          $scope.avatarEditorCtx.saveImage = function() {
            $scope.profile[$scope.property] = $scope.avatarEditorCtx.imageCropResult;
            $scope.$parent.saveCurrentProfile();
          };
          $scope.$watch('imageCropStep', function(newVal, oldVal) {
            //if (newVal !== oldVal) {
              console.log('Step Changed', newVal);
           // }
            switch(newVal) {
              case 1:
                // hide reset button
                // reset result value
                $scope.avatarEditorCtx.isShowCropPreview = false;
                $scope.avatarEditorCtx.isShowReset = false;
                break;
              case 2:
                $scope.avatarEditorCtx.isShowCropPreview = false;
                $scope.avatarEditorCtx.isShowReset = true;
                break;
              case 3:
                $scope.avatarEditorCtx.isShowCropPreview = true;
                $scope.avatarEditorCtx.isShowReset = true;
                break;
              default:
                $scope.avatarEditorCtx.isShowCropPreview = false;
                $scope.avatarEditorCtx.isShowReset = false;

            }
          }, true);


        }
      ]

    }
  }
]);
/*
*
* Borrowed heavily from https://github.com/andyshora/angular-image-crop
*  AngularJS Directive - Image Crop v1.1.0
*  Copyright (c) 2014 Andy Shora, andyshora@gmail.com, andyshora.com
*  Licensed under the MPL License [http://www.nihilogic.dk/licenses/mpl-license.txt]
*
* */
UI.directive('smUiImageCrop', [
  function() {

    return {
      templateUrl: './scripts/modules/ui/templates/ui.image.crop.html',
      replace: true,
      restrict: 'AE',
      scope: {
        width: '@',
        height: '@',
        shape: '@',
        result: '=',
        step: '=',
        toggleCropReset: '@'
      },
      link: function (scope, element, attributes) {

        scope.rand = Math.round(Math.random() * 99999);
        scope.step = scope.step || 1;
        scope.shape = scope.shape || 'circle';
        scope.width = parseInt(scope.width, 10) || 300;
        scope.height = parseInt(scope.height, 10) || 300;

        scope.canvasWidth = scope.width + 100;
        scope.canvasHeight = scope.height + 100;

        var $elm = element[0];

        var $input = $elm.getElementsByClassName('image-crop-input')[0];
        var $canvas = $elm.getElementsByClassName('cropping-canvas')[0];
        var $handle = $elm.getElementsByClassName('zoom-handle')[0];
        var $finalImg = $elm.getElementsByClassName('image-crop-final')[0];
        var $img = new Image();
        var fileReader = new FileReader();

        var maxLeft = 0, minLeft = 0, maxTop = 0, minTop = 0, imgLoaded = false, imgWidth = 0, imgHeight = 0;
        var currentX = 0, currentY = 0, dragging = false, startX = 0, startY = 0, zooming = false;
        var newWidth = imgWidth, newHeight = imgHeight;
        var targetX = 0, targetY = 0;
        var zoom = 1;
        var maxZoomGestureLength = 0;
        var maxZoomedInLevel = 0, maxZoomedOutLevel = 2;
        var minXPos = 0, maxXPos = 50, minYPos = 0, maxYPos = 50; // for dragging bounds

        var zoomWeight = .4;
        var ctx = $canvas.getContext('2d');
        var exif = null;
        var files = [];

        // ---------- INLINE STYLES ----------- //
        scope.moduleStyles = {
          width: (scope.width + 100) + 'px',
          height: (scope.height + 100) + 'px'
        };

        scope.sectionStyles = {
          width: (scope.width + 100) + 'px',
          height: (scope.height + 100) + 'px'
        };

        scope.croppingGuideStyles = {
          width: scope.width + 'px',
          height: scope.height + 'px',
          top: '50px',
          left: '50px'
        };

        // ---------- EVENT HANDLERS ---------- //
        fileReader.onload = function(e) {
          $img.src = this.result;
          scope.step = 2;
          scope.$apply();

          var byteString = atob(this.result.split(',')[1]);
          var binary = new BinaryFile(byteString, 0, byteString.length);
          exif = EXIF.readFromBinaryFile(binary);

        };

        scope.imgCropReset = function() {
          files = [];
          zoom = 1;
          ctx.clearRect(0, 0, $canvas.width, $canvas.height);
          $input.value = null;
          $img.src = '';
          scope.step = 1;
        };
        scope.$watch('toggleCropReset', function(newVal, oldVal) {
          scope.imgCropReset();
        }, true);

        element.on('change', function(e){
          files = e.target.files;
          fileReader.readAsDataURL(files[0]);
        });


        $img.onload = function() {
          ctx.drawImage($img, 0, 0);

          imgWidth = $img.width;
          imgHeight = $img.height;

          if (exif && exif.Orientation) {

            // change mobile orientation, if required
            switch(exif.Orientation){
              case 1:
                // nothing
                break;
              case 2:
                // horizontal flip
                ctx.translate(imgWidth, 0);
                ctx.scale(-1, 1);
                break;
              case 3:
                // 180 rotate left
                ctx.translate(imgWidth, imgHeight);
                ctx.rotate(Math.PI);
                break;
              case 4:
                // vertical flip
                ctx.translate(0, imgHeight);
                ctx.scale(1, -1);
                break;
              case 5:
                // vertical flip + 90 rotate right
                ctx.rotate(0.5 * Math.PI);
                ctx.scale(1, -1);
                break;
              case 6:
                // 90 rotate right
                ctx.rotate(0.5 * Math.PI);
                ctx.translate(0, -imgHeight);
                break;
              case 7:
                // horizontal flip + 90 rotate right
                ctx.rotate(0.5 * Math.PI);
                ctx.translate(imgWidth, -imgHeight);
                ctx.scale(-1, 1);
                break;
              case 8:
                // 90 rotate left
                ctx.rotate(-0.5 * Math.PI);
                ctx.translate(-imgWidth, 0);
                break;
              default:
                break;
            }
          }

          minLeft = (scope.width + 100) - this.width;
          minTop = (scope.height + 100) - this.height;
          newWidth = imgWidth;
          newHeight = imgHeight;

          // console.log('canvas width', $canvas.width);
          // console.log('image width', imgWidth);

          maxZoomedInLevel = ($canvas.width - 100) / imgWidth;
          // console.log('maxZoomedInLevel', maxZoomedInLevel);

          maxZoomGestureLength = to2Dp(Math.sqrt(Math.pow($canvas.width, 2) + Math.pow($canvas.height, 2)));
          // console.log('maxZoomGestureLength', maxZoomGestureLength);


          updateDragBounds();

        };

        // ---------- PRIVATE FUNCTIONS ---------- //
        function moveImage(x, y) {

          if ((x < minXPos) || (x > maxXPos) || (y < minYPos) || (y > maxYPos)) {
            // new position is out of bounds, would show gutter
            return;
          }
          targetX = x;
          targetY = y;
          ctx.clearRect(0, 0, $canvas.width, $canvas.height);
          ctx.drawImage($img, x, y, newWidth, newHeight);
        }

        function to2Dp(val) {
          return Math.round(val * 1000) / 1000;
        }

        function updateDragBounds() {
          // $img.width, $canvas.width, zoom

          minXPos = $canvas.width - ($img.width * zoom) - 50;
          minYPos = $canvas.height - ($img.height * zoom) - 50;

        }

        function zoomImage(val) {

          if (!val) {
            return;
          }


          var proposedZoomLevel = to2Dp(zoom + val);

          if ((proposedZoomLevel < maxZoomedInLevel) || (proposedZoomLevel > maxZoomedOutLevel)) {
            // image wont fill whole canvas
            // or image is too far zoomed in, it's gonna get pretty pixelated!
            return;
          }

          zoom = proposedZoomLevel;
          // console.log('zoom', zoom);

          updateDragBounds();

          //  do image position adjustments so we don't see any gutter
          if (proposedZoomLevel === maxZoomedInLevel) {
            // image fills canvas perfectly, let's center it
            ctx.clearRect(0, 0, $canvas.width, $canvas.height);
            ctx.drawImage($img, 0, 0, $canvas.width, $canvas.height);
            return;
          }

          newWidth = $img.width * zoom;
          newHeight = $img.height * zoom;

          var newXPos = currentX * zoom;
          var newYPos = currentY * zoom;

          // check if we've exposed the gutter
          if (newXPos < minXPos) {
            newXPos = minXPos;
          } else if (newXPos > maxXPos) {
            newXPos = maxXPos;
          }

          if (newYPos < minYPos) {
            newYPos = minYPos;
          } else if (newYPos > maxYPos) {
            newYPos = maxYPos;
          }

          // check if image is still going to fit the bounds of the box
          ctx.clearRect(0, 0, $canvas.width, $canvas.height);
          ctx.drawImage($img, newXPos, newYPos, newWidth, newHeight);
        }

        function calcZoomLevel(diffX, diffY) {

          var hyp = Math.sqrt( Math.pow(diffX, 2) + Math.pow(diffY, 2) );
          var zoomGestureRatio = to2Dp(hyp / maxZoomGestureLength);
          var newZoomDiff = to2Dp((maxZoomedOutLevel - maxZoomedInLevel) * zoomGestureRatio * zoomWeight);
          return diffX > 0 ? -newZoomDiff : newZoomDiff;
        }

        // ---------- SCOPE FUNCTIONS ---------- //

        $finalImg.onload = function() {
          var tempCanvas = document.createElement('canvas');
          tempCanvas.width = this.width - 100;
          tempCanvas.height = this.height - 100;
          tempCanvas.style.display = 'none';

          var tempCanvasContext = tempCanvas.getContext('2d');
          tempCanvasContext.drawImage($finalImg, -50, -50);

          $elm.getElementsByClassName('image-crop-section-final')[0].appendChild(tempCanvas);
          scope.result = tempCanvas.toDataURL();
          scope.$apply();



        };

        scope.crop = function() {
          scope.croppedDataUri = $canvas.toDataURL();
          scope.step = 3;
        };

        scope.onCanvasMouseUp = function(e) {

          if (!dragging) {
            return;
          }

          e.preventDefault();
          e.stopPropagation(); // if event was on canvas, stop it propagating up

          startX = 0;
          startY = 0;
          dragging = false;
          currentX = targetX;
          currentY = targetY;

          removeBodyEventListener('mouseup', scope.onCanvasMouseUp);
          removeBodyEventListener('touchend', scope.onCanvasMouseUp);
          removeBodyEventListener('mousemove', scope.onCanvasMouseMove);
          removeBodyEventListener('touchmove', scope.onCanvasMouseMove);
        };

        $canvas.addEventListener('touchend', scope.onCanvasMouseUp, false);

        scope.onCanvasMouseDown = function(e) {
          startX = e.type === 'touchstart' ? e.changedTouches[0].clientX : e.clientX;
          startY = e.type === 'touchstart' ? e.changedTouches[0].clientY : e.clientY;
          zooming = false;
          dragging = true;

          addBodyEventListener('mouseup', scope.onCanvasMouseUp);
          addBodyEventListener('mousemove', scope.onCanvasMouseMove);
        };

        $canvas.addEventListener('touchstart', scope.onCanvasMouseDown, false);

        function addBodyEventListener(eventName, func) {
          document.documentElement.addEventListener(eventName, func, false);
        }

        function removeBodyEventListener(eventName, func) {
          document.documentElement.removeEventListener(eventName, func);
        }

        scope.onHandleMouseDown = function(e) {

          e.preventDefault();
          e.stopPropagation(); // if event was on handle, stop it propagating up

          startX = lastHandleX = (e.type === 'touchstart') ? e.changedTouches[0].clientX : e.clientX;
          startY = lastHandleY = (e.type === 'touchstart') ? e.changedTouches[0].clientY : e.clientY;
          dragging = false;
          zooming = true;

          addBodyEventListener('mouseup', scope.onHandleMouseUp);
          addBodyEventListener('touchend', scope.onHandleMouseUp);
          addBodyEventListener('mousemove', scope.onHandleMouseMove);
          addBodyEventListener('touchmove', scope.onHandleMouseMove);
        };

        $handle.addEventListener('touchstart', scope.onHandleMouseDown, false);

        scope.onHandleMouseUp = function(e) {

          // this is applied on the whole section so check we're zooming
          if (!zooming) {
            return;
          }

          e.preventDefault();
          e.stopPropagation(); // if event was on canvas, stop it propagating up

          startX = 0;
          startY = 0;
          zooming = false;
          currentX = targetX;
          currentY = targetY;

          removeBodyEventListener('mouseup', scope.onHandleMouseUp);
          removeBodyEventListener('touchend', scope.onHandleMouseUp);
          removeBodyEventListener('mousemove', scope.onHandleMouseMove);
          removeBodyEventListener('touchmove', scope.onHandleMouseMove);
        };

        $handle.addEventListener('touchend', scope.onHandleMouseUp, false);


        scope.onCanvasMouseMove = function(e) {

          e.preventDefault();
          e.stopPropagation();

          if (!dragging) {
            return;
          }



          var diffX = startX - ((e.type === 'touchmove') ? e.changedTouches[0].clientX : e.clientX); // how far mouse has moved in current drag
          var diffY = startY - ((e.type === 'touchmove') ? e.changedTouches[0].clientY : e.clientY); // how far mouse has moved in current drag
          /*targetX = currentX - diffX; // desired new X position
           targetY = currentY - diffY; // desired new X position*/

          moveImage(currentX - diffX, currentY - diffY);

        };

        $canvas.addEventListener('touchmove', scope.onCanvasMouseMove, false);


        var lastHandleX = null, lastHandleY = null;

        scope.onHandleMouseMove = function(e) {

          e.stopPropagation();
          e.preventDefault();

          // this is applied on the whole section so check we're zooming
          if (!zooming) {
            return false;
          }

          var diffX = lastHandleX - ((e.type === 'touchmove') ? e.changedTouches[0].clientX : e.clientX); // how far mouse has moved in current drag
          var diffY = lastHandleY - ((e.type === 'touchmove') ? e.changedTouches[0].clientY : e.clientY); // how far mouse has moved in current drag

          lastHandleX = (e.type === 'touchmove') ? e.changedTouches[0].clientX : e.clientX;
          lastHandleY = (e.type === 'touchmove') ? e.changedTouches[0].clientY : e.clientY;

          var zoomVal = calcZoomLevel(diffX, diffY);
          zoomImage(zoomVal);

        };

        $handle.addEventListener('touchmove', scope.onHandleMouseMove, false);

      }
    };
  }
]);
UI.directive('smUiBannerImageUpload', [
  function() {
    return {
      restrict: 'E',
      controller: [
        '$scope',
        function($scope) {

        }
      ],
      link: function(scope, el, attrs) {
        ReactDOM.render(React.createElement(sm.BannerImageUpload, {scope:scope}), el[0]);
        //scope.$watch('entity.id', function(newVal, oldVal) {
        //
        //}, true);
        scope.$watch('bannerImageCtx.isShowImageStats', function(newVal, oldVal) {
          ReactDOM.render(React.createElement(sm.BannerImageUpload, {scope:scope}), el[0]);

        }, true);
      }
    }
  }
]);
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
UI.directive('smModalDialog', [
  '$log',
  function($log) {
    return {
      restrict: 'E',
      scope: {
        show: '='
      },
      replace: true, // Replace with the template below
      transclude: true, // we want to insert custom content inside the directive
      link: function(scope, element, attrs) {
        scope.dialogStyle = {};
        if (attrs.width)
          scope.dialogStyle.width = attrs.width;
        if (attrs.height)
          scope.dialogStyle.height = attrs.height;
        scope.hideModal = function() {
          scope.show = false;
        };
      },
      templateUrl: './scripts/modules/ui/templates/ui.modal.dialog.html'

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
