(function() {
  'use strict';

  angular
      .module('ServiceOrder')
      .directive('viewerJs', viewerJs);

  viewerJs.$inject = [];
  
  function viewerJs() {
    return{
        scope: {
          id: "@id"
        },
        link: function(scope, elem, attrs, ctrl) {
          window.Viewer;
          var options = {
            // movable: false,
            // rotatable: false,
            // transition: false
          };
          scope.$watch('id', function(newVal, oldVal) {
            if(newVal!==undefined){
              var viewer = new Viewer(document.getElementById(newVal), undefined);
            }
          });
        }
    };
  }

})();