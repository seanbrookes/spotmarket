/*
*
*
*
* MARKET VIEW
*
*
*
* */
sm.Market.directive('smMarketMarketView', [
  '$log',
  '$timeout',
  'NAV_CONST',
  function($log, $timeout, NAV_CONST) {
    return {
      restrict:'E',
      templateUrl: './scripts/modules/market/templates/market.market.view.html',
      scope: {
        activeView: '='
      },
      controller: [
        '$scope',
        'Ask',
        'UserMarket',
        'UserSessionService',
        'leafletBoundsHelpers',
        'leafletData',
        'GeoServices',
        'GEO_CONST',
        'AskServices',
        '$timeout',
        function($scope, Ask, UserMarket, UserSessionService, leafletBoundsHelpers, leafletData, GeoServices, GEO_CONST, AskServices, $timeout) {
          /*
           *
           * In this view we render a collection of asks from within a
           * certain geographical space
           *
           * first basic way to do this is give a point and max distance to
           * query within 'sphere'
           *
           *
           * */

          $scope.currentUser = UserSessionService.getCurrentUserFromClientState();
          $scope.userMarketCtx = {
            viewName: NAV_CONST.MARKET_VIEW,
            currentMap: {
              center: {},
              zoom: 7
            }
          };

          $scope.marketRange = 2200;
          $scope.marketRangeKms = 160;
          $scope.layers;
          $scope.userMarketMap = {};
          $scope.toggleMapLoad = false;
          $scope.markersCollection = [];
          $scope.userMarketCtx.allAsks = [];

          $scope.bounds = [];
          $scope.resetBounds = [];
          $scope.markers = {};
          $scope.center = {};
          $scope.filterSourceData = {
            variants:[{value:'all',checked:true}],
            sellers: [{value:'all',checked:true}],
            cropYears: [{value:'all',checked:true}],
            modes: [{value:'all',checked:true}],
            counts: {}
          };

          $scope.userMarketCtx.mainViews = {
            all: {
              active: true
            },
            map: {
              active: false
            }
          };
          if (!$scope.currentUser.smCurrentPosition) {
            // alert('message from MarketView: There is no current position!!!');
            //return;
          }



          function pushIfUnique(collection, value) {
            // eg sellers
            var retArray = [];
            if (collection && Array.isArray(collection)) {
              var retArray = collection;

              var isUnique = true;

              for (var i = 0;i < retArray.length;i++) {
                if (retArray[i].value === value) {
                  isUnique = false;
                  break;
                }
              }
              if (isUnique) {
                retArray.push({
                  value:value,
                  checked:true,
                  disabled:false
                });
              }
            }

            return retArray;

          }

          function getUniqueSummary(collection) {
            // eg sellers
            var retArray = [];

            if (collection && collection.map) {
              collection.map(function(item) {

              });
            }


            return retArray;

          }

          function zeroCounts() {
            var countsObj = $scope.filterSourceData.counts;

            for (var property in countsObj) {
              if (countsObj.hasOwnProperty(property)) {
                // do stuff
                $scope.filterSourceData.counts[property] = 0;
              }
            }
          }

          $scope.setFiltersAndCounts = function(askList) {

            if (askList && askList.length) {
              //$scope.filterSourceData.counts[lotPrice.productMode] = 0;
              //$scope.filterSourceData.counts[askItem.variant] = 0;
              zeroCounts();
              askList.map(function(askItem) {
              //  if (askItem.lotPrices && askItem.lotPrices.map) {


                $scope.filterSourceData.modes = pushIfUnique($scope.filterSourceData.modes, askItem.productMode);

                if (!$scope.filterSourceData.counts[askItem.productMode]) {
                  $scope.filterSourceData.counts[askItem.productMode] = 1;
                }
                else {
                  $scope.filterSourceData.counts[askItem.productMode] += 1;
                }


                /*
                 *
                 * Variants aggregation
                 *
                 * */
                $scope.filterSourceData.variants = pushIfUnique($scope.filterSourceData.variants, askItem.variant);

                if (!$scope.filterSourceData.counts[askItem.variant]) {
                  $scope.filterSourceData.counts[askItem.variant] = 1;
                }
                else {
                  $scope.filterSourceData.counts[askItem.variant] += 1;
                }


                //
                /*
                 *
                 * sellers aggregation
                 *
                 * */
                //$timeout(function() {
                $scope.filterSourceData.sellers = pushIfUnique($scope.filterSourceData.sellers, askItem.sellerHandle);
                if (!$scope.filterSourceData.counts[askItem.selleHandle]) {
                  $scope.filterSourceData.counts[askItem.selleHandle] = 1;
                }
                else {
                  $scope.filterSourceData.counts[askItem.sellerHandle] += 1;
                }

                  //}, 25);
               // }
              });
            }





          };
          function loadAllAsks() {
            $scope.userMarketCtx.allAsks = AskServices.getAsks()
              .then(function(response) {
                if (response && response.map) {
                  // restructure to lot-price
                  //currency
                  //  :
                  //  "CAD"
                  //measure
                  //  :
                  //  "kg"
                  //price
                  //  :
                  //  12
                  //productMode
                  //  :
                  //  "Leaf"
                  //size
                  //  :
                  //  1


                  $scope.setFiltersAndCounts(response);

                }

                $scope.userMarketCtx.srcAsks = response;
                $scope.userMarketCtx.allAsks = response;
              });

          }




          $scope.userMarketCtx.showMainView = function(viewName) {

            for (var view in $scope.userMarketCtx.mainViews) {
              if( $scope.userMarketCtx.mainViews.hasOwnProperty(view) ) {
                $scope.userMarketCtx.mainViews[view].active = false;
              }
            }
            $scope.initMapData();
            $scope.userMarketCtx.mainViews[viewName].active = true;

          };
          $scope.userMarketCtx.amIActive = function(viewName) {
            return $scope.userMarketCtx.mainViews[viewName].active;
          };












          loadAllAsks();












          $scope.initMapData = function() {
            lats = [];
            lngs = [];


            $scope.currentUser = UserSessionService.getCurrentUserFromClientState();


            var currentPosition = JSON.parse($scope.currentUser.smCurrentPosition);

            var distanceSrcPoint = {
              lng:currentPosition.geometry.coordinates[0],
              lat:currentPosition.geometry.coordinates[1]
            };

            var filter = {

              position: {
                near:{
                  lng:currentPosition.geometry.coordinates[0],
                  lat:currentPosition.geometry.coordinates[1]
                },
                maxDistance:($scope.marketRangeKms * 1000),
                unit: 'meters'
              }


            };

            /*
            *
            * Assemble the data to generate a personalized market view
            * - location
            * - range (geo fence geometry layer)
            * - filters
            * - display options
            * - dashboard configurations
            *
            *
            * get a list of coordinates (plus metadata)
            * present it to the user
            * - map
            * - sortable list
            *
            * make it easy for the user to further personalize
            * the display and dashboard configurations
            *
            *
            * */
            function renderLocalData(askData) {
              var returnCollection = $scope.userMarketCtx.localAskCollection;
              var collectionCoords = [];
              var mapViewCoordsCollection = [];
              $scope.bounds = [];
              $scope.resetBounds = [];
              $scope.markers = {};
              $scope.center = {};
              $scope.layers = {};

              returnCollection.map(function(mapItem) {
                mapItem.position.lat = mapItem.position.coordinates[1];
                mapItem.position.lng = mapItem.position.coordinates[0];
                var compPoint = {
                  lat: mapItem.position.coordinates[1],
                  lng: mapItem.position.coordinates[0]
                };
                lats.push(mapItem.position.lat);
                lngs.push(mapItem.position.lng);

                mapItem.distance = GeoServices.getDistanceFromLatLonInKm(distanceSrcPoint, compPoint);

                collectionCoords.push([mapItem.position.lat, mapItem.position.lng]);
                mapViewCoordsCollection.push([L.latLng(mapItem.position.lat, mapItem.position.lng)]);

                /*
                 *
                 * marker initializations
                 *
                 * */
                //var marker = L.marker([mapItem.position.lat, mapItem.position.lng])
                //  .addTo(mainUserMarketMap);

                $scope.markers[mapItem.id] = {
                  lat: mapItem.position.lat,
                  lng: mapItem.position.lng
                };
                $scope.markersCollection.push( {
                  lat: mapItem.position.lat,
                  lng: mapItem.position.lng
                });


              });

              if (lats && lngs) {
                // sort damn coordinates to find the two corners of the box
                // I must be missing something b/c this should be automated
                var northWest = GeoServices.getBoundingCoordinateByName(GEO_CONST.NW_COORDINATE, collectionCoords);
                var northEast = GeoServices.getBoundingCoordinateByName(GEO_CONST.NE_COORDINATE, collectionCoords);
                var southWest = GeoServices.getBoundingCoordinateByName(GEO_CONST.SW_COORDINATE, collectionCoords);
                var southEast = GeoServices.getBoundingCoordinateByName(GEO_CONST.SE_COORDINATE, collectionCoords);


                var minLat = Math.min.apply(null, lats),
                  maxLat = Math.max.apply(null, lats);
                var minLng = Math.min.apply(null, lngs),
                  maxLng = Math.max.apply(null, lngs);

                northWest = [maxLat, minLng];
                northEast = [maxLat, maxLng];
                southWest = [minLat, minLng];
                southEast = [minLat, maxLng];

                // var bounds = [[minlat,minlng],[maxlat,maxlng]];

                $scope.bounds = leafletBoundsHelpers.createBoundsFromArray([northEast, southWest]);
                $scope.resetBounds = leafletBoundsHelpers.createBoundsFromArray([northEast, northEast]);

              }


              function isMarkersPopulated(markers) {
                for(var prop in markers) {
                  if (markers.hasOwnProperty(prop)) {
                    return true;
                  }
                }

                return false;
              }
              $scope.center = {
                lat: currentPosition.geometry.coordinates[1],
                lng: currentPosition.geometry.coordinates[0]
              };
              $scope.hasResults = false;


              /*
               *
               * We have at least 1 ask
               *
               * - we need a minimum sized zoom level
               * - should be based on on range value
               * - range should be depicted as a translucent circle like a radar range view
               * - users should be able to toggle the range view on and off
               *
               * */
              if ($scope.resetBounds.northEast && $scope.resetBounds.northEast.lat && (!isNaN($scope.resetBounds.northEast.lat)) && isMarkersPopulated($scope.markers)) {
                angular.extend($scope, {
                  markers: $scope.markers
                });
                $scope.hasResults = true;

                if (!$scope.userMarketCtx.currentMap) {
                  $scope.userMarketCtx.currentMap = {};
                }
                $scope.userMarketCtx.currentMap = {
                  center: {
                    lat: currentPosition.geometry.coordinates[1],
                    lng: currentPosition.geometry.coordinates[0]
                  },
                  bounds: $scope.bounds
                };

                $scope.toggleMapLoad = !$scope.toggleMapLoad;
              }
              else {
                northEast = [currentPosition.geometry.coordinates[1], currentPosition.geometry.coordinates[0]];
                southWest = [currentPosition.geometry.coordinates[1], currentPosition.geometry.coordinates[0]];
                $scope.hasResults = false;

                $timeout(function() {

                  if (!$scope.userMarketCtx.currentMap) {
                    $scope.userMarketCtx.currentMap = {};
                  }
                  $scope.userMarketCtx.currentMap = {
                    center: {
                      lat: currentPosition.geometry.coordinates[1],
                      lng: currentPosition.geometry.coordinates[0]
                    },
                    bounds: $scope.bounds
                  };

                  $scope.toggleMapLoad = !$scope.toggleMapLoad;
                }, 400);
              }
              $scope.marketAsks = returnCollection;
            }

            UserMarket.createUserMarket({filter:filter})
              .$promise
              .then(function(response) {
                //$log.debug('Market Asks', response);
                $scope.userMarketCtx.localAskCollection = response.data || [];
                renderLocalData();
              })
              .catch(function(error) {
                $log.warn('bad get asks', error);
              });
          };
          $scope.userMarketCtx.init = function() {
            // get current user
            $scope.currentUser = UserSessionService.getCurrentUserFromClientState();

            // get localized asks
            if ($scope.currentUser.smCurrentPosition) {
              $scope.initMapData();
            }
            // get all asks
            loadAllAsks();
            // render map with asks on it
            // respond to range updates
            $scope.toggleMapLoad = !$scope.toggleMapLoad;
          };
          //if ($scope.activeView === $scope.userMarketCtx.viewName) {

          $scope.userMarketCtx.init();
          //}
        }
      ],
      link: function(scope, el, attrs) {

        function processChainedFilterSet(filterName, inputSet) {
          var propertyRef = 'variant';
          if (!filterName) {
            filterName = 'variants';
          }
          if (filterName === 'modes') {
            propertyRef = 'mode';
          }
          if (filterName === 'cropYear') {
            propertyRef = 'cropYear';
          }
          if (filterName === 'sellers') {
            propertyRef = 'sellerHandle';
          }

          var retVal = [];
          // now do other filters
          // variants
          var isFilterListAll = false;
          scope.filterSourceData[filterName].map(function (filterItem) {
            if (filterItem.checked) {
              if (filterItem.value === 'all') {
                isFilterListAll = true;
                retVal = inputSet;
              }
            }
          });
          if (!isFilterListAll) {
            var activeFilterItems = [];
            var currentFilteredAsks = [];
            scope.filterSourceData[filterName].map(function (filterItem) {
              if (filterItem.checked) {
                activeFilterItems.push(filterItem);
              }
            });

            inputSet.map(function (askItem) {
              for (var i = 0; i < activeFilterItems.length; i++) {
                if (askItem[propertyRef] === activeFilterItems[i].value) {
                  currentFilteredAsks.push(askItem);
                }
              }
            });
            retVal = currentFilteredAsks;
          }
          return retVal;
        }

        scope.$watch('filterSourceData.sellers', function(sellers, oldValue) {

          scope.userMarketCtx.allAsks = processChainedFilterSet('sellers', scope.userMarketCtx.srcAsks);

          if (scope.userMarketCtx.allAsks && scope.userMarketCtx.allAsks.length > 0) {

            scope.userMarketCtx.allAsks = processChainedFilterSet('variants', scope.userMarketCtx.allAsks);
            if (scope.userMarketCtx.allAsks && scope.userMarketCtx.allAsks.length > 0) {

              scope.userMarketCtx.allAsks = processChainedFilterSet('modes', scope.userMarketCtx.allAsks);
            }

          }
          scope.setFiltersAndCounts(scope.userMarketCtx.allAsks);

        }, true);


        scope.$watch('filterSourceData.variants', function(variants, oldValue) {

          scope.userMarketCtx.allAsks = processChainedFilterSet('variants', scope.userMarketCtx.srcAsks);

          if (scope.userMarketCtx.allAsks && scope.userMarketCtx.allAsks.length > 0) {

            scope.userMarketCtx.allAsks = processChainedFilterSet('sellers', scope.userMarketCtx.allAsks);
            if (scope.userMarketCtx.allAsks && scope.userMarketCtx.allAsks.length > 0) {
              scope.userMarketCtx.allAsks = processChainedFilterSet('modes', scope.userMarketCtx.allAsks);
            }
          }
          //scope.setFiltersAndCounts(scope.userMarketCtx.allAsks);
        }, true);


        scope.userMarketMap = L.map('UserMarketMap');
        function initMap() {
          if (!scope.userMarketMap) {
            scope.userMarketMap = L.map('UserMarketMap');

          }
         // if (!scope.userMarketMap.tileLayer) {

          L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(scope.userMarketMap);
         // }

        }


        var rangeCircle;
        var to = null;
        function renderUserMarketMap() {
          if (rangeCircle !== undefined) {
            scope.userMarketMap.removeLayer(rangeCircle);
          }
          rangeCircle = L.circle([scope.userMarketCtx.currentMap.center.lat, scope.userMarketCtx.currentMap.center.lng], (scope.marketRangeKms * 1000), {
            color: 'white',
            fillColor: '#f03',
            fillOpacity: 0.1
          }).addTo(scope.userMarketMap);
          console.log('|  CIRCLE Bounds', rangeCircle.getBounds());
          var internalBounds = rangeCircle.getBounds();
          scope.userMarketCtx.currentMap.bounds.northEast = internalBounds._northEast;
          scope.userMarketCtx.currentMap.bounds.southWest = internalBounds._southWest;
          if (!scope.userMarketCtx.currentMap.zoom) {
            scope.userMarketCtx.currentMap.zoom = 7;
          }
          if (scope.userMarketCtx.currentMap.bounds && scope.userMarketCtx.currentMap.bounds.northEast)  {
            //scope.userMarketMap.setView([scope.userMarketCtx.currentMap.center.lat, scope.userMarketCtx.currentMap.center.lng], scope.userMarketCtx.currentMap.zoom);
            scope.userMarketMap.fitBounds([scope.userMarketCtx.currentMap.bounds.southWest, scope.userMarketCtx.currentMap.bounds.northEast]);
          }
          else {
            scope.userMarketMap.setView([scope.userMarketCtx.currentMap.center.lat, scope.userMarketCtx.currentMap.center.lng], scope.userMarketCtx.currentMap.zoom);
          }
          //if (!scope.userMarketMap.tileLayer) {
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
              attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(scope.userMarketMap);
          //}
//          scope.userMarketMap.setView([scope.userMarketCtx.currentMap.center.lat, scope.userMarketCtx.currentMap.center.lng], scope.userMarketCtx.currentMap.zoom);




          if (scope.markersCollection && scope.markersCollection.length > 0) {
            scope.markersCollection.map(function(mapItem) {
              L.marker([mapItem.lat, mapItem.lng]).addTo(scope.userMarketMap);
            });

          }
        }

        scope.$watch('marketRangeKms', function(newVal, oldVal) {
          $log.debug('marketRangeKms', newVal);
          if (newVal && (newVal !== oldVal)) {
            if(to){
              clearTimeout(to);
            }
            // reset timeout function
            to = setTimeout(function(){
              scope.$apply(function() {
                $log.debug('|');
                $log.debug('|');
                $log.debug('|  I am Executing');
                $log.debug('|');
                $log.debug('|');
                scope.userMarketCtx.init();
              });
            }, 900);
          }
        }, true);
        scope.$watch('toggleMapLoad', function(newVal, oldVal) {
        //  if (scope.activeView === scope.userMarketCtx.viewName) {
            if (scope.userMarketCtx && scope.userMarketCtx.currentMap.center) {
              if (scope.userMarketCtx.currentMap.center.lat && scope.userMarketCtx.currentMap.center.lng) {
                //initMap();
                // scope.userMarketCtx.init();
                $timeout(function() {
                  renderUserMarketMap();
                }, 1000);
              }
            }
      //    }

        }, true);
        scope.$watch('activeView', function(newVal, oldVal) {
          if (newVal && (newVal === scope.userMarketCtx.viewName)) {
            $log.debug('| active view changed to', scope.userMarketCtx.viewName);
            if (scope.currentUser.smCurrentPosition) {

              if (scope.userMarketMap) {
                //scope.userMarketMap.remove();
              }
              initMap();
              scope.userMarketCtx.init();
              scope.toggleMapLoad = !scope.toggleMapLoad;
            }
          }
        }, true);


      }
    }
  }
]);
sm.Market.directive('smMarketAskList', [
  'GeoServices',
  function(GeoServices) {
    return {
      restrict: 'E',
      controller: [
        '$scope',
        '$filter',
        function($scope, $filter) {
          $scope.sortDir = {};
          $scope.sortDir['variant'] = true;
          $scope.sortDir['seller'] = true;
          $scope.sortDir['mode'] = true;
          $scope.sortDir['quantity'] = true;
          $scope.sortDir['distance'] = true;
          $scope.sortDir['age'] = true;
          $scope.sortDir['countryOfOrigin'] = true;
          $scope.sortDir['analysis'] = true;

          $scope.isReverse = function(colName) {
            return $scope.sortDir[colName] = !$scope.sortDir[colName];
          };
          $scope.sortEntities = function(colName) {
            $scope.userMarketCtx.allAsks = $filter('orderBy')($scope.userMarketCtx.allAsks, colName, $scope.isReverse(colName));
          };
          var currentPosition = JSON.parse($scope.currentUser.smCurrentPosition);

          $scope.distanceSrcPoint = {
            lng:currentPosition.geometry.coordinates[0],
            lat:currentPosition.geometry.coordinates[1]
          };
        }
      ],
      link: function(scope, el, attrs) {



        scope.$watch('userMarketCtx.allAsks', function(newVal, oldVal) {
          if (newVal) {

            if (scope.userMarketCtx.allAsks && scope.userMarketCtx.allAsks.map) {
              scope.userMarketCtx.allAsks.map(function(item) {
                item.position.lat = item.position.coordinates[1];
                item.position.lng = item.position.coordinates[0];
                var compPoint = {
                  lat: item.position.coordinates[1],
                  lng: item.position.coordinates[0]
                };

                item.distance = GeoServices.getDistanceFromLatLonInKm(scope.distanceSrcPoint, compPoint);

              });

              ReactDOM.render(React.createElement(sm.MarketAskList, {store:scope}), el[0]);
            }


          }

        }, true);
      }
    }
  }
]);
sm.Market.directive('smMarketFilterList', [
  function() {
    return {
      restrict: 'E',
      scope: {
        filter: '@',
        data: '='
      },
      controller: [
        '$scope',
        function($scope) {
          $scope.filters = $scope.data[$scope.filter];
          $scope.toggleFilterChecked = function(item) {
            // loop over the filters and toggle the checked state of the item
            var allOverRide = false;
            $scope.filters = [];
            var overRideAllChecked = true;
            if (item.value === 'all') {
              allOverRide = true;
              if (item.checked) { // oposite
                overRideAllChecked = false;
              }
              else {
                overRideAllChecked = true;
              }
            }

            for (var i = 0;i <  $scope.data[$scope.filter].length;i++) {
              var filterItem = $scope.data[$scope.filter][i];
              var allIndex;
              if (filterItem.value === 'all') {
                allIndex = i;
              }
              if (allOverRide) {
                if (allOverRide && overRideAllChecked) {
                  filterItem.checked = true;
                }
                else if (allOverRide && !overRideAllChecked) {
                  filterItem.checked = false;
                }
              }
              else {
                if (filterItem.value === item.value) {
                  filterItem.checked = !filterItem.checked;
                  if (!filterItem.checked) {
                    // uncheck the item with all in it
                    allOverRide = false;
                  }
                }
              }

              if (!allOverRide) {
                // make sure all is unchecked
                $scope.data[$scope.filter][allIndex].checked = false;

              }
              $scope.filters.push(filterItem);
            }

          };
        }
      ],
      link: function(scope, el, attrs) {
        scope.$watch('filters', function(filters) {
          if (filters) {
            ReactDOM.render(React.createElement(sm.MarketFilterList, {store:scope}), el[0]);
          }
        }, true);
        scope.$watch('data.counts', function(filters) {
          if (filters) {
            ReactDOM.render(React.createElement(sm.MarketFilterList, {store:scope}), el[0]);
          }
        }, true);

      }
    }
  }
]);
sm.Market.directive('smMarketAskCard', [
  '$log',
  'NAV_CONST',
  function($log, NAV_CONST){
    return {
      restrict: 'E',
      scope: {
        ask: '='
      },
      templateUrl: './scripts/modules/market/templates/market.ask.card.html',
      controller: [
        '$scope',
        function($scope) {

         // console.log($scope.ask);
        }
      ]

    }
  }
]);
/*
 *
 *
 *
 * MARKET MAIN
 *
 *
 *
 * */
