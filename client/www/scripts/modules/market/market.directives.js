Market.directive('smMarketAskView', [
  '$log',
  function($log) {
    return {
      restrict:'E',
      templateUrl: './scripts/modules/market/templates/market.ask.view.html',
      controller: [
        '$scope',
        'Ask',
        'UserMarket',
        'UserSessionService',
        'leafletBoundsHelpers',
        'leafletData',
        'GeoServices',
        'GEO_CONST',
        '$timeout',
        function($scope, Ask, UserMarket, UserSessionService, leafletBoundsHelpers, leafletData, GeoServices, GEO_CONST, $timeout) {
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
          $log.debug('Market Ask View');
          $scope.marketRange = 2200;
          $scope.marketRangeKms = 160;
          $scope.layers;
          $scope.userMarketMap;
          $scope.toggleMapLoad = false;
          $scope.markersCollection = [];



          var bBox;

          var lats = [];
          var lngs = [];
          $scope.mapCenter = {
            lat:49.1501186,
              lng:-122.2577094
          };
          $scope.bounds = [];
          $scope.resetBounds = [];
          $scope.markers = {};
          $scope.center = {};

          $scope.userMarketCtx = {
            mapCenter: {}
          };

          $scope.updateMarketRange = function() {
            lats = [];
            lngs = [];

            var currentUser = UserSessionService.getCurrentUserFromClientState();


            var currentPosition = JSON.parse(currentUser.smCurrentPosition);

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

                $scope.layers.overlays = {
                  circleLayer:  L.circle([$scope.center.lat, $scope.center.lng], 500, {
                    color: 'red',
                    fillColor: '#f03',
                    fillOpacity: 0.2
                  })
                };

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
                  //angular.extend($scope, {
                  //  bounds: $scope.resetBounds,
                  //  markers: $scope.markers
                  //});
                  $scope.hasResults = true;
                  $timeout(function() {
                    angular.extend($scope, {
                      bounds: $scope.bounds,
                      markers: $scope.markers,
                      center: $scope.center,
                      circle: $scope.circle
                    });

                  }, 400);
                  $scope.toggleMapLoad = !$scope.toggleMapLoad;
                }
                else {
                  northEast = [currentPosition.geometry.coordinates[1], currentPosition.geometry.coordinates[0]];
                  southWest = [currentPosition.geometry.coordinates[1], currentPosition.geometry.coordinates[0]];

                  $scope.bounds = mainUserMarketMap.getBounds();

                  $scope.hasResults = false;
//                      $scope.center.zoom = 8;


                  //$timeout(function() {

                  angular.extend($scope, {
                    bounds: $scope.bounds,
                    center: $scope.center,
                    circle: $scope.circle
                  });
                  $scope.toggleMapLoad = !$scope.toggleMapLoad;
                  //}, 400);
                }
                //$scope.bounds = bounds;
                //$scope.center = center;

                $scope.marketAsks = returnCollection;





























                /*
                *
                * Instantiate the map
                *
                * */
                //leafletData.getMap('UserMarketMain')
                //  .then(function(mainUserMarketMap) {
                //    $log.info(mainUserMarketMap);
                //
                //
                //
                //
                //
                //
                //
                //
                //  })
                //  .catch(function(error) {
                //    $log.warn('bad get main user market map', error);
                //  });



              })
              .catch(function(error) {
                $log.warn('bad get asks', error);
              });

          };


          $scope.updateMarketRange();


        }
      ],
      link: function(scope, el, attrs) {
        scope.userMarketMap = L.map('UserMarketMap');
        function renderUserMarketMap() {
          scope.userMarketMap.setView([scope.center.lat, scope.center.lng], 7);
          L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(scope.userMarketMap);
          L.circle([scope.center.lat, scope.center.lng], (scope.marketRangeKms * 1000), {
            color: 'white',
            fillColor: '#f03',
            fillOpacity: 0.1
          }).addTo(scope.userMarketMap);

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
          if (scope.center.lat && scope.center.lng) {
            renderUserMarketMap();

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
Market.directive('smMarketGeoView', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/market/templates/market.geo.view.html',
      controller: [
        '$scope',
        '$log',
        'GeoServices',
        'UserSessionService',
        'UserServices',
        '$timeout',
        function($scope, $log, GeoServices, UserSessionService, UserServices, $timeout) {
          $scope.geoCtx = {
            position:{},
            positionChoiceList: [],
            isLookingUpCurrentLocation: false
          };
          $scope.mapCenter = {
            lat:49.1501186,
            lng:-122.2577094
          };
          function updateMapCenter(lat, lng) {
            if (lat && lng) {
              $scope.mapCenter = {
                lat:lat,
                lng:lng
              };
              $scope.center = {
                lat: parseFloat($scope.mapCenter.lat),
                lng: parseFloat($scope.mapCenter.lng),
                zoom: 8
              };

            }
          }


          $scope.center = {
            lat: $scope.mapCenter.lat,
            lng: $scope.mapCenter.lng,
            zoom: 8
          };

          $log.debug('market geo view directive controller');

          $scope.getMyPosition = function() {
            var geoX = {};
            $scope.geoCtx.isLookingUpCurrentLocation = true;
            GeoServices.getCurrentPosition()
              .then(function(location) {
                $log.debug('my current location', location);
                // reverse lookup to get the name

                if (location.coords.latitude && location.coords.longitude) {
                  GeoServices.reverseLookup(location.coords.latitude, location.coords.longitude)
                    .then(function(reverseLookupResponse) {
                      $scope.geoCtx.isLookingUpCurrentLocation = false;

                      geoX = {
                        "type": "Feature",
                        "geometry": {
                          "type": "Point",
                          "coordinates": [parseFloat(location.coords.longitude), parseFloat(location.coords.latitude)]
                        },
                        "properties": {
                          "name": reverseLookupResponse.display_name
                        }
                      };
                      $log.debug('getCurrentPosition', geoX);
                      updateMapCenter(geoX.geometry.coordinates[1], geoX.geometry.coordinates[0]);
                      $scope.geoCtx.position = geoX;
                      UserServices.updateCurrentUserPosition(geoX);
                    });
                }



              })
              .catch(function(error) {
                $log.warn('| bad get current location', error);
                $scope.geoCtx.isLookingUpCurrentLocation = false;

              });
          };

          $scope.selectThisPosition = function(position) {
            if (position.geometry && position.geometry.coordinates) {
              updateMapCenter(position.geometry.coordinates[1], position.geometry.coordinates[0]);
              $scope.geoCtx.position = position;
              $scope.geoCtx.positionChoiceList = [];
              UserSessionService.putValueByKey('smCurrentPosition', JSON.stringify($scope.geoCtx.position));
              UserServices.updateCurrentUserPosition(position);
              return;
            }
            if (position.lat && position.lon) {
              GeoServices.reverseLookup(position.lat, position.lon)
                .then(function(reverseLookupResponse) {
                  geoX = {
                    "type": "Feature",
                    "geometry": {
                      "type": "Point",
                      "coordinates": [parseFloat(position.lon), parseFloat(position.lat)]
                    },
                    "properties": {
                      "name": reverseLookupResponse.display_name
                    }
                  };
                  $log.debug('getCurrentPosition', geoX);
                  updateMapCenter(geoX.geometry.coordinates[1], geoX.geometry.coordinates[0]);
                  $scope.geoCtx.position = geoX;
                  UserServices.updateCurrentUserPosition(geoX);
                  $scope.geoCtx.positionChoiceList = [];
                  $scope.geoCtx.lookupAddress = '';
                });
            }


          };
          $scope.$on('leafletDirectiveMap.click', function (e, wrap) {
            $log.debug("Lat, Lon : " + wrap.leafletEvent.latlng.lat + ", " + wrap.leafletEvent.latlng.lng);
            // do reverse lookup?
            GeoServices.reverseLookup(wrap.leafletEvent.latlng.lat, wrap.leafletEvent.latlng.lng)
              .then(function(location) {
                var geoX = {
                  "type": "Feature",
                  "geometry": {
                    "type": "Point",
                    "coordinates": [parseFloat(location.lon), parseFloat(location.lat)]
                  },
                  "properties": {
                    "name": location.display_name
                  }
                };
                $log.debug('leafletDirectiveMap.click', geoX);
                updateMapCenter(geoX.geometry.coordinates[1], geoX.geometry.coordinates[0]);
                $scope.geoCtx.position = geoX;
                UserServices.updateCurrentUserPosition(geoX);
              });
          });
          $scope.lookupTargetAddress = function() {
            if ($scope.geoCtx.lookupAddress) {
              $log.debug('Geo Code this', $scope.geoCtx.lookupAddress);
              // TODO
              var sanitizedLookupString = $scope.geoCtx.lookupAddress;
              GeoServices.geoLookup(sanitizedLookupString)
                .then(function(locations) {
                  if (locations.length > 0) {
                    if (locations.length === 1) {
                      var geoX = {
                        "type": "Feature",
                        "geometry": {
                          "type": "Point",
                          "coordinates": [parseFloat(locations[0].lon), parseFloat(locations[0].lat)]
                        },
                        "properties": {
                          "name": locations[0].display_name
                        }
                      };
                      $scope.selectThisPosition(geoX);
                      updateMapCenter(geoX.geometry.coordinates[1], geoX.geometry.coordinates[0]);
                      $log.debug('lookupTargetAddress', geoX);
                      UserServices.updateCurrentUserPosition(geoX);

                    }
                    else {
                      $scope.geoCtx.positionChoiceList = locations;
                    }

                  }
                })
                .catch(function(error) {
                  $log('| bad get user location from string', error);
                });

            }
          };
          $scope.init = function() {
            // check for current postion
            var tempCurrentUser = UserSessionService.getCurrentUserFromClientState();
            if (tempCurrentUser.smCurrentPosition) {
              tempCurrentUser.smCurrentPosition = JSON.parse(tempCurrentUser.smCurrentPosition);
              $scope.geoCtx.position = tempCurrentUser.smCurrentPosition;
              updateMapCenter(tempCurrentUser.smCurrentPosition.geometry.coordinates[1], tempCurrentUser.smCurrentPosition.geometry.coordinates[0]);

              // get all products near you



            }
          }();


        }
       ]
    }
  }
]);
Market.directive('smMarketMain', [
  function() {
    return {
      restrict:'E',
      templateUrl: './scripts/modules/market/templates/market.main.html',
      controller: [
        '$scope',
        '$log',
        'smSocket',
        'UserSessionService',
        function($scope, $log, smSocket, UserSessionService) {

          // we need a user
          // user needs a location
          /*
          *
          * - could be country based on ip
          * - type ahead city / state
          * - html5 geolocation
          * - type in an address
          * - click on a map
          *
          * */




          // make sure we have a user (token)
          // open a socket
          // need a geo element on user
          // get latest market updates
          /*
           *
           * Socket Initialization
           *
           * */
          smSocket.on('smRealTimeConnection', function(socketClientId) {
            $log.debug('|');
            $log.debug('|');
            $log.debug('| smRealTimeConnection socketClientId', socketClientId);
            $log.debug('|');
            $log.debug('|');

            UserSessionService.putValueByKey('smSocketClientId', socketClientId);

            //$log.debug('|   currentUser.smUserId', smGlobalValues.currentUser.smSocketClientId);

          });


          $scope.activateAskForm = false;

          $scope.postAnAsk = function() {
            $log.debug('POST AN ASK');

              $scope.activateAskForm = true;
            /*
            * In order to post an ask a user must register
            * should follow the process that craigslist does
            * - simple wizard
            * - post up what you have for sale
            * - email address and password (if not logged in)
            * - on submit check email address
            * - send post to email
            * - request for password (login if has account)
            * - updload images and or video
            * - preview to confirm
            * - make sure we have geo relevant info
            * - post to market
            *
            *
            * */
          }
        }
      ]
    }
  }
]);



