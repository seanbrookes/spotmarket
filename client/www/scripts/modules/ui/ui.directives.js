UI.directive('smUiAvatarEditor', [
  function() {
    return {
      restrict: 'E',
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
UI.directive('smUiSingleImageUpload', [
  function() {
    return {
      restrict: 'E',
      controller: [
        '$scope',
        function($scope) {

        }
      ],
      link: function(scope, el, attrs) {
        ReactDOM.render(React.createElement(sm.SingleImageUpload, {scope:scope}), el[0]);
        //scope.$watch('entity.id', function(newVal, oldVal) {
        //
        //}, true);
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
