(function() {

  angular
    .module('ServiceOrder')
    .controller('BillableItemCreateUpdateCtrl', ['$http','$rootScope','$scope', '$sessionStorage','toastr','$uibModalInstance','refresher','billableItem', BillableItemCreateUpdateCtrl]);

  function BillableItemCreateUpdateCtrl($http, $rootScope, $scope, $sessionStorage, toastr,$uibModalInstance,refresher,billableItem) {
    
    $scope.isUpdate = false;

    $scope.maskDecimals = 2;


    $scope.validationError = '';

    $scope.billableItem = billableItem;

    if(billableItem!==undefined){
      $scope.isUpdate = true;
    }


    $scope.cancel = function(){
      $uibModalInstance.close();
    }


    $scope.confirm = function(form){
      if(form.$valid){
        if($scope.isUpdate){
          $http({
            method: 'PUT',
            data: _.omit(billableItem,['id']),
            url: $rootScope.apiPathToResource({resource: {name: 'BillableItem', id: billableItem.id}}),
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
            data: $scope.billableItem,
            url: $rootScope.apiPathToResource({resource: {name: 'BillableItem'}}),
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