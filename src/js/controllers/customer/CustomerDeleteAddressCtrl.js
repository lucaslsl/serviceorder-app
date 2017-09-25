(function() {

  angular
    .module('ServiceOrder')
    .controller('CustomerDeleteAddressCtrl', ['$http','$rootScope','$scope', '$sessionStorage','toastr','$uibModalInstance','refresher','address', CustomerDeleteAddressCtrl]);

  function CustomerDeleteAddressCtrl($http, $rootScope, $scope, $sessionStorage, toastr,$uibModalInstance,refresher,address) {
    
    $scope.itemName = 'Endereço';
    $scope.question = 'Tem certeza que deseja excluir o endereço "' + address.formatted_address + '".';

    $scope.cancel = function(){
      $uibModalInstance.close();
    }

    $scope.confirm = function(){
      $http({
        method: 'DELETE',
        data: "",
        url: $rootScope.apiPathToResource({
          resource: { name: 'Customer', id: address.customer_id, subResource: { name: 'Address', id: address.id} }
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