/*
 *
 *
 *
 * GEO VIEW
 *
 *
 *
 * */
Geo.directive('smGeoMarketView', [
  '$log',
  'MARKET_CONST',
  '$timeout',
  'UserSessionService',
  'orderByFilter',
  '$http',
  function($log, MARKET_CONST, $timeout, UserSessionService, orderBy, $http) {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/geo/templates/geo.market.view.html',
      scope: {
        activeView: '='
      },
      controller: [
        '$scope',
        '$log',
        'GeoServices',
        'UserServices',
        function($scope, $log, GeoServices, UserServices) {

          $scope.geoCtx = {
            viewName: MARKET_CONST.GEO_VIEW,
            position:{},
            currentLocationString: '',
            positionChoiceList: [],
            isLookingUpCurrentLocation: false,
            isShowLocationHistory: false,
            lookupAddress: '',
            lookupCity: ''
          };
          $scope.findMeMap;

          $scope.mapCenter = {
            lat:49.1501186,
            lng:-122.2577094
          };
          $scope.geoCtx.defaultCurrentPosition = {
            address: {
              city: "Vancouver",
              country: "Canada",
              county: "Greater Vancouver Regional District",
              state: "British Columbia"
            },
            geometry: {
              coordinates: [
                -123.1139382,
                49.2608944
              ],
              type: "Point"
            }
          };

          function loadLocationHistory() {
            $scope.geoCtx.locationHistory = UserSessionService.getCurrentUserLocationHistory()
              .then(function(response) {
                var collection = response;
                collection.map(function(historyItem) {
                  historyItem.displayTimeSince = moment(historyItem.timestamp);
                });
                collection = orderBy(collection, 'timestamp', true);
                $scope.geoCtx.locationHistory = collection;
              });
          }

          function updateMapCenter(lat, lng) {
            if (lat && lng) {
              $timeout(function() {
                $scope.geoCtx.mapCenter = {
                  lat:lat,
                  lng:lng
                };
                $scope.mapCenter = {
                  lat:lat,
                  lng:lng
                };
                $scope.center = {
                  lat: parseFloat($scope.mapCenter.lat),
                  lng: parseFloat($scope.mapCenter.lng),
                  zoom: 8
                };

              }, 25);

            }
          }
          function assignAddressCity(address) {
            if (address.city) {
              return address;
            }
            else if (address.town) {
              address.city = address.town;
            }
            else if (address.village) {
              address.city = address.village;
            }
            else if (address.county) {
              address.city = address.county;
            }
            return address;

          }
          function updateUserCurrentPosition() {
            UserSessionService.setValueByKey('smCurrentPosition', JSON.stringify($scope.geoCtx.position));
            UserServices.updateCurrentUserPosition($scope.geoCtx.position);
            $scope.geoCtx.init();
          }


          $scope.center = {
            lat: $scope.mapCenter.lat,
            lng: $scope.mapCenter.lng,
            zoom: 8
          };

          $scope.geoCtx.deleteLocationHistory = function(location) {
            if (location) {
              if (confirm('delete from history?')) {
                UserSessionService.deleteLocationHistoryById(location.id)
                  .then(function(response) {
                    loadLocationHistory();
                  });

              }
            }
          };
          $scope.geoCtx.refreshFindMeMap = function() {
            $scope.geoCtx.init();
          };
          $scope.geoCtx.setCurrentUserPosition = function(location) {
            $log.debug('| Set my position', location.location);
            UserServices.updateCurrentUserPosition(location.location);
            $scope.geoCtx.init();
          };


          $scope.getMyPosition = function() {
            var geoX = {};
            $scope.geoCtx.isLookingUpCurrentLocation = true;
            GeoServices.getCurrentGPSPosition()
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
                        "address": assignAddressCity(reverseLookupResponse.address)
                      };
                      $log.debug('getCurrentGPSPosition', geoX);
                      updateMapCenter(geoX.geometry.coordinates[1], geoX.geometry.coordinates[0]);
                      $scope.geoCtx.position = geoX;
                      updateUserCurrentPosition();
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
              $scope.geoCtx.positionChoiceList = [];
              $scope.geoCtx.position = position;

              updateMapCenter(position.geometry.coordinates[1], position.geometry.coordinates[0]);

              GeoServices.reverseLookup(position.geometry.coordinates[1], position.geometry.coordinates[0])
                .then(function(reverseLookupResponse) {
                  $scope.geoCtx.position.address = assignAddressCity(reverseLookupResponse.address);
                  updateUserCurrentPosition();
                  return;

                });






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
                    "address": assignAddressCity(reverseLookupResponse.address)
                  };
                  $log.debug('getCurrentGPSPosition', geoX);
                  updateMapCenter(geoX.geometry.coordinates[1], geoX.geometry.coordinates[0]);
                  $scope.geoCtx.position = geoX;
                  updateUserCurrentPosition();
                  $scope.geoCtx.positionChoiceList = [];
                  $scope.geoCtx.lookupAddress = '';
                });
            }


          };
          $scope.mapClick =  function (event) {
            $log.debug("Lat, Lon : " + event.latlng.lat + ", " + event.latlng.lng);
            // do reverse lookup?
            GeoServices.reverseLookup(event.latlng.lat, event.latlng.lng)
              .then(function(reverseLookupResponse) {
                var geoX = {
                  "type": "Feature",
                  "geometry": {
                    "type": "Point",
                    "coordinates": [parseFloat(reverseLookupResponse.lon), parseFloat(reverseLookupResponse.lat)]
                  },
                  "address": assignAddressCity(reverseLookupResponse.address)
                };
                $log.debug('leafletDirectiveMap.click', geoX);
                updateMapCenter(geoX.geometry.coordinates[1], geoX.geometry.coordinates[0]);
                $scope.geoCtx.position = geoX;
                updateUserCurrentPosition();
              });
          };
          $scope.lookupTargetAddress = function() {
            if ($scope.geoCtx.lookupAddress) {
              $log.debug('Geo Code this', $scope.geoCtx.lookupAddress);
              // TODO
              var sanitizedLookupString = $scope.geoCtx.lookupAddress;
              GeoServices.geoLookup(sanitizedLookupString)
                .then(function(locations) {
                  if (locations.length > 0) {
                    if (locations.length === 1) {
                      $scope.selectThisPosition(locations[0]);

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
          $scope.geoCtx.isGeoLocationHistoryVisible = function() {
            return $scope.geoCtx.isShowLocationHistory;
          };
          $scope.geoCtx.toggleLocationHistory = function() {
            $scope.geoCtx.isShowLocationHistory = !$scope.geoCtx.isShowLocationHistory;
          };
          $scope.geoCtx.clearCurrentPosition = function() {
            if (confirm('delete current position?')) {
              UserSessionService.deleteValueByKey('smCurrentPosition');
              $scope.geoCtx.init();
            }
          };
          $scope.geoCtx.init = function() {
            // check for current postion
            $scope.geoCtx.isShowLocationHistory = false;
            $timeout(function() {
              var tempCurrentUser = UserSessionService.getCurrentUserFromClientState();
              var findMeMapCenter = {

              };
              if (tempCurrentUser.smCurrentPosition) {
                tempCurrentUser.smCurrentPosition = JSON.parse(tempCurrentUser.smCurrentPosition);
                $scope.geoCtx.position = tempCurrentUser.smCurrentPosition;
              }
              else {
                //alert('You have no defined current position so we are assigning one to you. You can change it  here');
                // use default coordinates
                $scope.geoCtx.position = $scope.geoCtx.defaultCurrentPosition;
                updateUserCurrentPosition();
              }
              updateMapCenter($scope.geoCtx.position.geometry.coordinates[1], $scope.geoCtx.position.geometry.coordinates[0]);
              $scope.geoCtx.currentLocationString = $scope.geoCtx.position.address.city + ', ' + $scope.geoCtx.position.address.state;
              $scope.geoCtx.refreshMap();
              loadLocationHistory();
            }, 200);
          };
          $scope.geoCtx.init();
          $scope.geoCtx.refreshMap = function() {

            $scope.findMeMap.setView([$scope.geoCtx.position.geometry.coordinates[1], $scope.geoCtx.position.geometry.coordinates[0]], 8);
          };

        }
      ],
      link: function(scope, el, attrs) {

        function initMap() {
          scope.findMeMap = L.map('FindMeMap');
          scope.findMeMap.on('click', scope.mapClick);
          L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(scope.findMeMap);


        }
        initMap();

        scope.$watch('$scope.geoCtx.position', function(newVal, oldVal) {
          if (newVal && newVal.geometry) {
            scope.geoCtx.refreshMap();
          }
        }, true);


        scope.$watch('geoCtx.lookupCity', function(newVal, oldVal) {
          if (newVal && (newVal !== oldVal)) {
            $timeout(function() {
              var url = "http://gd.geobytes.com/AutoCompleteCity?callback=?&q=" + newVal;

              $http.jsonp(url)
                .success(function(data){
                  console.log(data.found);
                });
            }, 500);

          }
        });

        //$("#f_elem_city").autocomplete({
        //  source: function (request, response) {
        //    $.getJSON(
        //      "http://gd.geobytes.com/AutoCompleteCity?callback=?&q="+request.term,
        //      function (data) {
        //        response(data);
        //      }
        //    );
        //  },
        //  minLength: 3,
        //  select: function (event, ui) {
        //    var selectedObj = ui.item;
        //    jQuery("#f_elem_city").val(selectedObj.value);
        //    getcitydetails(selectedObj.value);
        //    return false;
        //  },
        //  open: function () {
        //    jQuery(this).removeClass("ui-corner-all").addClass("ui-corner-top");
        //  },
        //  close: function () {
        //    jQuery(this).removeClass("ui-corner-top").addClass("ui-corner-all");
        //  }
        //});
        //jQuery("#f_elem_city").autocomplete("option", "delay", 100);

        scope.$watch('activeView', function(newVal, oldVal) {
          if (newVal && (newVal === scope.geoCtx.viewName)) {
            if (scope.findMeMap) {
              scope.findMeMap.remove();
            }
            initMap();
            scope.geoCtx.init();
            $log.debug('| active view changed to', scope.geoCtx.viewName);
          }

        }, true);

      }
    }
  }
]);
Geo.directive('smGeoCurrentLocationDisplay', [
  function() {
    return {
      restrict: 'E',
      scope: {},
      controller: [
        '$scope',
        '$log',
        'UserSessionService',
        'smGlobalValues',
        function($scope, $log, UserSessionService, smGlobalValues) {
          $log.debug('smGeoCurrentLocationDisplay controller');

          $scope.curUser  = smGlobalValues.currentUser;

          var tempCurrentUser = UserSessionService.getCurrentUserFromClientState();
          $scope.currentLocationString = '';

          if (tempCurrentUser.smCurrentPosition) {
            tempCurrentUser.smCurrentPosition = JSON.parse(tempCurrentUser.smCurrentPosition);
            var position = tempCurrentUser.smCurrentPosition;
            $scope.currentLocationString = position.address.city + ', ' + position.address.state;

          }

        }
      ],
      link: function(scope, el, attrs) {
        scope.$watch('currentLocationString', function(newVal, oldVal) {

          ReactDOM.render(React.createElement(CurrentLocationDisplay, {store:scope.currentLocationString}), el[0]);

        }, true);
        scope.$watch('curUser', function(newVal, oldVal) {
          var position = JSON.parse(newVal.smCurrentPosition);
          scope.currentLocationString = position.address.city + ', ' + position.address.state;

          ReactDOM.render(React.createElement(CurrentLocationDisplay, {store:scope.currentLocationString}), el[0]);

        }, true);

      }

    }

  }
]);
