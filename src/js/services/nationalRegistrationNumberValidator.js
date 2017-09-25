angular.module('ServiceOrder').factory('nationalRegistrationNumberValidator', function () {
  return {
    name: 'nationalRegistrationNumberValidator', 
    validate: function (value, arguments) {
      return value !== undefined && (value.length===11 || value.length===14);
    }
  };
});