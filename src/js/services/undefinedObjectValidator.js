// (function() {
//   'use strict';

//   angular
//       .module('VehicleRental')
//       .factory('undefinedObjectValidator', undefinedObjectValidator);

//   function undefinedObjectValidator() {
//     return {
//       name: 'undefinedObjectValidator', 
//       validate: function (value, arguments) {
//         return value === undefined || value === null;
//       }
//     };
//   }

// })();


    angular
      .module('ServiceOrder')
      .factory('undefinedObjectValidator', function () {
    return {
      name: 'undefinedObjectValidator', 
      validate: function (value, arguments) {
        // console.log(value);

        return value !== undefined;
      }
    };
  });
