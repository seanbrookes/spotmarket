UI.service('UIServices', [
  'ProductType',
  'ProductSubType',
  function(ProductType, ProductSubType) {
    var svc = this;



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
