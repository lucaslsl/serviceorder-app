(function() {

  angular
    .module('ServiceOrder')
    .controller('CustomerListCtrl', ['$http','$rootScope','$scope', '$sessionStorage','toastr','$uibModal', '$state', '$stateParams', CustomerListCtrl]);

  function CustomerListCtrl($http, $rootScope, $scope, $sessionStorage, toastr,$uibModal, $state, $stateParams) {

    $scope.customersShowOne = false;

    if($stateParams.customerId){
      $scope.customersShowOne = true;
    }

    $scope.loadingCustomers = true;

    $scope.customers = [];

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

    var retriveCustomerAddressesPromise = function(customerId){
      return $http({
        method: 'GET',
        data: "",
        url: $rootScope.apiPathToResource({
          resource: { name: 'Customer', id: customerId, subResource: { name: 'Address'} }
        }),
        // headers: {
        //   'Authorization': 'Bearer ' + $sessionStorage.auth.access_token
        // },
        params: {size: 25, page: 0}
      });
    };

    var retriveCustomerInfosPromise = function(customerId){
      return $http({
        method: 'GET',
        data: "",
        url: $rootScope.apiPathToResource({
          resource: { name: 'Customer', id: customerId, subResource: { name: 'AdditionalInformation'} }
        }),
        // headers: {
        //   'Authorization': 'Bearer ' + $sessionStorage.auth.access_token
        // },
        params: {size: 25, page: 0}
      });
    };

    var listCustomers = function(page){
      var requestDef = {
        method: 'GET',
        data: "",
        url: $rootScope.apiPathToResource({resource: {name: 'Customer'}}),
        // headers: {
        //   'Authorization': 'Bearer ' + $sessionStorage.auth.access_token
        // },
        params: {deleted: false, size: $scope.pagination.perPage, page: (page-1)}
      };
      if($scope.customersShowOne){
        requestDef.url = $rootScope.apiPathToResource({resource: {name: 'Customer', id: $stateParams.customerId}});
        requestDef.params = {};
      }

      $http(requestDef)
      .then(function(response){

        if($scope.customersShowOne){
          $scope.pagination.totalCount = 0;
          $scope.customers = [response.data];
        }else{
          $scope.pagination.totalCount = parseInt(response.headers('Total-Count'));
          $scope.customers = response.data;
        }

        var customersAddressesPromises = [];
        var customersInfosPromises = [];

        if($scope.customersShowOne){
          _.each($scope.customers, function(customer){
            customersAddressesPromises.push(retriveCustomerAddressesPromise(customer.id));
            customersInfosPromises.push(retriveCustomerInfosPromise(customer.id));
          });

          Promise.all([Promise.all(customersAddressesPromises), Promise.all(customersInfosPromises)]).then(function(promisesResolved) {
            $scope.customers = _.map($scope.customers, function(customer){
              var c = customer;
              c._embedded = {};
              c._embedded.addresses = [];
              c._embedded.infos = [];
              return c;
            });

            for(var i=0; i<$scope.customers.length; i++){
              $scope.customers[i]._embedded.addresses = promisesResolved[0][i].data;
              $scope.customers[i]._embedded.infos = promisesResolved[1][i].data;
            }
            $scope.loadingCustomers = false;
          });
        }else{
          $scope.loadingCustomers = false;
        }

      });
    }

    listCustomers(1);


    var searchCustomers = function(page){

      $http({
        method: 'GET',
        data: "",
        url: $rootScope.apiPathToResource({resource: {name: 'Customer'}}),
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
        $scope.customers = response.data;
        $scope.loadingCustomers = false;
      });
    }

    $scope.search = function(){
      if($scope.searchAttrs.query===''){
        listCustomers(1);
      }else{
        searchCustomers(1);
      }
    }
    
    $scope.pageChanged = function(){
      if($scope.searchAttrs.query===''){
        listCustomers($scope.pagination.currentPage);
      }else{
        searchCustomers($scope.pagination.currentPage);
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
            return function(){$state.go('base.customers', {}, { reload: true });};
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
            return function(){$state.go('base.customer_show', {customerId: customer.id}, {reload: true});};
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
            return function(){$state.go('base.customer_show', {customerId: customer.id}, {reload: true});};
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
            return function(){$state.go('base.customer_show', {customerId: info.parent_id}, {reload: true});};
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
            return function(){$state.go('base.customer_show', {customerId: info.parent_id}, {reload: true});};
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
            return function(){$state.go('base.customer_show', {customerId: customer.id}, {reload: true});};
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
            return function(){$state.go('base.customer_show', {customerId: address.customer_id}, {reload: true});};
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
            return function(){$state.go('base.customer_show', {customerId: address.customer_id}, {reload: true});};
          }
        }
      });
    }



  }

})();