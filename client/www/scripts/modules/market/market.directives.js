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
                          "coordinates": [location.coords.longitude, location.coords.latitude]
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
              updateMapCenter(geoX.geometry.coordinates[1], geoX.geometry.coordinates[0]);
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
                      "coordinates": [position.lon, position.lat]
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
                    "coordinates": [location.lon, location.lat]
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
                          "coordinates": [locations[0].lon, locations[0].lat]
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
          }
          $scope.init = function() {
            // check for current postion
            var tempCurrentUser = UserSessionService.getCurrentUserFromClientState();
            tempCurrentUser.smCurrentPosition = JSON.parse(tempCurrentUser.smCurrentPosition);
            if (tempCurrentUser.smCurrentPosition) {
              $scope.geoCtx.position = tempCurrentUser.smCurrentPosition;
              updateMapCenter(tempCurrentUser.smCurrentPosition.geometry.coordinates[1], tempCurrentUser.smCurrentPosition.geometry.coordinates[0]);

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
