(function() {

  angular
    .module('ServiceOrder')
    .controller('CustomerCreateUpdateAddressCtrl', ['$http','$rootScope','$scope', '$sessionStorage','toastr','$uibModalInstance','refresher','address', CustomerCreateUpdateAddressCtrl]);

  function CustomerCreateUpdateAddressCtrl($http, $rootScope, $scope, $sessionStorage, toastr,$uibModalInstance,refresher,address) {
    
    $scope.isUpdate = false;


    $scope.validationError = '';

    $scope.address = address;

    if(address.id!==undefined){
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
            data: _.omit(address,['id']),
            url: $rootScope.apiPathToResource({
              resource: { name: 'Customer', id: address.customer_id, subResource: { name: 'Address', id: address.id} }
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
            data: $scope.address,
            url: $rootScope.apiPathToResource({
              resource: { name: 'Customer', id: address.customer_id, subResource: { name: 'Address'} }
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