(function() {

  angular
    .module('ServiceOrder')
    .controller('BudgetDeleteItemCtrl', ['$http','$rootScope','$scope', '$sessionStorage','toastr','$uibModalInstance','refresher','item', BudgetDeleteItemCtrl]);

  function BudgetDeleteItemCtrl($http, $rootScope, $scope, $sessionStorage, toastr,$uibModalInstance,refresher,item) {
    
    $scope.itemName = 'Orçamento';
    $scope.question = 'Tem certeza que deseja excluir o item "' + item._expanded.billable_item.name + '".';

    $scope.cancel = function(){
      $uibModalInstance.close();
    }

    $scope.confirm = function(){
      $http({
        method: 'DELETE',
        data: "",
        url: $rootScope.apiPathToResource({
          resource: { name: 'Budget', id: item.budget_id, subResource: { name: 'BudgetItem', id: item.id} }
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