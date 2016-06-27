Geo.service('GeoServices', [
  '$http',
  '$log',
  '$q',
  '$window',
  function($http, $log, $q, $window) {
    var svc = this;


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
    svc.getCurrentPosition = function() {
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


    return svc;
  }
]);
