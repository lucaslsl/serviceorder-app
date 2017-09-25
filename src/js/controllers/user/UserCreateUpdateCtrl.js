(function() {

  angular
    .module('ServiceOrder')
    .controller('UserCreateUpdateCtrl', ['$http','$rootScope','$scope','$sessionStorage','toastr','$uibModalInstance','refresher','user', UserCreateUpdateCtrl]);

  function UserCreateUpdateCtrl($http, $rootScope, $scope, $sessionStorage, toastr,$uibModalInstance,refresher,user) {
    
    $scope.isUpdate = false;

    $scope.validationError = '';

    $scope.user = {};

    if(user!==undefined){
      $scope.isUpdate = true;
      $scope.user = angular.copy(user);
      $scope.user.password = '';
    }

    $scope.cancel = function(){
      $uibModalInstance.close();
    }


    $scope.confirm = function(form){
      if(form.$valid){
        if($scope.isUpdate){
          $http({
            method: 'PATCH',
            data: _.omit($scope.user,['id']),
            url:'/api/v1/users/' + $scope.user.id,
            headers: {
              'Authorization': 'Bearer ' + $sessionStorage.auth.access_token
            },
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
            data: $scope.user,
            url:'/api/v1/users',
            headers: {
              'Authorization': 'Bearer ' + $sessionStorage.auth.access_token
            },
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