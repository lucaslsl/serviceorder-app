(function() {

  angular
    .module('ServiceOrder')
    .controller('BudgetCreateUpdateCtrl', ['$http','$rootScope','$scope', '$sessionStorage','toastr','$uibModalInstance', '$state','refresher','budget', BudgetCreateUpdateCtrl]);

  function BudgetCreateUpdateCtrl($http, $rootScope, $scope, $sessionStorage, toastr,$uibModalInstance, $state,refresher,budget) {
    
    $scope.isUpdate = false;

    $scope.validationError = '';

    $scope.budget = {};

    if(budget!=undefined){
      $scope.isUpdate = true;
      $scope.budget = budget;
    }

    $scope.customers = [];

    $http({
      method: 'GET',
      data: "",
      url: $rootScope.apiPathToResource({resource: {name: 'Customer'}}),
      // headers: {
      //   'Authorization': 'Bearer ' + $sessionStorage.auth.access_token
      // },
      params: {deleted: false, size: 1, page: 0}
    })
    .then(function(response){
      var totalCount = parseInt(response.headers('Total-Count'));
      var numberOfPages = totalCount > 25 ? Math.ceil(totalCount/25) : 1;
      var allCustomers = []
      for(var i=0;i<numberOfPages;i++){
        allCustomers.push($http({
          method: 'GET',
          data: "",
          url: $rootScope.apiPathToResource({resource: {name: 'Customer'}}),
          // headers: {
          //   'Authorization': 'Bearer ' + $sessionStorage.auth.access_token
          // },
          params: {deleted: false, size: 25, page: i}
        }));
      }
      Promise.all(allCustomers).then(function(data){
        $scope.customers = [];
        _.each(data,function(res){
          $scope.customers = $scope.customers.concat(res.data);
        });
        _.each($scope.customers, function(c, i){
          if($scope.isUpdate && c.id === $scope.budget.customer_id){
            $scope.budget.customer = $scope.customers[i]
          } 
        });
      });
    });

    $scope.customerSelected = function(){
      if($scope.budget.customer){
        $scope.budget.customer_id = $scope.budget.customer.id;
      }
    }

    $scope.cancel = function(){
      $uibModalInstance.close();
    }


    $scope.confirm = function(form){
      if(form.$valid){
        var data = angular.copy($scope.budget);
        if($scope.isUpdate){
          $http({
            method: 'PUT',
            data: _.omit(data,['id']),
            url: $rootScope.apiPathToResource({resource: {name: 'Budget', id: data.id}}),
            // headers: {
            //   'Authorization': 'Bearer ' + $sessionStorage.auth.access_token
            // },
          })
          .then(function(response){
            $state.go('base.budget_show', {budgetId: data.id}, {reload: true});
            $uibModalInstance.close();
            toastr.success('Item atualizado com sucesso');
          })
          .catch(function(response){
            toastr.error('Não foi possivel atualizar o item');
          });
        }else{
          $http({
            method: 'POST',
            data: data,
            url: $rootScope.apiPathToResource({resource: {name: 'Budget'}}),
            // headers: {
            //   'Authorization': 'Bearer ' + $sessionStorage.auth.access_token
            // },
          })
          .then(function(response){
            $state.go('base.budget_show', {budgetId: response.data.id}, {reload: true});
            $uibModalInstance.close();
            toastr.success('Item salvo com sucesso');
          })
          .catch(function(response){
            $uibModalInstance.close();
            toastr.error('Não foi possivel salvar o item');
          });
        }
        
      }
    }

  }

})();