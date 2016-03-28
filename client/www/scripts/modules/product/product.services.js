Product.service('ProductServices', [
  'ProductType',
  'ProductSubType',
  function(ProductType, ProductSubType) {
    var svc = this;

    svc.saveProductType = function(productType) {
      if (!productType.createdDate) {
        productType.createdDate = (new Date).getTime();
      }
      productType.lastUpdate = (new Date).getTime();
      if (productType.id) {
        return ProductType.upsert(productType)
          .$promise
          .then(function(response) {
            return response;
          });

      }
      else {
        return ProductType.create(productType)
          .$promise
          .then(function(response) {
            return response;
          });
      }
    };
    svc.deleteProductType = function(productTypeId) {
      if (productTypeId) {
        return ProductType.deleteById({id:productTypeId})
          .$promise
          .then(function(response) {
            return response;
          })
      }
    };
    svc.getProductTypes = function(filter) {
      if (!filter) {
        filter = {};
      }
      return ProductType.find(filter)
        .$promise
        .then(function(response) {
          return response || [];
        });
    };

    svc.saveProductSubType = function(productSubType) {
      if (!productSubType.createdDate) {
        productSubType.createdDate = (new Date).getTime();
      }
      productSubType.lastUpdate = (new Date).getTime();
      if (productSubType.id) {
        return ProductSubType.upsert(productSubType)
          .$promise
          .then(function(response) {
            return response;
          });

      }
      else {
        return ProductSubType.create(productSubType)
          .$promise
          .then(function(response) {
            return response;
          });
      }
    };
    svc.deleteProductSubType = function(productSubTypeId) {
      if (productSubTypeId) {
        return ProductSubType.deleteById({id:productSubTypeId})
          .$promise
          .then(function(response) {
            return response;
          })
      }
    };
    svc.getProductSubTypes = function(filter) {
      if (!filter) {
        filter = {};
      }
      return ProductSubType.find(filter)
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
