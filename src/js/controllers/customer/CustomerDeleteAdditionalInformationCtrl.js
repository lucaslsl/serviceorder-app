(function() {

  angular
    .module('ServiceOrder')
    .controller('CustomerDeleteAdditionalInformationCtrl', ['$http','$rootScope','$scope', '$sessionStorage','toastr','$uibModalInstance','refresher','info', CustomerDeleteAdditionalInformationCtrl]);

  function CustomerDeleteAdditionalInformationCtrl($http, $rootScope, $scope, $sessionStorage, toastr,$uibModalInstance,refresher,info) {
    
    $scope.itemName = 'Atributo';
    $scope.question = 'Tem certeza que deseja excluir o atributo "' + info.key + ': ' + info.value +  '".';

    $scope.cancel = function(){
      $uibModalInstance.close();
    }

    $scope.confirm = function(){
      $http({
        method: 'DELETE',
        data: "",
        url: $rootScope.apiPathToResource({
          resource: { name: 'Customer', id: info.parent_id, subResource: { name: 'AdditionalInformation', id: info.id} }
        }),
        // headers: {
        //   'Authorization': 'Bearer ' + $sessionStorage.auth.access_token
        // }
      })
      .then(function(response){
        refresher();
        $uibModalInstance.close();
        toastr.success('Item excluido com sucesso');
      })
      .catch(function(response){
        $uibModalInstance.close();
        toastr.error('Não foi possivel excluir o item');
      });
    }

  }

})();