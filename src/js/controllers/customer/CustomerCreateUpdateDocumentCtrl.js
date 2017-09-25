(function() {

  angular
    .module('ServiceOrder')
    .controller('CustomerCreateUpdateDocumentCtrl', ['$http','$rootScope','$scope', '$sessionStorage','toastr','$uibModalInstance','refresher','doc', CustomerCreateUpdateDocumentCtrl]);

  function CustomerCreateUpdateDocumentCtrl($http, $rootScope, $scope, $sessionStorage, toastr,$uibModalInstance,refresher,doc) {
    
    $scope.isUpdate = false;


    $scope.validationError = '';

    $scope.doc = doc;

    if(doc.id!==undefined){
      $scope.isUpdate = true;
    }

    $scope.openedDatePickers = {};
    $scope.openDatePicker = function(key, $event){
      $event.preventDefault();
      $event.stopPropagation();
      if($scope.openedDatePickers === undefined) $scope.openedDatePickers = {};
      angular.forEach($scope.openedDatePickers, function(op, i){
        op = false;
      });
      $scope.openedDatePickers[key] = true;
    };
    
    if(!$scope.isUpdate){
      $scope.doc.issue_date = new Date();
    }else{
      $scope.doc.issue_date = moment($scope.doc.issue_date).toDate();
    }


    $scope.cancel = function(){
      $uibModalInstance.close();
    }


    $scope.confirm = function(form){
      if(form.$valid){
        var data = angular.copy($scope.doc);
        data.issue_date = moment(data.issue_date).format('YYYY-MM-DD');
        if($scope.isUpdate){
          $http({
            method: 'PUT',
            data: _.omit(data,['id']),
            url:'/api/v1/customers/'+ data.customer_id +'/documents/' + data.id,
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
            data: data,
            url:'/api/v1/customers/'+ doc.parent_id +'/documents',
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