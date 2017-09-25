(function() {

  angular
    .module('ServiceOrder')
    .controller('LoginCtrl', ['$http','$rootScope','$scope','toastr','$state', '$sessionStorage', LoginCtrl]);

  function LoginCtrl($http, $rootScope, $scope, toastr, $state, $sessionStorage) {

    $scope.credentials = {
      username: '',
      password: ''
    };

    $scope.signin = function(){
      if($scope.credentials.username.length>0 && $scope.credentials.password.length>0){
        $http({
          method: 'POST',
          data: $scope.credentials,
          url:'/api/v1/auth'
        })
        .then(function(response){
          $sessionStorage.auth = {
            access_token: response.data.access_token
          }
          $http({
            method: 'GET',
            data: '',
            url:'/api/v1/users/me',
            headers: {
              'Authorization': 'Bearer ' + $sessionStorage.auth.access_token
            }
          })
          .then(function(response){
            $sessionStorage.user = response.data;
            $state.go('base');
          })
        })
        .catch(function(response){
          toastr.error('Credenciais inválidas!');
        });
      }
    }

  }

})();