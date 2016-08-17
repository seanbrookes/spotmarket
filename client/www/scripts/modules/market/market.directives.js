/*
*
*
*
* MARKET VIEW
*
*
*
* */
Market.directive('smMarketMarketView', [
  '$log',
  '$timeout',
  'MARKET_CONST',
  function($log, $timeout, MARKET_CONST) {
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
            viewName: MARKET_CONST.MARKET_VIEW,
            currentMap: {
              center: {},
              zoom: 7
            }
          };

          $scope.marketRange = 2200;
          $scope.marketRangeKms = 160;
          $scope.layers;
          $scope.userMarketMap;
          $scope.toggleMapLoad = false;
          $scope.markersCollection = [];
          $scope.userMarketCtx.allAsks = [];

          $scope.bounds = [];
          $scope.resetBounds = [];
          $scope.markers = {};
          $scope.center = {};
          $scope.userMarketMap;






          if (!$scope.currentUser.smCurrentPosition) {
            // alert('message from MarketView: There is no current position!!!');
            //return;
          }


          function loadAllAsks() {
            $scope.userMarketCtx.allAsks = AskServices.getAsks()
              .then(function(response) {
                $scope.userMarketCtx.allAsks = response;
              });

          }
          loadAllAsks();



          $scope.initMapData = function() {
            lats = [];
            lngs = [];


            $scope.currentUser = UserSessionService.getCurrentUserFromClientState();


            var currentPosition = JSON.parse($scope.currentUser.smCurrentPosition);


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

              UserMarket.createUserMarket({filter:filter})
                .$promise
                .then(function(response) {
                  $log.debug('Market Asks', response);
                  var returnCollection = response.data;
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
                    lats.push(mapItem.position.lat);
                    lngs.push(mapItem.position.lng);

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

          };

          $scope.userMarketCtx.init();

        }
      ],
      link: function(scope, el, attrs) {
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
        initMap();

        var rangeCircle;
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
        }, true);
        scope.$watch('toggleMapLoad', function(newVal, oldVal) {
          if (scope.userMarketCtx && scope.userMarketCtx.currentMap.center) {
            if (scope.userMarketCtx.currentMap.center.lat && scope.userMarketCtx.currentMap.center.lng) {
              //initMap();
              $timeout(function() {
                renderUserMarketMap();
              }, 4000);
            }
          }
        }, true);

        scope.$watch('activeView', function(newVal, oldVal) {
          if (newVal && (newVal === scope.userMarketCtx.viewName)) {
            $log.debug('| active view changed to', scope.userMarketCtx.viewName);
            if (scope.currentUser.smCurrentPosition) {

              if (scope.userMarketMap) {
                //scope.userMarketMap.remove();
              }
              scope.userMarketCtx.init();
              scope.toggleMapLoad = !scope.toggleMapLoad;
            }
          }
        }, true);
        //scope.userMarketMap = L.map('UserMarketMap').setView([49.955, -122.483], 7);
        //L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        //  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        //}).addTo(scope.userMarketMap);

      }
    }
  }
]);
Market.directive('smMarketAskCard', [
  '$log',
  'MARKET_CONST',
  function($log, MARKET_CONST){
    return {
      restrict: 'E',
      scope: {
        ask: '='
      },
      templateUrl: './scripts/modules/market/templates/market.ask.card.html',
      controller: [
        '$scope',
        function($scope) {

          console.log($scope.ask);
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
Market.directive('smMarketMain', [
  '$log',
  'MARKET_CONST',
  function($log, MARKET_CONST) {
    return {
      restrict:'E',
      templateUrl: './scripts/modules/market/templates/market.main.html',
      controller: [
        '$scope',
        '$log',
        'MARKET_CONST',
        function($scope, $log, MARKET_CONST) {
          $log.debug('Market Controller');

          $scope.marketCtx = {
            activeView: MARKET_CONST.ASK_VIEW
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
]);/*
 *
 *
 *
 * MARKET WELCOME
 *
 *
 *
 * */
Market.directive('smMarketWelcome', [
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



