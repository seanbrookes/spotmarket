
Ask.directive('smAskWhatView', [
  '$log',
  function($log) {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/ask/templates/ask.what.view.html',
      controller: [
        '$scope',
        function($scope) {
          $log.debug('smAskWhatView directive controller');

          $scope.isShowMoreForm = false;
        }
      ]

    }
  }

]);
Ask.directive('smAskWhoView', [
  '$log',
  function($log) {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/ask/templates/ask.who.view.html',
      controller: [
        '$scope',
        function($scope) {
          $log.debug('smAskWhoView directive controller');
        }
      ]
    }
  }
]);
Ask.directive('smAskWhereView', [
  '$log',
  function($log) {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/ask/templates/ask.where.view.html',
      controller: [
        '$scope',
        function($scope) {
          $log.debug('smAskWhereView directive controller');
        }
      ]
    }
  }
]);
Ask.directive('smAskShippingView', [
  '$log',
  function($log) {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/ask/templates/ask.shipping.view.html',
      controller: [
        '$scope',
        function($scope) {
          $log.debug('smAskShippingView directive controller');
        }
      ]
    }
  }
]);
Ask.directive('smAskPriceView', [
  '$log',
  function($log) {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/ask/templates/ask.price.view.html',
      controller: [
        '$scope',
        function($scope) {
          $log.debug('smAskPriceView directive controller');

        }
      ]

    }
  }

]);
Ask.directive('smAskMarketView', [
  '$log',
  'CommonServices',
  'UserSessionService',
  function($log, CommonServices, UserSessionService) {
    return {
      restrict:'E',
      scope: {
        activeView: '='
      },
      templateUrl: './scripts/modules/ask/templates/ask.market.view.html',
      controller: [
        '$scope',
        '$http',
        '$timeout',
        'ProductServices',
        'AskServices',
        'GeoServices',
        'Upload',
        'MARKET_CONST',
        function($scope, $http, $timeout, ProductServices, AskServices, GeoServices, Upload, MARKET_CONST) {

          $scope.askCtx = {
            viewName: MARKET_CONST.ASK_VIEW,
            seller: {},
            productFilters: {
              productTypeDirectMatchCollection: [],
              productTypeIndirectMatchCollection: [],
              productVariantDirectMatchCollection: [],
              productVariantIndirectMatchCollection: []
            }
          };
          $scope.askCtx.seller.handleSuggestionHistory = [];
          $scope.askCtx.seller.handleSuggestionHistoryIndex = 0;
          $scope.askCtx.seller.handleSearchDefaultHandleAlphaOnly = false;
          $scope.askCtx.currentAsk = {
            seller: {},
            productType: '',  // ask converts to a string for name property shortand
            variant: '',
            headline: '',
            lotPrices: []
          };

          $scope.uploadPic = function(file) {
            var currentUser = UserSessionService.getCurrentUserFromClientState();
            file.upload = Upload.upload({
              url: 'http://localhost:4546/askupload',
              data: { file: file, smToken: currentUser.smToken, askId: 'booga-booga-googa' }
            });

            file.upload.then(function (response) {
              $timeout(function () {
                file.result = response.data;
              });
            }, function (response) {
              if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
              // Math.min is to fix IE which reports 200% sometimes
              file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
          };

          $scope.init = function(user) {

            $scope.askCtx.productFilters = {
              productTypeDirectMatchCollection: [],
              productTypeIndirectMatchCollection: [],
              productVariantDirectMatchCollection: [],
              productVariantIndirectMatchCollection: []
            };
            $scope.askCtx.seller.handleSuggestionHistory = [];
            $scope.askCtx.seller.handleSuggestionHistoryIndex = 0;
            $scope.askCtx.seller.handleSearchDefaultHandleAlphaOnly = false;

            if (!user) {
              user = UserSessionService.getCurrentUserFromClientState();
            }
            if (!user.smCurrentPosition) {
              //alert('Message from AskController we do not have a default location');
            }

            if (user.smEmail) {
              $scope.askCtx.currentAsk.seller.email = user.smEmail;
            }
            if (user.smToken) {
              $scope.askCtx.currentAsk.seller.smToken = user.smToken;
            }
            if (user.smAuthToken) {
              $scope.askCtx.currentAsk.seller.smAuthToken = user.smAuthToken;
            }
            if (user.smHandle) {
              $scope.askCtx.currentAsk.seller.handle = user.smHandle;
            }
            else {
              $scope.askCtx.currentAsk.seller.handle = UserSessionService.generateNewUserTag()
                .then(function(response) {
                  $scope.askCtx.currentAsk.seller.handle = response;
                });
            }

            // check if user has user preferences for lot price option
            // set default user price lot measure option
            $scope.lotCtx.currentLot.measure = 'kg';
            //lotCtx.currentLot.measure
          }; // end init





          $scope.isShowOtherLotMeasureInput = false;
          $scope.isShowAddLotPrice = false;

          $scope.validationClassNames = {
            askSellerEmailInput: 'SellerInput--invalid'
          };
          $scope.isShowFullDetails = false;
          $scope.helpCtx = {
            content :{
              askHeadline: 'Headlines are your way of quickly describing what you are selling',
              lotMeasurePopover: 'Lot measure is the metric used to set your base price.'
            }
          };
          $scope.dynamicPopover = {
            content: $scope.helpCtx.content['askHeadline'],
            title: 'Headine'
          };
          $scope.lotMeasurePopover = {
            content: $scope.helpCtx.content['lotMeasurePopover'],
            title: 'Lot size metric'
          };

          /*
          *
          * LOT CTX
          *
          * */
         $scope.lotCtx = {
           currentLot:{
            measure:'kg',
            size:1
          }};
          $scope.lotCtx.measureOptions = [
            {value: 'bale'},
            {value: 'gram'},
            {value: 'kg'},
            {value: 'lb'},
            {value: 'ml'},
            {value: 'litre'},
            {value: 'oz (us)'},
            {value: 'oz (imp)'},
            {value: 'ton'},
            {value: 'other'}
          ];


          function resetCurrentLot() {
            $scope.lotCtx.currentLot = {
              measure:'kg',
              size:1
            };
          }
          function loadProductTypes() {
            ProductServices.getProductTypes()
              .then(function(response) {
                $scope.productCtx.currentProductTypes = response;
              });
          };
          function loadProductSubTypes() {
            ProductServices.getProductSubTypes()
              .then(function(response) {
                $scope.productCtx.currentProductVariants = response;
              });
          };



          /*
          *
          * PRODUCT MODE
          *
          * */
          $scope.askCtx.isProductModeButtonClassActive = function(productMode) {
            if (!$scope.askCtx.productMode) {
              return false;
            }
            if (productMode === $scope.askCtx.productMode) {
              return true;
            }
            return false;
          };
          /*
          *
          *
          * IMAGE UPLOAD
          *
          *
          * */
          $scope.askCtx.startImageUpload = function() {
            $log.debug('start the image upload flow for current ask');
            // open modal
          };
          $scope.askCtx.imgUploadDataChanged = function() {
            $log.debug('image upload data changed');
          };

          /*
          *
          * HANDLE GENERATOR METHODS
          *
          * */
          $scope.askCtx.refreshSuggestedHandle = function() {
            var options = {aphaOnly:$scope.askCtx.seller.handleSearchDefaultHandleAlphaOnly};
            $scope.askCtx.currentAsk.seller.handle = UserSessionService.generateNewUserTag(options)
              .then(function(response) {
                $scope.askCtx.currentAsk.seller.handle = response;
                UserSessionService.addUserHandleSuggestionToHistory($scope.askCtx.currentAsk.seller.handle);
                $scope.askCtx.seller.handleSuggestionHistoryIndex = 0;
              });
          };
          $scope.askCtx.goBackOneHandleSuggestion = function() {
            var currentHistory = $scope.askCtx.seller.handleSuggestionHistory = UserSessionService.getUserHandleSuggestionHistory();
            var currentIndex = $scope.askCtx.seller.handleSuggestionHistoryIndex;

            var historyLength = currentHistory.length;

            if (historyLength > 0) {
              if (currentIndex !== (historyLength - 1)) {
                currentIndex = $scope.askCtx.seller.handleSuggestionHistoryIndex = (currentIndex + 1);
                $scope.askCtx.currentAsk.seller.handle = currentHistory[currentIndex];
              }

            }
          };
          $scope.askCtx.goForwardOneHandleSuggestion = function() {
            var currentHistory = $scope.askCtx.seller.handleSuggestionHistory = UserSessionService.getUserHandleSuggestionHistory();
            var currentIndex = $scope.askCtx.seller.handleSuggestionHistoryIndex;

            var historyLength = currentHistory.length;

            if (historyLength > 0) {
              if (currentIndex !== 0) {
                currentIndex = $scope.askCtx.seller.handleSuggestionHistoryIndex = (currentIndex - 1);
                $scope.askCtx.currentAsk.seller.handle = currentHistory[currentIndex];
              }

            }
          };
          // end handle generation methods


          $scope.askCtx.isCurrentAskValid = function() {
            var isValid = true;
            if (!$scope.askCtx.currentAsk.position) {
              isValid = false;
            }
            if (!$scope.askCtx.currentAsk.seller  || !$scope.askCtx.currentAsk.seller.email) {
              isValid = false;
            }
            if (!$scope.askCtx.currentAsk.lotPrices  || ($scope.askCtx.currentAsk.lotPrices.length < 1)) {
              isValid = false;
            }
            if (!$scope.askCtx.currentAsk.productType) {
              isValid = false;
            }
            return isValid;
          };







          $scope.askCtx.setCurrentProductMode = function(productMode) {
            // $timeout(function() {
            $scope.askCtx.productMode = productMode;
            $scope.productCtx.isShowProductTypeMenu = false;
            $scope.productCtx.isShowProductTypeMenu = false;

            //  }, 75);
          };
          $scope.askCtx.setCurrentProductType = function(productType) {
            $scope.askCtx.currentAsk.productType = productType.name;
            if (productType.name === 'Beer Hops') {
              $scope.askCtx.setCurrentProductMode('Hop Leaf');
            }
            $scope.productCtx.currentProductVariants = productType.variants;
            $timeout(function() {
              $scope.resetProductTypeUIFilters();

            }, 10);
            $scope.askCtx.currentAsk.headline = 'I am selling: ' + $scope.askCtx.currentAsk.productType;
            if ($scope.askCtx.currentAsk.variant) {
              $scope.askCtx.currentAsk.headline += ' variety: ' +  $scope.askCtx.currentAsk.variant
            }
            $scope.productCtx.isShowProductTypeMenu = false;
          };
          $scope.askCtx.setCurrentProductVariant = function(productVariantObj) {
            $scope.askCtx.currentAsk.variant = productVariantObj.name;
            $scope.askCtx.currentAsk.headline = $scope.askCtx.currentAsk.productType;
            if ($scope.askCtx.currentAsk.variant) {
              $scope.askCtx.currentAsk.headline += ' variety: ' +  $scope.askCtx.currentAsk.variant
            }
            $scope.resetProductVariantUIFilters();
            //$scope.isShowAddLotPrice = !$scope.isShowAddLotPrice;
            resetCurrentLot();
            $scope.isShowAddLotPrice = true;
          };
          $scope.askCtx.clearCurrentProductType = function() {
            $scope.currentAsk.productType = '';
          };
          $scope.askCtx.onOtherLotMeasureChoice = function() {
            $scope.isShowOtherLotMeasureInput = true;
            $scope.lotCtx.currentLot.measure = '';
          };
          $scope.askCtx.onLotMeasureChoice = function() {
            $scope.isShowOtherLotMeasureInput = false;
            // save as personal preference
            $scope.lotCtx.currentLot.otherMeasure = '';
          };
          $scope.askCtx.isFormValid = function() {
            if ($scope.askCtx.currentAsk.productType && $scope.askCtx.currentAsk.variant && ($scope.askCtx.currentAsk.lotPrices.length > 0)) {
              return true;
            }
            return false;
          };
          $scope.askCtx.clearCurrentAsk = function() {
            initializeCurrentAsk();
          };


          $scope.productCtx = {
            currentProductType: {},
            isShowProductTypeMenu: false,
            isShowProductSubTypeMenu: false,
            currentProductVariant: {},
            currentProductVariants: [],
            currentProductTypes: []
          };
          $scope.productCtx.toggleProductTypeMenu = function() {
            $scope.productCtx.isShowProductTypeMenu = !$scope.productCtx.isShowProductTypeMenu;
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
            if ($scope.productCtx.currentProductVariant) {
              ProductServices.saveProductSubType({name:$scope.productCtx.currentProductVariant})
                .then(function(response) {
                  $scope.productCtx.currentProductVariant = '';
                  loadProductSubTypes();
                });
            }
          };
          $scope.resetProductTypeUIFilters = function() {

            $scope.askCtx.productFilters = {
              productTypeDirectMatchCollection: [],
              productTypeIndirectMatchCollection: [],
              productVariantDirectMatchCollection: [],
              productVariantIndirectMatchCollection: []
            };


          };
          $scope.resetProductVariantUIFilters = function() {
            $scope.askCtx.productFilters = {
              productVariantDirectMatchCollection: [],
              productVariantIndirectMatchCollection: []
            };
          };
          $scope.togglePriceLotForm = function() {
            $scope.isShowAddLotPrice = !$scope.isShowAddLotPrice;
            resetCurrentLot();
          };
          $scope.addLotPriceToAsk = function() {
            if ($scope.lotCtx.currentLot && $scope.lotCtx.currentLot.price &&  $scope.lotCtx.currentLot.size &&  $scope.lotCtx.currentLot.measure) {
              if ($scope.askCtx.productMode) {
                $scope.lotCtx.currentLot.productMode = $scope.askCtx.productMode;
              }
              $scope.askCtx.currentAsk.lotPrices.push($scope.lotCtx.currentLot);
              resetCurrentLot();
            }
          };
          $scope.saveAsk = function() {
            if ($scope.askCtx.currentAsk.seller.email) {
              //alert('| STOP!!! HAVEyour email - you can proceed');

            }
            // if local client state email isn't set then set it now
            if (!UserSessionService.getValueByKey('smEmail')) {
              UserSessionService.setValueByKey('smEmail', $scope.askCtx.currentAsk.seller.email);
            }
            if ($scope.askCtx.currentAsk.seller.handle) {
              if (!UserSessionService.getValueByKey('smHandle')) {
                UserSessionService.setValueByKey('smHandle', $scope.askCtx.currentAsk.seller.handle);
              }
            }
            if ($scope.askCtx.currentAsk.productType) {
              var tempCurrentUser = UserSessionService.getCurrentUserFromClientState();
              if (tempCurrentUser.smAuthToken) {
                $scope.askCtx.currentAsk.seller.smAuthToken = tempCurrentUser.smAuthToken;
              }


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


              GeoServices.reverseLookup(tLat, tLon)
                .then(function(location) {
                  $scope.askCtx.currentAsk.address = location.address;
                  AskServices.savePendingAsk($scope.askCtx.currentAsk)
                    .then(function(response) {
                      $log.debug('Ask Saved');
                      $scope.init();

                    });

                });



            }
          };




          loadProductTypes();
          loadProductSubTypes();
          $scope.init();
        }
      ],
      link: function(scope, el, attrs) {

        scope.$watch('askCtx.currentAsk.seller.email', function(emailVal) {
          if (emailVal) {

            // or when the ask is to be saved
            if (CommonServices.isValidEmail(emailVal)) {
              scope.validationClassNames.askSellerEmailInput = 'SellerInput--valid';

              var currentUser = UserSessionService.getCurrentUserFromClientState();
              if (!currentUser.smEmail) {
                $log.debug('|   We have a valid email', emailVal);
                // set the users email (smEmail)
                // probably update the token as well
                // check if userProfile matches
                // etc
              }
              else {
                if (currentUser.smEmail !== emailVal) {
                  $log.warn('| we have different email addresses');

                }
              }
            }
            else {
              scope.validationClassNames.askSellerEmailInput = 'SellerInput--nonempty';

              $log.warn('| keep typing: that is not a valid email', emailVal);
            }


            // if the email address is valid
            // if there no preset value for current user
          }
        }, true);
        scope.$watch('askCtx.currentAsk.variant', function(newVal, oldVal) {
          scope.resetProductVariantUIFilters();
          if (!newVal || newVal.length < 1) {
            scope.resetProductTypeUIFilters();
            return;
          }
          //if (scope.productCtx.currentProductVariants && (scope.productCtx.currentProductVariants.length > 0)) {
          //  var collection = scope.productCtx.currentProductVariants;
          //
          //  var isMatched = false;
          //  collection.map(function(type) {
          //    var collectionName = type.name.toLowerCase();
          //    var comparisonName = newVal.toLowerCase();
          //    if (collectionName.indexOf(comparisonName) === 0) {
          //      $log.debug('direct variety match', comparisonName);
          //      isMatched = true;
          //      if (isUniqueProductVariantMatch(collectionName)) {
          //
          //        $timeout(function() {
          //          scope.askCtx.productFilters.productVariantDirectMatchCollection.push(type);
          //        }, 50);
          //      }
          //    }
          //    if (collectionName.indexOf(comparisonName) > 0) {
          //      $log.debug('indeirect variety match', comparisonName);
          //      isMatched = true;
          //      if (isUniqueProductVariantIndirectMatch(collectionName)) {
          //
          //        $timeout(function() {
          //          scope.askCtx.productFilters.productVariantIndirectMatchCollection.push(type);
          //        }, 50);
          //      }
          //    }
          //  });
          //  //if (!isMatched) {
          //  //
          //  //  resetProductTypeUIFilters();
          //  //
          //  //}
          //
          //}
          /*
           *
           *       scope.askCtx.productFilters = {
           productVariantDirectMatchCollection: [],
           productVariantIndirectMatchCollection: []
           };
           * */
        }, true);
        scope.$watch('askCtx.currentAsk.productType', function(newVal, oldVal) {
          if (newVal && newVal.length > 0) {
            // check for variants
            $log.debug('/|  here we need to check for variants');
            scope.productCtx.currentProductTypes.map(function(productType) {
              if (productType.name === newVal) {
                if (productType.variants) {
                  scope.productCtx.currentProductVariants = productType.variants;

                }
              }
            });
          }
        }, true);
        scope.$watch('activeView', function(newVal, oldVal) {
          if (newVal && (newVal === scope.askCtx.viewName)) {
            $log.debug('| active view changed to', scope.askCtx.viewName);
            //scope.init();
          }

        }, true);


        //scope.$watch('askCtx.currentAsk.productType', function(newVal, oldVal) {
        //  $log.debug('|  Updated Product Type Name Search Value', newVal);
        //  resetProductTypeUIFilters();
        //  if (!newVal || newVal.length < 1) {
        //    resetProductTypeUIFilters();
        //    return;
        //  }
        //  if (scope.productCtx.currentProductTypes && (scope.productCtx.currentProductTypes.length > 0)) {
        //    var collection = scope.productCtx.currentProductTypes;
        //
        //    var isMatched = false;
        //    collection.map(function(type) {
        //      var collectionName = type.name.toLowerCase();
        //      var comparisonName = newVal.toLowerCase();
        //      if (collectionName.indexOf(comparisonName) === 0) {
        //        $log.debug('direct match', comparisonName);
        //        isMatched = true;
        //        if (isUniqueProductTypeMatch(collectionName)) {
        //
        //          $timeout(function() {
        //            scope.askCtx.productFilters.productTypeDirectMatchCollection.push(type);
        //          }, 50);
        //        }
        //      }
        //      if (collectionName.indexOf(comparisonName) > 0) {
        //        $log.debug('indeirect match', comparisonName);
        //        isMatched = true;
        //        if (isUniqueProductTypeIndirectMatch(collectionName)) {
        //
        //          $timeout(function() {
        //            scope.askCtx.productFilters.productTypeIndirectMatchCollection.push(type);
        //          }, 50);
        //        }
        //      }
        //    });
        //    //if (!isMatched) {
        //    //
        //    //  resetProductTypeUIFilters();
        //    //
        //    //}
        //
        //  }
        //
        //}, true);

      }
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
