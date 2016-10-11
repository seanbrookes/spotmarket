sm.Geo.service('GeoServices', [
  '$http',
  '$log',
  '$q',
  '$window',
  'GEO_CONST',
  'UserSessionService',
  function($http, $log, $q, $window, GEO_CONST, UserSessionService) {
    var svc = this;
    function deg2rad(deg) {
      return deg * (Math.PI / 180)
    }

    svc.geoLookup = function(lookupString) {

      var lookupAddress = 'http://locationiq.org/v1/search.php?key=2e1e7a44cd9fd0617833&format=json&q=' + lookupString;
      return $http.get(lookupAddress)
        .then(function(response) {
          return response.data;
        })
        .catch(function(error) {
          $log.warn('| bad geocode lookup', error);
          return;

        });


    };
    svc.getBoundingCoordinateByName = function(pointName, coordsCollection) {

      var coordinatesSortedByLatitude = coordsCollection.map(function(collectionItem) {
        var internalLat = collectionItem[0];
        var internalLon = collectionItem[1];
      });


      switch(pointName) {
        case GEO_CONST.NW_COORDINATE:

          break;
        case GEO_CONST.NE_COORDINATE:

          break;

        case GEO_CONST.SW_COORDINATE:

          break;
        case GEO_CONST.SE_COORDINATE:

          break;

        default:

      }
    };
    svc.getDistanceFromLatLonInKm = function(pos1, pos2) {
      var R = 6371; // Radius of the earth in kilometers
      var dLat = deg2rad(pos2.lat - pos1.lat); // deg2rad below
      var dLon = deg2rad(pos2.lng - pos1.lng);
      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(pos1.lat)) * Math.cos(deg2rad(pos2.lat)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c; // Distance in KM
      return d.toFixed(1);
    };




    svc.reverseLookup = function(lat, lon) {
      if (lat && lon) {
        var reversLookupUrl = 'http://osm1.unwiredlabs.com/locationiq/v1/reverse.php?format=json&key=2e1e7a44cd9fd0617833&lat=' + lat + '&lon=' + lon + '&zoom=16';
        return $http.get(reversLookupUrl)
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            $log.warn('| bad reverse lookup', error);
            return;

          });
      }
    };
    svc.getCurrentGPSPosition = function() {
      var deferred = $q.defer();

      if (!$window.navigator.geolocation) {
        // TODO track this
        $log.warn('Geolocation not support in user agent');
        deferred.reject('Geolocation not supported.');
      }
      else {
        $window.navigator.geolocation.getCurrentPosition(
          function (position) {
            deferred.resolve(position);
          },
          function (err) {
            deferred.reject(err);
          });
      }

      return deferred.promise;
    };
    svc.setCurrentPosition = function(position) {
      return UserSessionService.setValueByKey('smCurrentPosition', position);

    };


    return svc;
  }
]);
