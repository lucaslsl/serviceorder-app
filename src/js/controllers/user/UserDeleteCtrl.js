(function() {

  angular
    .module('ServiceOrder')
    .controller('UserDeleteCtrl', ['$http','$rootScope','$scope','$sessionStorage','toastr','$uibModalInstance','refresher','user', UserDeleteCtrl]);

  function UserDeleteCtrl($http, $rootScope, $scope, $sessionStorage, toastr,$uibModalInstance,refresher,user) {
    
    $scope.itemName = 'Usuário';
    $scope.question = 'Tem certeza que deseja excluir o usuário "' + user.first_name + ' ' + user.last_name + '".';

    $scope.cancel = function(){
      $uibModalInstance.close();
    }

    $scope.confirm = function(){
      $http({
        method: 'DELETE',
        data: "",
        url:'/api/v1/users/' + user.id,
        headers: {
          'Authorization': 'Bearer ' + $sessionStorage.auth.access_token
        },
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