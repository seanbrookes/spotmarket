Ask.service('AskServices', [
  'Ask',
  'PendingAsk',
  function(Ask, PendingAsk) {
    var svc = this;

    svc.saveAsk = function(ask) {
      if (!ask.createdDate) {
        ask.createdDate = (new Date).getTime();
      }
      ask.lastUpdate = (new Date).getTime();
      if (ask.id) {
        return Ask.upsert(ask)
          .$promise
          .then(function(response) {
            return response;
          });

      }
      else {
        return Ask.create(ask)
          .$promise
          .then(function(response) {
            return response;
          });
      }
    };
    svc.savePendingAsk = function(ask) {
      if (!ask.createdDate) {
        ask.createdDate = (new Date).getTime();
      }
      ask.lastUpdate = (new Date).getTime();
      if (ask.id) {
        return PendingAsk.upsert(ask)
          .$promise
          .then(function(response) {
            return response;
          });

      }
      else {
        return PendingAsk.create(ask)
          .$promise
          .then(function(response) {
            return response;
          });
      }
    };
    svc.deletePendingAsk = function(askId) {
      if (askId) {
        return PendingAsk.deleteById({id:askId})
          .$promise
          .then(function(response) {
            return response;
          })
      }
    };
    svc.getPendingAsks = function(filter) {
      if (!filter) {
        filter = {};
      }
      return PendingAsk.find(filter)
        .$promise
        .then(function(response) {
          return response || [];
        });
    };
    svc.deleteAsk = function(askId) {
      if (askId) {
        return Ask.deleteById({id:askId})
          .$promise
          .then(function(response) {
            return response;
          })
      }
    };
    svc.getAsks = function(filter) {
      if (!filter) {
        filter = {};
      }
      return Ask.find(filter)
        .$promise
        .then(function(response) {
          return response || [];
        });
    };
    svc.getPendingAsks = function(filter) {
      if (!filter) {
        filter = {};
      }
      return PendingAsk.find(filter)
        .$promise
        .then(function(response) {
          return response || [];
        });
    };

    return svc;
  }
]);
