(function() {

  angular
    .module('ServiceOrder')
    .controller('CustomerDeleteCtrl', ['$http','$rootScope','$scope', '$sessionStorage','toastr','$uibModalInstance','refresher','customer', CustomerDeleteCtrl]);

  function CustomerDeleteCtrl($http, $rootScope, $scope, $sessionStorage, toastr,$uibModalInstance,refresher,customer) {
    
    $scope.itemName = 'Cliente';
    $scope.question = 'Tem certeza que deseja excluir o cliente "' + customer.name + '".';

    $scope.cancel = function(){
      $uibModalInstance.close();
    }

    $scope.confirm = function(){
      $http({
        method: 'DELETE',
        data: "",
        url: $rootScope.apiPathToResource({resource: {name: 'Customer', id: customer.id}}),
        // headers: {
        //   'Authorization': 'Bearer ' + $sessionStorage.auth.access_token
        // },
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