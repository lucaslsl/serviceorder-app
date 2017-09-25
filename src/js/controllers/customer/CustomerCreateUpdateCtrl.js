(function() {

  angular
    .module('ServiceOrder')
    .controller('CustomerCreateUpdateCtrl', ['$http','$rootScope','$scope', '$sessionStorage','toastr','$uibModalInstance', '$state', '$stateParams','refresher','customer', CustomerCreateUpdateCtrl]);

  function CustomerCreateUpdateCtrl($http, $rootScope, $scope, $sessionStorage, toastr,$uibModalInstance, $state, $stateParams,refresher,customer) {
    
    $scope.isUpdate = false;

    $scope.validationError = '';

    $scope.customer = {};

    if(customer!=undefined){
      $scope.isUpdate = true;
      $scope.customer = customer;
    }

    $scope.cancel = function(){
      $uibModalInstance.close();
    }


    $scope.confirm = function(form){
      if(form.$valid){
        var data = angular.copy($scope.customer);
        data.juridical = data.national_registration_number.length===14;
       
        if($scope.isUpdate){
          $http({
            method: 'PUT',
            data: _.omit(data,['id']),
            url: $rootScope.apiPathToResource({resource: {name: 'Customer', id: data.id}}),
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
            toastr.error('Não foi possivel atualizar o item');
          });
        }else{
          $http({
            method: 'POST',
            data: data,
            url: $rootScope.apiPathToResource({resource: {name: 'Customer'}}),
            // headers: {
            //   'Authorization': 'Bearer ' + $sessionStorage.auth.access_token
            // },
          })
          .then(function(response){
            $state.go('base.customer_show', {customerId: response.data.id}, {reload: true});
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