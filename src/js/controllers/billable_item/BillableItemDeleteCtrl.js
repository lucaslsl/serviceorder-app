(function() {

  angular
    .module('ServiceOrder')
    .controller('BillableItemDeleteCtrl', ['$http','$rootScope','$scope', '$sessionStorage','toastr','$uibModalInstance','refresher','billableItem', BillableItemDeleteCtrl]);

  function BillableItemDeleteCtrl($http, $rootScope, $scope, $sessionStorage, toastr,$uibModalInstance,refresher,billableItem) {
    
    $scope.itemName = 'Fabricante';
    $scope.question = 'Tem certeza que deseja excluir o item de cobrança "' + billableItem.name + '".';

    $scope.cancel = function(){
      $uibModalInstance.close();
    }

    $scope.confirm = function(){
      $http({
        method: 'DELETE',
        data: "",
        url: $rootScope.apiPathToResource({resource: {name: 'BillableItem', id: billableItem.id}}),
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