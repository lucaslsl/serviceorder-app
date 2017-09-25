(function() {

  angular
    .module('ServiceOrder')
    .controller('BillableItemListCtrl', ['$http','$rootScope','$scope', '$sessionStorage','toastr','$uibModal', BillableItemListCtrl]);

  function BillableItemListCtrl($http, $rootScope, $scope, $sessionStorage, toastr,$uibModal) {

    $scope.loadingBillableItems = true;

    $scope.billableItems = [];

    $scope.pagination = {
      currentPage: 1,
      totalCount: 0,
      perPage: 8,
      totalCount: 0,
      maxSize: 5
    };

    var listBillableItems = function(page){
      $http({
        method: 'GET',
        data: "",
        url: $rootScope.apiPathToResource({resource: {name: 'BillableItem'}}),
        // headers: {
        //   'Authorization': 'Bearer ' + $sessionStorage.auth.access_token
        // },
        params: {deleted: false, size: $scope.pagination.perPage, page: (page-1)}
      })
      .then(function(response){
        $scope.pagination.totalCount = parseInt(response.headers('Total-Count'));
        $scope.billableItems = response.data;
        $scope.loadingBillableItems = false;
      });
    }

    listBillableItems(1);

    $scope.pageChanged = function(){
      listBillableItems($scope.pagination.currentPage);
    }


    $scope.delete = function(billableItem){
      $rootScope.modal = $uibModal.open({
        animation: true,
        templateUrl: 'templates/util/delete_modal.html',
        controller: 'BillableItemDeleteCtrl',
        size: 'md',
        resolve: {
          billableItem: function(){
            return billableItem;
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
        templateUrl: 'templates/billable_item/create_update.html',
        controller: 'BillableItemCreateUpdateCtrl',
        size: 'md',
        resolve: {
          billableItem: function(){
            return undefined;
          },
          refresher: function(){
            return $scope.pageChanged;
          }
        }
      });
    }

    $scope.edit = function(billableItem){
      $rootScope.modal = $uibModal.open({
        animation: true,
        templateUrl: 'templates/billable_item/create_update.html',
        controller: 'BillableItemCreateUpdateCtrl',
        size: 'md',
        resolve: {
          billableItem: function(){
            return billableItem;
          },
          refresher: function(){
            return $scope.pageChanged;
          }
        }
      });
    }

  }

})();