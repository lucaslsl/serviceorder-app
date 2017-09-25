(function() {

  angular
    .module('ServiceOrder')
    .controller('BudgetOrderCtrl', ['$http','$rootScope','$scope', '$sessionStorage','toastr','$uibModalInstance','refresher','budget', BudgetOrderCtrl]);

  function BudgetOrderCtrl($http, $rootScope, $scope, $sessionStorage, toastr,$uibModalInstance,refresher,budget) {
    
    $scope.isUpdate = false;


    $scope.validationError = '';

    $scope.order = {budget_id: budget.id, customer_id: budget.customer_id, subtotal: budget.total, discount: 0};

    $scope.totalCost = $scope.order.subtotal * (1 - $scope.order.discount);

    $scope.totalCostChanged = function(){
      if($scope.order.subtotal){
        $scope.totalCost = $scope.order.subtotal * (1 - $scope.order.discount);
      }
    }

    $scope.cancel = function(){
      $uibModalInstance.close();
    }


    $scope.confirm = function(form){
      if(form.$valid){
        $http({
          method: 'POST',
          data: $scope.order,
          url: $rootScope.apiPathToResource({
            resource: { name: 'Order'}
          }),
          // headers: {
          //   'Authorization': 'Bearer ' + $sessionStorage.auth.access_token
          // },
        })
        .then(function(response){
          refresher();
          $uibModalInstance.close();
          toastr.success('Ordem de serviço gerada com sucesso');
        })
        .catch(function(response){
          $uibModalInstance.close();
          toastr.error('Não foi possivel gerar a ordem de serviço');
        });
        
      }
    }

  }

})();