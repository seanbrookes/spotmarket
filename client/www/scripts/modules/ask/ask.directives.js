sm.Ask.directive('smAskWhatView', [
  '$log',
  function ($log) {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/ask/templates/ask.what.view.html',
      controller: [
        '$scope',
        function ($scope) {
          $log.debug('smAskWhatView directive controller');

          $scope.isShowMoreForm = false;
        }
      ]

    }
  }

]);
sm.Ask.directive('smAskWhatDetailView', [
  '$log',
  function ($log) {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/ask/templates/ask.what.detail.view.html',
      controller: [
        '$scope',
        function ($scope) {
          $log.debug('smAskWhatView directive controller');

          $scope.isShowMoreForm = false;
        }
      ]

    }
  }

]);
sm.Ask.directive('smAskSellerView', [
  '$log',
  function ($log) {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/ask/templates/ask.seller.view.html',
      controller: [
        '$scope',
        function ($scope) {
          $log.debug('smAskSellerView directive controller');
        }
      ]
    }
  }
]);
sm.Ask.directive('smAskWhereView', [
  '$log',
  function ($log) {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/ask/templates/ask.where.view.html',
      controller: [
        '$scope',
        function ($scope) {
          $log.debug('smAskWhereView directive controller');
        }
      ]
    }
  }
]);
sm.Ask.directive('smAskShippingView', [
  '$log',
  function ($log) {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/ask/templates/ask.shipping.view.html',
      controller: [
        '$scope',
        function ($scope) {
          $log.debug('smAskShippingView directive controller');
        }
      ]
    }
  }
]);
sm.Ask.directive('smAskHistoryView', [
  'AskServices',
  function(AskServices) {
    return {
      restrict: 'E',
      scope: {
        profile: '='
      },
      controller: [
        '$scope',
        function($scope ) {
          $scope.profileAskHistory = [];


        }
      ],
      link: function(scope, el, attrs) {

        scope.$watch('profile.handle', function(newVal, oldVal) {
          if (newVal) {
            //$scope.profileAskHistory
            scope.profileAskHistory = AskServices.getProfileAskHistory(scope.profile.handle)
              .then(function(response) {
                scope.profileAskHistory = response;
              });
          }
        }, true);

        scope.$watch('profileAskHistory', function(newVal, oldVal) {
          if (newVal && newVal.length) {
            ReactDOM.render(React.createElement(sm.AskHistoryView, {store:scope}), el[0]);

          }
        }, true);

      }
    }
  }
]);
sm.Ask.directive('smAskPriceView', [
  '$log',
  function ($log) {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/ask/templates/ask.price.view.html',
      controller: [
        '$scope',
        'orderByFilter',
        'CommonServices',
        function ($scope, orderBy, CommonServices) {
          $log.debug('smAskPriceView directive controller');

          var c2uConversion = 'CAD_USD';
          var u2cConversion = 'USD_CAD';



          /*
           *
           * LOT CTX
           *
           * */
          $scope.lotCtx = {
            currentLot: {
              measure: 'kg',
              currency: 'CAD'
            }
          };
          $scope.lotCtx.currentLot.convertedPrice = null;

          $scope.lotCtx.measureOptions = [
            {value: 'lb bale'},
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
              measure: 'kg',
              currency: 'CAD'
            };
          }

          $scope.lotCtx.currentLot.measure = 'kg';

          $scope.addLotPriceToAsk = function () {
            if ($scope.lotCtx.currentLot && $scope.lotCtx.currentLot.price && $scope.lotCtx.currentLot.measure) {
              if ($scope.askCtx.productMode) {
                $scope.lotCtx.currentLot.productMode = $scope.askCtx.productMode;
              }
              $scope.askCtx.currentAsk.lotPrices.push($scope.lotCtx.currentLot);
              $scope.askCtx.currentAsk.lotPrices = orderBy($scope.askCtx.currentAsk.lotPrices, 'productMode', true);
              resetCurrentLot();
            }
          };



          $scope.lotCtx.getConvertedPrice = function(price, conversion) {
            return CommonServices.getExchangeRate(conversion)
              .then(function(response) {
                var returnValue =  (Number(price) * Number(response.data[conversion].val));
                console.log('| exchange value: ', returnValue);
                return returnValue;
              })
              .catch(function(error) {
                console.warn('| bad convert price', error);
              });
          };

          $scope.lotCtx.convertIt = function() {
            $scope.lotCtx.currentLot.convertedPrice = $scope.lotCtx.getConvertedPrice($scope.lotCtx.currentLot.price, c2uConversion)
              .then(function(response) {
                $scope.lotCtx.currentLot.convertedPrice = response.toFixed(2);
              });


          };





        }
      ],
      link: function (scope, el, attrs) {
        scope.$watch('askCtx.productMode', function (newVal, oldVal) {
          $log.debug('|  Product Mode Changed from within the ask.price directive');
        }, true);
      }
    }
  }
]);
sm.Ask.directive('smAskMarketView', [
  '$log',
  'CommonServices',
  'UserSessionService',
  'orderByFilter',
  'OrgServices',
  function ($log, CommonServices, UserSessionService, orderBy, OrgServices) {
    return {
      restrict: 'E',
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
        'NAV_CONST',
        function ($scope, $http, $timeout, ProductServices, AskServices, GeoServices, Upload, NAV_CONST) {
          $scope.modalShown = false;
          $scope.toggleModal = function() {
            $scope.modalShown = !$scope.modalShown;
          };
          $scope.askCtx = {
            viewName: NAV_CONST.ASK_VIEW,
            seller: {},
            productFilters: {
              productTypeDirectMatchCollection: [],
              productTypeIndirectMatchCollection: [],
              productVariantDirectMatchCollection: [],
              productVariantIndirectMatchCollection: []
            }
          };
          $scope.askCtx.listOfContries = [];
          $scope.askCtx.listOfGrowers = [];
          $scope.askCtx.picFile = {};
          $scope.askCtx.cropImgString = '';
          $scope.askCtx.seller.handleSuggestionHistory = [];
          $scope.askCtx.seller.handleSuggestionHistoryIndex = 0;
          $scope.askCtx.seller.handleSearchDefaultHandleAlphaOnly = false;
          $scope.askCtx.currentAsk = {
            seller: {},
            productType: '',  // ask converts to a string for name property shortand
            variant: '',
            headline: '',
            lotPrices: [],
            testHistory: []
          };
          $scope.askCtx.productModes = {
            beerHops: [
              {
                name: 'Extract',
                id: 'beer_hop_extract'
              },
              {
                name: 'Leaf',
                id: 'beer_hop_leaf'
              },
              {
                name: 'Mash',
                id: 'beer_hop_mash'
              },
              {
                name: 'T45 Pellet',
                id: 't45_hop_pellet'

              },
              {
                name: 'T90 Pellet',
                id: 't90_hop_pellet'

              }
            ]
          };
          $scope.askCtx.measureOptions = [
            {value: 'gram'},
            {value: 'kg'},
            {value: 'lb'},
            {value: 'ml'},
            {value: 'litre'},
            {value: 'oz (us)'},
            {value: 'oz (imp)'},
            {value: 'ton'}
          ];


          $scope.askCtx.isShowAskDescriptionEditor = false;
          $scope.askCtx.toggleAskDescription = function() {
            $scope.askCtx.isShowAskDescriptionEditor = !$scope.askCtx.isShowAskDescriptionEditor;
          };

          $scope.askCtx.isShowPricingForm = false;
          $scope.askCtx.isAskDetailReadOnly = false;
          $scope.askCtx.toggleAskDetailReadOnly = function() {
            $timeout(function() {
              $scope.askCtx.isAskDetailReadOnly = !$scope.askCtx.isAskDetailReadOnly;
              if (!$scope.askCtx.isAskDetailReadOnly) {
                $scope.askCtx.isShowPricingForm = false;
                $scope.askCtx.isShowPriceView = false;
              }
            }, 5);
          };
          $scope.askCtx.isShowPriceView = false;
          $scope.askCtx.isShowAskPricingButton = function() {
            if ($scope.askCtx.currentAsk.productType &&
              $scope.askCtx.currentAsk.variant &&
              $scope.askCtx.currentAsk.productMode &&
              $scope.askCtx.currentAsk.quantity &&
              $scope.askCtx.currentAsk.quantityMeasure) {
              if (!$scope.askCtx.isShowPriceView) {
                return true;
              }
              else {
                return false;
              }
            }
            return false;
          };

          $scope.askCtx.togglePricingForm = function() {
            var retVar = $scope.askCtx.isShowPricingForm = !$scope.askCtx.isShowPricingForm;
            if ($scope.askCtx.isShowPricingForm) {
              $timeout(function() {
                $scope.askCtx.isAskDetailReadOnly = true;

              }, 5);
            }
            if (retVar) {
              $scope.askCtx.isShowPriceView = true;
            }
            return retVar;
          };

          $scope.init = function (user) {
            $scope.askCtx.currentAsk = {
              seller: {},
              productType: '',  // ask converts to a string for name property shortand
              variant: '',
              headline: '',
              lotPrices: []
            };
            $scope.askCtx.productFilters = {
              productTypeDirectMatchCollection: [],
              productTypeIndirectMatchCollection: [],
              productVariantDirectMatchCollection: [],
              productVariantIndirectMatchCollection: []
            };
            $scope.askCtx.listOfGrowers = function() {

            };
            $scope.askCtx.listOfGrowers = OrgServices.getOrgs()
              .then(function(responseOrgs) {
                var extraEntries = [
                  {
                    name: 'other'
                  },
                  {
                    name: 'unknown'
                  }
                ];
                $scope.askCtx.listOfGrowers = extraEntries.concat(responseOrgs);
              });

            $scope.askCtx.seller.handleSuggestionHistory = [];
            $scope.askCtx.seller.handleSuggestionHistoryIndex = 0;
            $scope.askCtx.seller.handleSearchDefaultHandleAlphaOnly = false;

            $scope.askCtx.listOfCropYears = [
              2012,
              2013,
              2014,
              2015,
              2016,
              2017
            ];

            $scope.askCtx.listOfContries = CommonServices.getListOfCountries()
              .then(function(response) {
                var popularCountries = [
                  {
                    Name: 'Canada'
                  },
                  {
                    Name: 'United States'
                  },
                  {
                    Name: 'New Zealand'
                  },
                  {
                    Name: 'United Kingdom'
                  },
                  {
                    Name: 'Australia'
                  },
                  {
                    Name: 'South Africa'
                  },
                  {
                    Name: 'Czech Republic'
                  },
                  {
                    Name: 'Germany'
                  },
                  {
                    Name: 'Belgium'
                  },
                  {
                    Name: 'France'
                  },
                  {
                    Name: 'China'
                  },
                  {
                    Name: 'Poland'
                  },
                  {
                    Name: 'Slovenia'
                  }
                ];
                $scope.askCtx.listOfCountries = popularCountries.concat(response);
              });


            if (!user) {
              user = UserSessionService.getCurrentUserFromClientState();
            }
            if (!user.smCurrentPosition) {
              //alert('Message from AskController we do not have a default location');
            }
            else {
              $scope.askCtx.currentAsk.position = user.smCurrentPosition;
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
                .then(function (response) {
                  $scope.askCtx.currentAsk.seller.handle = response;
                });
            }

            // check if user has user preferences for lot price option
            // set default user price lot measure option
            $scope.askCtx.currentAsk.cropYear = 2016;
            $scope.askCtx.currentAsk.quantityMeasure = 'kg';

          }; // end init


          $scope.isShowOtherLotMeasureInput = false;
          $scope.isShowAddLotPrice = false;

          $scope.validationClassNames = {
            askSellerEmailInput: 'SellerInput--invalid'
          };
          $scope.isShowFullDetails = false;
          $scope.helpCtx = {
            content: {
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



          function loadProductTypes() {
            ProductServices.getProductTypes()
              .then(function (response) {
                $scope.productCtx.currentProductTypes = response;
              });
          };
          function loadProductSubTypes() {
            ProductServices.getProductSubTypes()
              .then(function (response) {
                $scope.productCtx.currentProductVariants = response;
              });
          };


          /*
           *
           * PRODUCT MODE
           *
           * */
          $scope.askCtx.isProductModeButtonClassActive = function (productMode) {
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
          $scope.askCtx.startImageUpload = function () {
            $log.debug('start the image upload flow for current ask');
            // open modal
          };
          $scope.askCtx.imgUploadDataChanged = function () {
            $log.debug('image upload data changed');
          };

          /*
           *
           * HANDLE GENERATOR METHODS
           *
           * */
          $scope.askCtx.refreshSuggestedHandle = function () {
            var options = {aphaOnly: $scope.askCtx.seller.handleSearchDefaultHandleAlphaOnly};
            $scope.askCtx.currentAsk.seller.handle = UserSessionService.generateNewUserTag(options)
              .then(function (response) {
                $scope.askCtx.currentAsk.seller.handle = response;
                UserSessionService.addUserHandleSuggestionToHistory($scope.askCtx.currentAsk.seller.handle);
                $scope.askCtx.seller.handleSuggestionHistoryIndex = 0;
              });
          };
          $scope.askCtx.goBackOneHandleSuggestion = function () {
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
          $scope.askCtx.goForwardOneHandleSuggestion = function () {
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


          $scope.askCtx.isCurrentAskValid = function () {
            var isValid = true;
            if (!$scope.askCtx.currentAsk.position) {
              isValid = false;
            }
            if (!$scope.askCtx.currentAsk.seller || !$scope.askCtx.currentAsk.seller.email) {
              isValid = false;
            }
            if (!$scope.askCtx.currentAsk.lotPrices || ($scope.askCtx.currentAsk.lotPrices.length < 1)) {
              isValid = false;
            }
            if (!$scope.askCtx.currentAsk.productType) {
              isValid = false;
            }
            return isValid;
          };


          $scope.askCtx.setCurrentProductMode = function (productMode) {
            // $timeout(function() {
            // create new price lot collection if product mode is new

            $scope.askCtx.productMode = productMode;
            $scope.productCtx.isShowProductTypeMenu = false;
            $scope.productCtx.isShowProductTypeMenu = false;

            //  }, 75);
          };
          $scope.askCtx.setCurrentProductType = function (productType) {
            $scope.askCtx.currentAsk.productType = productType.name;
            if (productType.name === 'Beer Hops') {
              $scope.askCtx.setCurrentProductMode('Hop Leaf');
            }
            $scope.productCtx.currentProductVariants = productType.variants;
            $timeout(function () {
              $scope.resetProductTypeUIFilters();

            }, 10);
            $scope.askCtx.currentAsk.headline = 'I am selling: ' + $scope.askCtx.currentAsk.productType;
            if ($scope.askCtx.currentAsk.variant) {
              $scope.askCtx.currentAsk.headline += ' variety: ' + $scope.askCtx.currentAsk.variant
            }
            $scope.productCtx.isShowProductTypeMenu = false;
          };
          $scope.askCtx.setCurrentProductVariant = function (productVariantObj) {
            $scope.askCtx.currentAsk.variant = productVariantObj.name;
            $scope.askCtx.currentAsk.headline = $scope.askCtx.currentAsk.productType;
            if ($scope.askCtx.currentAsk.variant) {
              $scope.askCtx.currentAsk.headline += ' variety: ' + $scope.askCtx.currentAsk.variant
            }
            $scope.resetProductVariantUIFilters();
            //$scope.isShowAddLotPrice = !$scope.isShowAddLotPrice;
            resetCurrentLot();
            $scope.isShowAddLotPrice = true;
          };
          $scope.askCtx.clearCurrentProductType = function () {
            $scope.currentAsk.productType = '';
          };

          $scope.askCtx.isFormValid = function () {
            if ($scope.askCtx.currentAsk.productType && $scope.askCtx.currentAsk.variant && ($scope.askCtx.currentAsk.lotPrices.length > 0)) {
              return true;
            }
            return false;
          };
          $scope.askCtx.clearCurrentAsk = function () {
           // initializeCurrentAsk();
          };


          $scope.productCtx = {
            currentProductType: {},
            isShowProductTypeMenu: false,
            isShowProductSubTypeMenu: false,
            currentProductVariant: {},
            currentProductVariants: [],
            currentProductTypes: []
          };
          $scope.productCtx.toggleProductTypeMenu = function () {
            $scope.productCtx.isShowProductTypeMenu = !$scope.productCtx.isShowProductTypeMenu;
          };
          $scope.productCtx.toggleProductSubTypeMenu = function () {
            $scope.productCtx.isShowProductSubTypeMenu = !$scope.productCtx.isShowProductSubTypeMenu;
          };


          $scope.addProductType = function () {
            if ($scope.productCtx.currentProductType) {
              ProductServices.saveProductType({name: $scope.productCtx.currentProductType})
                .then(function (response) {
                  $scope.productCtx.currentProductType = '';
                  loadProductTypes();
                });
            }
          };
          $scope.addProductSubType = function () {
            if ($scope.productCtx.currentProductVariant) {
              ProductServices.saveProductSubType({name: $scope.productCtx.currentProductVariant})
                .then(function (response) {
                  $scope.productCtx.currentProductVariant = '';
                  loadProductSubTypes();
                });
            }
          };
          $scope.resetProductTypeUIFilters = function () {

            $scope.askCtx.productFilters = {
              productTypeDirectMatchCollection: [],
              productTypeIndirectMatchCollection: [],
              productVariantDirectMatchCollection: [],
              productVariantIndirectMatchCollection: []
            };


          };
          $scope.resetProductVariantUIFilters = function () {
            $scope.askCtx.productFilters = {
              productVariantDirectMatchCollection: [],
              productVariantIndirectMatchCollection: []
            };
          };
          $scope.togglePriceLotForm = function () {
            $scope.isShowAddLotPrice = !$scope.isShowAddLotPrice;
            resetCurrentLot();
          };

          $scope.saveAsk = function () {
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
                .then(function (location) {
                  $scope.askCtx.currentAsk.address = location.address;
                  AskServices.savePendingAsk($scope.askCtx.currentAsk)
                    .then(function (response) {
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
      link: function (scope, el, attrs) {

        scope.$watch('askCtx.picFile', function(newVal, oldVal) {
          if (newVal && newVal[0]) {
            console.log('pick file', scope.askCtx.picFile);

            var reader = new FileReader();

            reader.readAsDataURL(scope.askCtx.picFile[0]);

            reader.addEventListener("load", function (output) {

              scope.askCtx.cropImgString = output.target.result;

            });

          }
        }, true);

        scope.$watch('askCtx.currentAsk.seller.email', function (emailVal) {
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
        scope.$watch('askCtx.currentAsk.variant', function (newVal, oldVal) {
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
        scope.$watch('askCtx.currentAsk.productType', function (newVal, oldVal) {
          if (newVal && newVal.length > 0) {
            // check for variants
            $log.debug('/|  here we need to check for variants');
            scope.productCtx.currentProductTypes.map(function (productType) {
              if (productType.name === newVal) {
                if (productType.variants) {
                  scope.productCtx.currentProductVariants = productType.variants;

                }
              }
            });
          }
        }, true);
        //scope.$watch('activeView', function (newVal, oldVal) {
        //  if (newVal && (newVal === scope.askCtx.viewName)) {
        //    alert('ask');
        //
        //    $log.debug('| active view changed to', scope.askCtx.viewName);
        //    //scope.init();
        //  }
        //
        //}, true);


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
sm.Ask.directive('smAskTestView', [
  function() {
    return {
      restrict: 'E',
      scope: {
        ask: '='
      },
      templateUrl:  './scripts/modules/ask/templates/ask.test.view.html',
      controller: [
        '$scope',
        function($scope) {
          $scope.testCtx = {isShowTestEditor:false};
          $scope.testCtx.toggleTestEditor = function() {
            $scope.testCtx.isShowTestEditor = !$scope.testCtx.isShowTestEditor;
          };
          $scope.testCtx.currentTest= {};
          $scope.testCtx.removeTest = function(index) {
            if ((index > -1) && $scope.ask && $scope.ask.testHistory && $scope.ask.testHistory.length > 0) {
              $scope.ask.testHistory.splice(index, 1);
            }
          };
          $scope.testCtx.saveCurrentTest = function() {
            if ($scope.testCtx.currentTest && $scope.testCtx.currentTest.date && $scope.testCtx.currentTest.alpha && $scope.testCtx.currentTest.lab) {
              if (!$scope.ask.testHistory) {
                $scope.ask.testHistory = [];
              }
              $scope.ask.testHistory.push($scope.testCtx.currentTest);
              $scope.testCtx.currentTest = {};
              $scope.testCtx.isShowTestEditor = false;
            }
          };
          $scope.$watch('testCtx.currentTest.date', function(newDate, oldDate) {
            $scope.testCtx.isShowDatePicker = false;
          }, true);

          $scope.testCtx.isShowDatePicker = false;
          $scope.testCtx.toggleShowDatePicker = function() {
            $scope.testCtx.isShowDatePicker = !$scope.testCtx.isShowDatePicker;
          };
        }
      ]
    }
  }
]);
sm.Ask.directive('smAskBeerhopsView', [
  function () {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/ask/templates/ask.beerhops.view.html',
      link: [
        function (scope, el, attrs) {

        }
      ]
    }
  }
]);
sm.Ask.directive('smAskPriceLot', [
  function () {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/ask/templates/ask.price.lot.html',
      link: [
        function (scope, el, attrs) {
        }
      ]
    }
  }
]);
