sm.Common.service('CommonServices', [
  '$http',
  function($http) {
    var svc = this;

    svc.isValidEmail = function(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    };
    svc.generateGuid = function() {

      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();

    };
    svc.getListOfCountries = function() {
      return $http.get('./scripts/modules/common/countries.json')
        .then(function(response) {
          return response.data;
        })
        .catch(function(error) {
          $log.warn('| bad get countries list', error);
          return;

        });
    };

    return svc;
  }
]);
