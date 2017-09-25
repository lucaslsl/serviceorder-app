(function() {

  angular
    .module('ServiceOrder')
    .controller('OrderListCtrl', ['$http','$rootScope','$scope', '$sessionStorage','toastr','$uibModal', '$state', '$stateParams', OrderListCtrl]);

  function OrderListCtrl($http, $rootScope, $scope, $sessionStorage, toastr,$uibModal, $state, $stateParams) {

    $scope.ordersShowOne = false;

    if($stateParams.orderId){
      $scope.ordersShowOne = true;
    }

    $scope.loadingOrders = true;

    $scope.orders = [];

    $scope.searchAttrs = {
      query: '',
      type: 'NATIONAL_REGISTRATION_NUMBER'
    };

    $scope.pagination = {
      currentPage: 1,
      totalCount: 0,
      perPage: 3,
      totalCount: 0,
      maxSize: 5
    };

    var retriveCustomerPromise = function(customerId){
      return $http({
        method: 'GET',
        data: "",
        url: $rootScope.apiPathToResource({resource: {name: 'Customer', id: customerId}}),
        // headers: {
        //   'Authorization': 'Bearer ' + $sessionStorage.auth.access_token
        // },
      });
    };

    var listOrders = function(page){
      var requestDef = {
        method: 'GET',
        data: "",
        url: $rootScope.apiPathToResource({resource: {name: 'Order'}}),
        // headers: {
        //   'Authorization': 'Bearer ' + $sessionStorage.auth.access_token
        // },
        params: {deleted: false, size: $scope.pagination.perPage, page: (page-1)}
      };

      if($scope.ordersShowOne){
        requestDef.url = $rootScope.apiPathToResource({resource: {name: 'Order', id: $stateParams.orderId}});
        requestDef.params = {};
      }

      $http(requestDef)
      .then(function(response){
        if($scope.ordersShowOne){
          $scope.pagination.totalCount = 1;
          $scope.orders = [response.data];
        }else{
          $scope.pagination.totalCount = parseInt(response.headers('Total-Count'));
          $scope.orders = response.data;
        }

        var ordersCustomersPromises = [];

        _.each($scope.orders, function(order){
          ordersCustomersPromises.push(retriveCustomerPromise(order.customer_id));
        });

        Promise.all([Promise.all(ordersCustomersPromises)]).then(function(promisesResolved) {
          $scope.orders = _.map($scope.orders, function(order){
            var c = order;
            c.total = c.subtotal * (1 - c.discount);
            c._expanded = {};
            c._expanded.customer = null;
            return c;
          });

          var orderItemsBillableItemsPromises = [];

          for(var i=0; i<$scope.orders.length; i++){
            $scope.orders[i]._expanded.customer = promisesResolved[0][i].data;
          }
          
          $scope.loadingOrders = false;
        });

      });
    }

    listOrders(1);


    var searchOrders = function(page){

      $http({
        method: 'GET',
        data: "",
        url: $rootScope.apiPathToResource({resource: {name: 'Order'}}),
        // headers: {
        //   'Authorization': 'Bearer ' + $sessionStorage.auth.access_token
        // },
        params: {
          size: $scope.pagination.perPage,
          page: (page-1),
          deleted: false,
          national_registration_number: $scope.searchAttrs.query ? $scope.searchAttrs.query : "x"
        }
      })
      .then(function(response){
        $scope.pagination.totalCount = parseInt(response.headers('Total-Count'));
        $scope.orders = response.data;
        $scope.loadingOrders = false;
      });
    }

    $scope.search = function(){
      if($scope.searchAttrs.query===''){
        listOrders(1);
      }else{
        searchOrders(1);
      }
    }
    
    $scope.pageChanged = function(){
      if($scope.searchAttrs.query===''){
        listOrders($scope.pagination.currentPage);
      }else{
        searchOrders($scope.pagination.currentPage);
      }
    }


    $scope.delete = function(customer){
      $rootScope.modal = $uibModal.open({
        animation: true,
        templateUrl: 'templates/util/delete_modal.html',
        controller: 'CustomerDeleteCtrl',
        size: 'md',
        resolve: {
          customer: function(){
            return customer;
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
        templateUrl: 'templates/customer/create_update.html',
        controller: 'CustomerCreateUpdateCtrl',
        size: 'md',
        resolve: {
          customer: function(){
            return undefined;
          },
          refresher: function(){
            return $scope.pageChanged;
          }
        }
      });
    }

    $scope.edit = function(customer){
      $rootScope.modal = $uibModal.open({
        animation: true,
        templateUrl: 'templates/customer/create_update.html',
        controller: 'CustomerCreateUpdateCtrl',
        size: 'lg',
        resolve: {
          customer: function(){
            return customer;
          },
          refresher: function(){
            return $scope.pageChanged;
          }
        }
      });
    }

    $scope.createAdditionalInformation = function(customer){
      $rootScope.modal = $uibModal.open({
        animation: true,
        templateUrl: 'templates/util/create_update_additional_information.html',
        controller: 'CustomerCreateUpdateAdditionalInformationCtrl',
        size: 'md',
        resolve: {
          info: function(){
            return { customer_id: customer.id };
          },
          refresher: function(){
            return $scope.pageChanged;
          }
        }
      });
    }

    $scope.editAdditionalInformation = function(info){
      $rootScope.modal = $uibModal.open({
        animation: true,
        templateUrl: 'templates/util/create_update_additional_information.html',
        controller: 'CustomerCreateUpdateAdditionalInformationCtrl',
        size: 'md',
        resolve: {
          info: function(){
            return info;
          },
          refresher: function(){
            return $scope.pageChanged;
          }
        }
      });
    }

    $scope.deleteAdditionalInformation = function(info){
      $rootScope.modal = $uibModal.open({
        animation: true,
        templateUrl: 'templates/util/delete_modal.html',
        controller: 'CustomerDeleteAdditionalInformationCtrl',
        size: 'md',
        resolve: {
          info: function(){
            return info;
          },
          refresher: function(){
            return $scope.pageChanged;
          }
        }
      });
    }

    $scope.createAddress = function(customer){
      $rootScope.modal = $uibModal.open({
        animation: true,
        templateUrl: 'templates/customer/create_update_address.html',
        controller: 'CustomerCreateUpdateAddressCtrl',
        size: 'md',
        resolve: {
          address: function(){
            return { customer_id: customer.id };
          },
          refresher: function(){
            return $scope.pageChanged;
          }
        }
      });
    }

    $scope.editAddress = function(address){
      $rootScope.modal = $uibModal.open({
        animation: true,
        templateUrl: 'templates/customer/create_update_address.html',
        controller: 'CustomerCreateUpdateAddressCtrl',
        size: 'md',
        resolve: {
          address: function(){
            return address;
          },
          refresher: function(){
            return $scope.pageChanged;
          }
        }
      });
    }

    $scope.deleteAddress = function(address){
      $rootScope.modal = $uibModal.open({
        animation: true,
        templateUrl: 'templates/util/delete_modal.html',
        controller: 'CustomerDeleteAddressCtrl',
        size: 'md',
        resolve: {
          address: function(){
            return address;
          },
          refresher: function(){
            return $scope.pageChanged;
          }
        }
      });
    }



  }

})();