sm.Market.directive('smMarketMain', [
  '$log',
  'NAV_CONST',
  function($log, NAV_CONST) {
    return {
      restrict:'E',
      templateUrl: './scripts/modules/market/templates/market.main.html',
      controller: [
        '$scope',
        '$log',
        'NAV_CONST',
        function($scope, $log, NAV_CONST) {
          $log.debug('Market Controller');

          $scope.marketCtx = {
            activeView: NAV_CONST.ASK_VIEW
          };
          function isValidView(event) {
            var retVar = false;
            if (event && event.currentTarget) {
              if (event.currentTarget.attributes && event.currentTarget.attributes['data-name']) {
                if (event.currentTarget.attributes['data-name'].value) {
                  retVar = true;
                }
              }
            }


            return retVar;
          }
          $scope.marketCtx.activateView = function(event) {
            if (isValidView(event)) {
              var viewName = event.currentTarget.attributes['data-name'].value;
              $scope.marketCtx.activeView = viewName;
            }
          };
          $scope.marketCtx.setActiveView = function(viewConst) {
            $scope.marketCtx.activeView = NAV_CONST[viewConst];
          };
          $scope.marketCtx.isActiveView = function(viewName) {
            return viewName === $scope.marketCtx.activeView;
          }

        }


      ],
      link: function(scope, el, attrs) {
        //scope.$watch('marketCtx.activeView', function(newVal, oldVal) {
        //  if (newVal && (newVal === scope.viewName)) {
        //    $log.debug('| active view changed to', scope.marketCtx.activeView);
        //  }
        //
        //}, true);
      }
    }
  }
]);
sm.Market.directive('smMarketNavigator', [
  '$log',
  'NAV_CONST',
  function($log, NAV_CONST) {
    return {
      restrict:'E',
      template: '<button class="CommandButton" ng-click="activateView()">change</button>',
      scope: {
        target: '@'
      },
      controller: [
        '$scope',
        '$log',
        function($scope, $log) {
          $scope.activateView = function() {
            $log.debug('acivate view', $scope.target);
            $scope.marketCtx.setActiveView($scope.target)
          }

        }
      ]

    }
  }]
);
/*
 *
 *
 *
 * MARKET WELCOME
 *
 *
 *
 * */
