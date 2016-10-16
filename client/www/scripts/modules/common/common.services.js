sm.Common.service('CommonServices', [
  '$http',
  function($http) {
    var svc = this;

    svc.getExchangeRate = function(conversion) {
      //http://rate-exchange-1.appspot.com/currency?from=CAD&to=USD
      var xRate;


      var url = "http://free.currencyconverterapi.com/api/v3/convert?q=" + conversion + "&compact=y&callback=JSON_CALLBACK";

      return $http.jsonp(url)
        .success(function(response){
          console.log(response[conversion].val);

        });

    };

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
          var responseCollection = [];
          if (response.data && response.data.length > 0) {
            response.data.map(function(country) {
              if (country.Name.length < 24) {
                responseCollection.push(country);
              }
            });
          }
          return responseCollection;
        })
        .catch(function(error) {
          $log.warn('| bad get countries list', error);
          return;

        });
    };

    return svc;
  }
]);
