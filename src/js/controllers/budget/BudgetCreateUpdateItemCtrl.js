(function() {

  angular
    .module('ServiceOrder')
    .controller('BudgetCreateUpdateItemCtrl', ['$http','$rootScope','$scope', '$sessionStorage','toastr','$uibModalInstance','refresher','item', BudgetCreateUpdateItemCtrl]);

  function BudgetCreateUpdateItemCtrl($http, $rootScope, $scope, $sessionStorage, toastr,$uibModalInstance,refresher,item) {
    
    $scope.isUpdate = false;


    $scope.validationError = '';

    $scope.item = item;

    if(item.id!==undefined){
      $scope.isUpdate = true;
      $scope.totalCost = $scope.item.price * $scope.item.quantity * (1 - $scope.item.discount);
    }else{
      $scope.item.quantity = 1;
      $scope.item.discount = 0;
      $scope.totalCost = 0;
    }

    $scope.billable_items = [];

    $http({
      method: 'GET',
      data: "",
      url: $rootScope.apiPathToResource({resource: {name: 'BillableItem'}}),
      // headers: {
      //   'Authorization': 'Bearer ' + $sessionStorage.auth.access_token
      // },
      params: {deleted: false, size: 1, page: 0}
    })
    .then(function(response){
      var totalCount = parseInt(response.headers('Total-Count'));
      var numberOfPages = totalCount > 25 ? Math.ceil(totalCount/25) : 1;
      var allBillableItems = []
      for(var i=0;i<numberOfPages;i++){
        allBillableItems.push($http({
          method: 'GET',
          data: "",
          url: $rootScope.apiPathToResource({resource: {name: 'BillableItem'}}),
          // headers: {
          //   'Authorization': 'Bearer ' + $sessionStorage.auth.access_token
          // },
          params: {deleted: false, size: 25, page: i}
        }));
      }
      Promise.all(allBillableItems).then(function(data){
        $scope.billable_items = [];
        _.each(data,function(res){
          $scope.billable_items = $scope.billable_items.concat(res.data);
        });
      });
    });


    $scope.setBillableItemPrice = function(billableItemId){
      var found = _.find($scope.billable_items, function(bi){
        return bi.id === billableItemId;
      });
      if(found){
        $scope.item.price = found.price;
        $scope.totalCostChanged();
      }
    }

    $scope.totalCostChanged = function(){
      if($scope.item.price){
        $scope.totalCost = $scope.item.price * $scope.item.quantity * (1 - $scope.item.discount);
      }
    }


    $scope.cancel = function(){
      $uibModalInstance.close();
    }


    $scope.confirm = function(form){
      if(form.$valid){
        if($scope.isUpdate){
          $http({
            method: 'PUT',
            data: _.omit(item,['id']),
            url: $rootScope.apiPathToResource({
              resource: { name: 'Budget', id: item.budget_id, subResource: { name: 'BudgetItem', id: item.id} }
            }),
            // headers: {
            //   'Authorization': 'Bearer ' + $sessionStorage.auth.access_token
            // },
          })
          .then(function(response){
            refresher();
            $uibModalInstance.close();
            toastr.success('Item atualizado com sucesso');
          })
          .catch(function(response){
            $uibModalInstance.close();
            toastr.error('Não foi possivel atualizar o item');
          });
        }else{
          $http({
            method: 'POST',
            data: $scope.item,
            url: $rootScope.apiPathToResource({
              resource: { name: 'Budget', id: item.budget_id, subResource: { name: 'BudgetItem'} }
            }),
            // headers: {
            //   'Authorization': 'Bearer ' + $sessionStorage.auth.access_token
            // },
          })
          .then(function(response){
            refresher();
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