sm.Market.directive('smMarketWelcome', [
  '$log',
  'MARKET_CONST',
  function($log, MARKET_CONST) {
    return {
      restrict:'E',
      templateUrl: './scripts/modules/market/templates/market.welcome.html',
      controller: [
        '$scope',
        '$log',
        'MARKET_CONST',
        function($scope, $log, MARKET_CONST) {
          $log.debug('Welcome Market Controller');

          $scope.marketCtx = {
            activeView: MARKET_CONST.MARKET_VIEW
          };
          function isValidView(event) {
            var retVar = false;
            if (event && event.currentTarget) {
              if (event.currentTarget.attributes && event.currentTarget.attributes['data-name']) {
                if (event.currentTarget.attributes['data-name'].value) {
                  retVar = true;
                }
              }
            }


            return retVar;
          }
          $scope.marketCtx.activateView = function(event) {
            if (isValidView(event)) {
              var viewName = event.currentTarget.attributes['data-name'].value;
              $log.debug('show me the view', viewName);
              $scope.marketCtx.activeView = viewName;
            }
          };
          $scope.marketCtx.isActiveView = function(viewName) {
            return viewName === $scope.marketCtx.activeView;
          }

        }


      ],
      link: function(scope, el, attrs) {
        //scope.$watch('marketCtx.activeView', function(newVal, oldVal) {
        //  if (newVal && (newVal === scope.viewName)) {
        //    $log.debug('| active view changed to', scope.marketCtx.activeView);
        //  }
        //
        //}, true);
      }
    }
  }
]);



