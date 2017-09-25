(function() {

  angular
    .module('ServiceOrder')
    .controller('CustomerCreateUpdateAdditionalInformationCtrl', ['$http','$rootScope','$scope', '$sessionStorage','toastr','$uibModalInstance','refresher','info', CustomerCreateUpdateAdditionalInformationCtrl]);

  function CustomerCreateUpdateAdditionalInformationCtrl($http, $rootScope, $scope, $sessionStorage, toastr,$uibModalInstance,refresher,info) {
    
    $scope.isUpdate = false;


    $scope.validationError = '';

    $scope.info = info;

    if(info.id!==undefined){
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
            data: _.omit(info,['id']),
            url: $rootScope.apiPathToResource({
              resource: { name: 'Customer', id: info.parent_id, subResource: { name: 'AdditionalInformation', id: info.id} }
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
            data: $scope.info,
            url: $rootScope.apiPathToResource({
              resource: { name: 'Customer', id: info.customer_id, subResource: { name: 'AdditionalInformation'} }
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