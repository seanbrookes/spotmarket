sm.Crop.service('CropServices', [
  'Crop',
  function(Crop) {
    var svc = this;

    svc.saveCrop = function(crop) {
      if (!crop.createdDate) {
        crop.createdDate = (new Date).getTime();
      }
      crop.lastUpdate = (new Date).getTime();
      if (crop.id) {
        return Crop.upsert(crop)
          .$promise
          .then(function(response) {
            return response;
          });

      }
      else {
        return Crop.create(crop)
          .$promise
          .then(function(response) {
            return response;
          });
      }
    };
    svc.deleteCrop = function(cropId) {
      if (cropId) {
        return Crop.deleteById({id:cropId})
          .$promise
          .then(function(response) {
            return response;
          })
      }
    };
    svc.getCrops = function(filter) {
      if (!filter) {
        filter = {};
      }
      return Crop.find(filter)
        .$promise
        .then(function(response) {
          return response || [];
        });
    };

    svc.saveCropSubType = function(cropSubType) {
      if (!cropSubType.createdDate) {
        cropSubType.createdDate = (new Date).getTime();
      }
      cropSubType.lastUpdate = (new Date).getTime();
      if (cropSubType.id) {
        return CropSubType.upsert(cropSubType)
          .$promise
          .then(function(response) {
            return response;
          });

      }
      else {
        return CropSubType.create(cropSubType)
          .$promise
          .then(function(response) {
            return response;
          });
      }
    };
    svc.deleteCropSubType = function(cropSubTypeId) {
      if (cropSubTypeId) {
        return CropSubType.deleteById({id:cropSubTypeId})
          .$promise
          .then(function(response) {
            return response;
          })
      }
    };
    svc.getCropSubTypes = function(filter) {
      if (!filter) {
        filter = {};
      }
      return CropSubType.find(filter)
        .$promise
        .then(function(response) {
          return response || [];
        });
    };


    return svc;
  }
]);

/*
*
*
* Original imports
*
*     $http({
 method: 'GET',
 url: './scripts/modules/acme/hop-farms.json'
 })
 .then(
 function(response) {
 $log.debug('WE GOT IT');
 var collection = response.data;

 collection.map(function(entity) {
 var newAccount = {
 name: entity.name,
 city: entity.city,
 type: 'hop-farm',
 geometry: {
 type: 'Point',
 coordinates: [entity.long, entity.lat]
 },
 password: 'password',
 email: 'test@greengrowtech.ca'
 };

 $log.debug('Write It', newAccount);
 UserProfile.create(newAccount)
 .$promise
 .then(function(response) {
 $log.debug('ADDED', response);
 })
 .catch(function(error) {
 $log.warn('BAD', error);
 });
 });
 },
 function(error) {
 $log.warn('No dice', error);

 }
 );
*
* */
