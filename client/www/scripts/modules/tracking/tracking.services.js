Tracking.service('TrackingServices', [
  'Track',
  '$log',
  function(Track, $log) {
    var svc = this;

    svc.getRecentTracks = function() {
      return Track.find({})
        .$promise
        .then(function(response) {
          return response;
        })
        .catch(function(error) {
          $log.error('bad get tracks', error);
        });
    };

    return svc;
  }
]);
