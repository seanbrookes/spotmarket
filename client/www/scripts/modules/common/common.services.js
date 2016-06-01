Common.service('CommonServices', [
  function() {
    var svc = this;
    console.log('|');
    console.log('|');
    console.log('|  COMMON SERVICE - CommonServices');
    console.log('|');
    console.log('|');
    svc.isValidEmail = function(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    };

    return svc;
  }
]);
