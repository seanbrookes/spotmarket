Ask.service('AskServices', [
  'Ask',
  'PendingAsk',
  'LotPrice',
  function(Ask, PendingAsk, LotPrice) {
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
        var filter = {
          where:{
            id:askId
          }
        };
        return svc.getPendingAsks({filter:filter})
          .then(function(response) {
            if (response) {
              var target = response[0];
              target.status = 'deleted';
              svc.savePendingAsk(target)
                .then(function(response) {
                  return;
                });
            }
          });
        // get ask by id
        // set status to deleted
        // update the db

        //return PendingAsk.deleteById({id:askId})
        //  .$promise
        //  .then(function(response) {
        //    return response;
        //  })
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

    svc.saveLotPrice = function(lotPriceArg) {
      if (lotPriceArg && lotPriceArg.id) {
        // update
        return LotPrice.upsert(lotPriceArg)
          .$promise
          .then(function(response) {
            return response;
          })
          .catch(function(error) {
            $log.warn('bad update lot price', error);
            return;
          });
      }
      else {
        // create
        return LotPrice.create(lotPriceArg)
          .$promise
          .then(function(response) {
            return response;
          })
          .catch(function(error) {
            $log.warn('bad create lot price', error);
            return;
          });
      }
    };

    return svc;
  }
]);
