sm.Admin.directive('smAdminMain', [
  function() {
    return {
      restrict:'E',
      templateUrl: './scripts/modules/admin/templates/admin.main.html',
      controller: ['AdminServices', function(AdminServices) {

      }]
    }
  }
]);
sm.Admin.directive('smAdminAskManager', [
  '$log',
  function($log) {
    return {
      restrict:'E',
      templateUrl: './scripts/modules/admin/templates/admin.ask.manager.html',
      controller: [
        '$scope',
        '$log',
        'AskServices',
        'AdminServices',
        'orderByFilter',
        '$timeout',
        '$filter',
        function($scope, $log, AskServices, AdminServices, orderBy, $timeout, $filter) {

          $scope.askAdminCtx = {pendingAsks:[]};
          $scope.askAdminCtx.isShowDeletedPendingAsks = false;
          $scope.askAdminCtx.currentSortFilter = {
            propertyName: 'createdDate',
            displayName: 'Oldest First',
            reverse: false
          };
          $scope.askAdminCtx.setSortFilter = function(filter) {
            if (filter.propertyName) {
              $scope.askAdminCtx.currentSortFilter = filter;
            }
          };
          $scope.askAdminCtx.sortByFilters = [
            {
              propertyName: 'productType',
              displayName: 'Product Type asc',
              reverse: true
            },
            {
              propertyName: 'productType',
              displayName: 'Product Type desc',
              reverse: false
            },
            {
              propertyName: 'createdDate',
              displayName: 'Oldest First',
              reverse: false
            },
            {
              propertyName: 'createdDate',
              displayName: 'Newest First',
              reverse: true
            }

          ];
          $scope.loadPendingAsks = function() {
            $scope.askAdminCtx.pendingAsks = AskServices.getPendingAsks()
              .then(function(pendingAsks) {
                var localCollection = pendingAsks;
                if (localCollection && localCollection.map) {
                  if (!$scope.askAdminCtx.isShowDeletedPendingAsks) {
                    localCollection = $filter('filter')(localCollection, {status: '!deleted'}, true);
                  }
                  localCollection.map(function(ask) {
                    ask.displayTimeSince = moment(ask.createdDate);
                  });
                  localCollection = orderBy(localCollection, $scope.askAdminCtx.currentSortFilter.propertyName, $scope.askAdminCtx.currentSortFilter.reverse);
                  $scope.askAdminCtx.pendingAsks = localCollection;
                }
              });
          }
          $scope.loadPendingAsks();
          $scope.$watch('askAdminCtx.currentSortFilter', function(newVal, oldVal) {
            var localCollection = $scope.askAdminCtx.pendingAsks;
            if (localCollection && localCollection.map) {
              localCollection.map(function(ask) {
                ask.displayTimeSince = moment(ask.createdDate);
              });
              localCollection = orderBy(localCollection, $scope.askAdminCtx.currentSortFilter.propertyName, $scope.askAdminCtx.currentSortFilter.reverse);
              $scope.askAdminCtx.pendingAsks = localCollection;
            }

          }, true);
          //$scope.askAdminCtx.pendingAsks = AskServices.getPendingAsks()
          //  .then(function(pendingAsks) {
          //    var localCollection = pendingAsks;
          //    if (localCollection && localCollection.map) {
          //      localCollection.map(function(ask) {
          //        ask.displayTimeSince = moment(ask.createdDate);
          //      })
          //    }
          //    localCollection = orderBy(localCollection, $scope.askAdminCtx.currentSortFilter.propertyName, $scope.askAdminCtx.currentSortFilter.reverse);
          //    $scope.askAdminCtx.pendingAsks = localCollection;
          //  });

          $scope.askAdminCtx.approveAsk = function(ask) {
            // post ask to ask object
            var refId = ask.id;
            delete ask.id;
            AskServices.saveAsk(ask)
              .then(function(responseAsk) {
                // loop over the lopPrices
                if (responseAsk.lotPrices && responseAsk.lotPrices.map) {
                  responseAsk.lotPrices.map(function(lotPrice) {
                    // lot price elements
                    console.log(lotPrice);
                    /*
                    *
                    * seller
                    * position
                    * product type
                    * variant
                    * mode
                    * ask.id
                    *
                    * */
                    lotPrice.sellerHandle = responseAsk.seller.handle;
                    lotPrice.position = responseAsk.position;
                    lotPrice.productType = responseAsk.productType;
                    lotPrice.variant = responseAsk.variant;
                    lotPrice.quantity = responseAsk.quantity;
                    lotPrice.quantityMeasure = responseAsk.quantityMeasure;
                    lotPrice.cropYear = responseAsk.cropYear;
                    lotPrice.grower = responseAsk.grower.handle;
                    lotPrice.countryOfOrigin = responseAsk.countryOfOrigin;
                    lotPrice.analysis = false;
                    if (responseAsk.testHistory && responseAsk.testHistory.length && responseAsk.testHistory.length > 0) {
                      lotPrice.analysis = true;
                    }
                    lotPrice.productMode = responseAsk.productMode;
                    lotPrice.askId = responseAsk.id;

                    $timeout(function() {
                      AskServices.saveLotPrice(lotPrice)
                        .then(function(response) {
                          //
                        })
                        .catch(function(error) {
                          $log.warn('bad create lotPrice ', error);
                        })
                    }, 25);

                  });
                }
                // create lotPrice entry
                // taking a little risk here in losing pending
                // then delete pending ask

                AskServices.deletePendingAsk(refId)
                  .then(function(response) {
                    $scope.loadPendingAsks();
                  })
                  .catch(function(error) {
                    $log.warn('bad delete pending ask', error);
                  });

              })
              .catch(function(error) {
                $log.warn('| bad create ask')
              });


          };
          $scope.askAdminCtx.deletePendingAsk = function(ask) {
            if (ask.id) {
              if (confirm('delete this pending ask?')) {
                // TODO track this
                AskServices.deletePendingAsk(ask.id)
                  .then(function(response) {
                    $scope.loadPendingAsks();
                  })
                  .catch(function(error) {
                    $log.warn('bad delete pending ask', error);
                  });
              }
            }

          };

        }


      ],
      link: function(scope, el, attrs) {
        scope.$watch('askAdminCtx.isShowDeletedPendingAsks', function(newVal, oldVal) {
          $log.debug('toggle show deleted pending asks');
          scope.loadPendingAsks();
        }, true);
      }
    }
  }
]);
sm.Admin.directive('smAdminProductType', [
  function() {
    return {
      restrict:'E',
      templateUrl: './scripts/modules/admin/templates/admin.product.type.html',
      controller: [
        '$scope',
        '$log',
        '$timeout',
        'AdminServices',
        'ProductServices',
        'CommonServices',
        function($scope, $log, $timeout, AdminServices, ProductServices, CommonServices) {
          $scope.productTypeCtx = {
            currentProductType : {
              name: ''
            },
            currentProductVariant : {
              name: ''
            },
            currentProductTypes: []
          };
          function resetCurrentProductType() {
            $scope.productTypeCtx = {
              currentProductType : {
                name: ''
              },
              currentProductVariant : {
                name: ''
              },
              currentProductTypes: []
            };

          }
          function loadCurrentProductTypes() {
            $scope.productTypeCtx.currentProductTypes = ProductServices.getProductTypes()
              .then(function(allProductTypes) {
                $scope.productTypeCtx.currentProductTypes = allProductTypes;
              });
          }
          $scope.editProductType = function(productType) {
            if (productType.name) {
              $scope.productTypeCtx.currentProductType = productType;
              $scope.productTypeCtx.currentProductVariant = {parent:productType.name};
            }

          };
          $scope.deleteProductType = function(id) {
            if (confirm('delete product type?')) {
              // what about the implication of existing and historical asks and their product type name references
              $log.debug('this functionality needs more consideration before implementation');
            }
          };
          $scope.editProductVariant = function(productVariant) {
            if (productVariant.name) {
              $scope.productTypeCtx.currentProductVariant = productVariant;
            }

          };
          $scope.deleteProductVariant = function(Variant) {
            if (confirm('delete product variant?')) {
              // what about the implication of existing and historical asks and their product type name references
              $log.debug('this functionality needs more consideration before implementation');
            }
          };

          $scope.saveCurrentProductType = function() {
            if ($scope.productTypeCtx.currentProductType.name) {
              ProductServices.saveProductType($scope.productTypeCtx.currentProductType)
                .then(function(saveProductTypeResponse) {
                  resetCurrentProductType();
                  loadCurrentProductTypes();
                });
            }
          };

          $scope.saveCurrentProductVariant = function() {
            if ($scope.productTypeCtx.currentProductVariant.name) {

              // check to see if this is an edit or new variant
              if ($scope.productTypeCtx.currentProductVariant.id) {
                // edit existing
                $scope.productTypeCtx.currentProductType.variants.map(function(variant) {
                  if (variant.id === $scope.productTypeCtx.currentProductVariant.id) {
                    variant = $scope.productTypeCtx.currentProductVariant;
                  }
                });
              }
              else {
                // new variant
                // make sure it isn't a dupe
                var isUnique = true;
                if ($scope.productTypeCtx.currentProductType.variants && $scope.productTypeCtx.currentProductType.variants.length > 0) {
                  $scope.productTypeCtx.currentProductType.variants.map(function(variant) {
                    if (variant.name.toLowerCase() === $scope.productTypeCtx.currentProductVariant.name.toLowerCase()) {
                      isUnique = false;
                    }
                  });
                }
                if (isUnique) {
                  $scope.productTypeCtx.currentProductVariant.id = CommonServices.generateGuid();
                  if (!$scope.productTypeCtx.currentProductType.variants) {
                    $scope.productTypeCtx.currentProductType.variants = [];
                  }
                  $scope.productTypeCtx.currentProductType.variants.push($scope.productTypeCtx.currentProductVariant);
                }
              }

              // loop over the existing variants collection for this product type

              // check if value already exists
              // if so
              // new product variant
              if (!$scope.productTypeCtx.currentProductVariant.id) {

              }



              ProductServices.saveProductType($scope.productTypeCtx.currentProductType)
                .then(function(saveProductTypeResponse) {
                  //resetCurrentProductVariant();
                  $timeout(function() {
                    $scope.productTypeCtx.currentProductVariant = {parent:$scope.productTypeCtx.currentProductType.name};

                  }, 50);


                });
            }
          };

          function init() {
            loadCurrentProductTypes();
          }
          init();
        }
      ]
    }
  }
]);
sm.Admin.directive('smAdminTracksRecent', [
  '$timeout',
  function($timeout) {
    return {
      restrict: 'E',
      controller: [
        '$scope',
        '$log',
        '$filter',
        'smSocket',
        'TrackingServices',
        function($scope, $log, $filter, smSocket, TrackingServices) {
          $scope.trackAdminCtx = {
            recentTracks: []
          };


          $scope.titleSearchValue = '';
          $scope.isFilterChanged = false;
          $scope.sortDir = {};
          $scope.sortDir['action'] = true;
          $scope.sortDir['options'] = true;
          $scope.sortDir['email'] = true;
          $scope.sortDir['userAgent'] = true;
          $scope.sortDir['sessionId'] = true;
          $scope.sortDir['language'] = true;
          $scope.sortDir['userName'] = true;
          $scope.sortDir['referer'] = true;
          $scope.isReverse = function(colName) {
            return $scope.sortDir[colName] = !$scope.sortDir[colName];
          };
          $scope.sortTracks = function(colName) {
            $scope.currentTracks = $filter('orderBy')($scope.currentTracks, colName, $scope.isReverse(colName));
          };


          $scope.currentTracks = [];
          smSocket.on('broadCastTracks', function(data) {

            if (data && data.map) {
              data.map(function(trackItem) {
                if (!trackItem.meta) {
                  trackItem.meta = {};
                }
                trackItem.email = trackItem.meta.smEmail || '';
                trackItem.userAgent = trackItem.headers['user-agent'];
                trackItem.sessionId = trackItem.meta.smTraceId || '';
                trackItem.language = trackItem.headers['accept-language'];
                trackItem.userName = trackItem.meta.currentUserName || '';
                trackItem.referer = trackItem.headers.referer;
                trackItem.chrono = moment(trackItem.timestamp).format('YYYY MM DD');
              })
            }
            data = $filter('orderBy')(data, 'timestamp', true);

            $scope.trackAdminCtx.recentTracks = data;
            $scope.currentTracks = $scope.trackAdminCtx.recentTracks;



          });

          smSocket.emit('fetchTracks');
          //$scope.trackAdminCtx.recentTracks = TrackingServices.getRecentTracks()
          //  .then(function (response) {
          //
          //  });
        }
      ],
      link: function(scope, el, attrs) {

        scope.$watch('currentTracks', function(newVal, oldVal) {
          $timeout(function() {
            ReactDOM.render(React.createElement(sm.RecentTracks, {scope:scope}), el[0]);

          }, 400);
        });
      }
    }
  }
]);

/*
*
*
* app.controller( 'MainCtrl', function( $scope, AuthService ) {
 $scope.$watch( AuthService.isLoggedIn, function ( isLoggedIn ) {
 $scope.isLoggedIn = isLoggedIn;
 $scope.currentUser = AuthService.currentUser();
 });
 });
*
* */
sm.Admin.directive('smAdminUsersList', [

  function() {
    return {
      restrict:'E',
      templateUrl: './scripts/modules/admin/templates/admin.users.list.html',
      controller: [
        '$scope',
        'UserServices',
        'smSocket',
        'UserSessionService',
        function($scope, UserServices, smSocket, UserSessionService) {

          $scope.$watch( UserSessionService.isLoggedIn, function ( isLoggedIn ) {
            $scope.isLoggedIn = isLoggedIn;
            $scope.currentUser = UserSessionService.getCurrentUserFromClientState();
          });

          $scope.currentUsers = [];
          smSocket.on('broadCastUsers', function(data) {
            $scope.currentUsers = data;
          });
          function init() {
            smSocket.emit('fetchUsers');
          }
          init();
        }
      ]
    }
  }
]);
