(function() {

  angular
    .module('ServiceOrder')
    .controller('UserListCtrl', ['$http','$rootScope','$scope', '$sessionStorage','toastr','$uibModal', UserListCtrl]);

  function UserListCtrl($http, $rootScope, $scope, $sessionStorage, toastr,$uibModal) {

    $scope.loadingUsers = true;

    $scope.users = [];

    $scope.pagination = {
      currentPage: 1,
      totalCount: 0,
      perPage: 8,
      totalCount: 0,
      maxSize: 5
    };

    var listusers = function(page){
      $http({
        method: 'GET',
        data: "",
        url: $rootScope.apiPathToResource('Client'),
        // headers: {
        //   'Authorization': 'Bearer ' + $sessionStorage.auth.access_token
        // },
        params: {size: $scope.pagination.perPage, page: page - 1}
      })
      .then(function(response){
        $scope.pagination.totalCount = parseInt(response.headers('Total-Count'));
        $scope.users = response.data;
        $scope.loadingUsers = false;
      });
    }

    listusers(1);

    $scope.pageChanged = function(){
      listusers($scope.pagination.currentPage);
    }


    $scope.delete = function(user){
      $rootScope.modal = $uibModal.open({
        animation: true,
        templateUrl: 'templates/util/delete_modal.html',
        controller: 'UserDeleteCtrl',
        size: 'md',
        resolve: {
          user: function(){
            return user;
          },
          refresher: function(){
            return $scope.pageChanged;
          }
        }
      });
    }

    $scope.create = function(){
      $rootScope.modal = $uibModal.open({
        animation: true,
        templateUrl: 'templates/user/create_update.html',
        controller: 'UserCreateUpdateCtrl',
        size: 'md',
        resolve: {
          user: function(){
            return undefined;
          },
          refresher: function(){
            return $scope.pageChanged;
          }
        }
      });
    }

    $scope.edit = function(user){
      $rootScope.modal = $uibModal.open({
        animation: true,
        templateUrl: 'templates/user/create_update.html',
        controller: 'UserCreateUpdateCtrl',
        size: 'md',
        resolve: {
          user: function(){
            return user;
          },
          refresher: function(){
            return $scope.pageChanged;
          }
        }
      });
    }

  }

})();