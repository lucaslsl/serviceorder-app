(function() {

  angular
    .module('ServiceOrder')
    .controller('BudgetDeleteCtrl', ['$http','$rootScope','$scope', '$sessionStorage','toastr','$uibModalInstance','refresher','budget', BudgetDeleteCtrl]);

  function BudgetDeleteCtrl($http, $rootScope, $scope, $sessionStorage, toastr,$uibModalInstance,refresher,budget) {
    
    $scope.itemName = 'Orçamento';
    $scope.question = 'Tem certeza que deseja excluir o orçamento de código "' + budget.id + '".';

    $scope.cancel = function(){
      $uibModalInstance.close();
    }

    $scope.confirm = function(){
      $http({
        method: 'DELETE',
        data: "",
        url: $rootScope.apiPathToResource({resource: {name: 'Budget', id: budget.id}}),
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