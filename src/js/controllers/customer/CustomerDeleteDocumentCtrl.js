(function() {

  angular
    .module('ServiceOrder')
    .controller('CustomerDeleteDocumentCtrl', ['$http','$rootScope','$scope', '$sessionStorage','toastr','$uibModalInstance','refresher','doc', CustomerDeleteDocumentCtrl]);

  function CustomerDeleteDocumentCtrl($http, $rootScope, $scope, $sessionStorage, toastr,$uibModalInstance,refresher,doc) {
    
    $scope.itemName = 'Documento';
    $scope.question = 'Tem certeza que deseja excluir o documento "' + doc.name + '".';

    $scope.cancel = function(){
      $uibModalInstance.close();
    }

    $scope.confirm = function(){
      $http({
        method: 'DELETE',
        data: "",
        url:'/api/v1/customers/' + doc.customer_id + '/documents/' + doc.id,
        // headers: {
        //   'Authorization': 'Bearer ' + $sessionStorage.auth.access_token
        // }
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