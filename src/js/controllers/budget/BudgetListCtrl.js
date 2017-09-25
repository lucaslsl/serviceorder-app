(function() {

  angular
    .module('ServiceOrder')
    .controller('BudgetListCtrl', ['$http','$rootScope','$scope', '$sessionStorage','toastr','$uibModal', '$state', '$stateParams', BudgetListCtrl]);

  function BudgetListCtrl($http, $rootScope, $scope, $sessionStorage, toastr, $uibModal, $state, $stateParams) {

    $scope.loadingBudgets = true;

    $scope.budgets = [];

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

    $scope.budgetsShowOne = false;

    if($stateParams.budgetId){
      $scope.budgetsShowOne = true;
    }

    
    var retriveBudgetItemsPromise = function(budgetId){
      return $http({
        method: 'GET',
        data: "",
        url: $rootScope.apiPathToResource({
          resource: { name: 'Budget', id: budgetId, subResource: { name: 'BudgetItem'} }
        }),
        // headers: {
        //   'Authorization': 'Bearer ' + $sessionStorage.auth.access_token
        // },
        params: {size: 50, page: 0}
      });
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

    var retriveOrder = function(budgetId){
      return $http({
        method: 'GET',
        data: "",
        url: $rootScope.apiPathToResource({resource: {name: 'Order'}}),
        // headers: {
        //   'Authorization': 'Bearer ' + $sessionStorage.auth.access_token
        // },
        params: {budget_id: budgetId}
      });
    };

    var retriveBillableItemPromise = function(billableItemId){
      return $http({
        method: 'GET',
        data: "",
        url: $rootScope.apiPathToResource({resource: {name: 'BillableItem', id: billableItemId}}),
        // headers: {
        //   'Authorization': 'Bearer ' + $sessionStorage.auth.access_token
        // },
      });
    };


    var listBudgets = function(page){
      var requestDef = {
        method: 'GET',
        data: "",
        url: $rootScope.apiPathToResource({ resource: { name: 'Budget' } }),
        // headers: {
        //   'Authorization': 'Bearer ' + $sessionStorage.auth.access_token
        // },
        params: {deleted: false, size: $scope.pagination.perPage, page: (page-1)}
      };

      if($scope.budgetsShowOne){
        requestDef.url = $rootScope.apiPathToResource({ resource: { name: 'Budget', id: $stateParams.budgetId } });
        requestDef.params = {};
      }

      $http(requestDef)
      .then(function(response){
        if($scope.budgetsShowOne){
          $scope.pagination.totalCount = 1;
          $scope.budgets = [response.data];
        }else{
          $scope.pagination.totalCount = parseInt(response.headers('Total-Count'));
          $scope.budgets = response.data;
        }

        var budgetsItemsPromises = [];
        var budgetsCustomersPromises = [];
        var budgetsOrdersPromises = [];

        _.each($scope.budgets, function(budget){
          if($scope.budgetsShowOne){
            budgetsItemsPromises.push(retriveBudgetItemsPromise(budget.id));
          }
          budgetsCustomersPromises.push(retriveCustomerPromise(budget.customer_id));
          budgetsOrdersPromises.push(retriveOrder(budget.id));
        });

        Promise.all([Promise.all(budgetsCustomersPromises),Promise.all(budgetsItemsPromises), Promise.all(budgetsOrdersPromises)]).then(function(promisesResolved) {
          $scope.budgets = _.map($scope.budgets, function(budget){
            var c = budget;
            c._expanded = {};
            c._expanded.customer = null;
            c._embedded = {};
            c._embedded.items = [];
            c._embedded.order = {};
            return c;
          });

          var budgetItemsBillableItemsPromises = [];

          for(var i=0; i<$scope.budgets.length; i++){
            $scope.budgets[i]._expanded.customer = promisesResolved[0][i].data;
            $scope.budgets[i]._embedded.order = promisesResolved[2][i].data[0];
            
            if($scope.budgetsShowOne){
              $scope.budgets[i]._embedded.items = promisesResolved[1][i].data;
              $scope.budgets[i]._embedded.items = _.map($scope.budgets[i]._embedded.items, function(item){
                item.total = item.price * item.quantity * (1 - item.discount);
                return item;
              });
              var billableItemsPromises = [];
              _.each($scope.budgets[i]._embedded.items, function(item){
                billableItemsPromises.push(retriveBillableItemPromise(item.billable_item_id));
              });
              budgetItemsBillableItemsPromises.push(Promise.all(billableItemsPromises));
            }
          }
          
          if($scope.budgetsShowOne){
            Promise.all(budgetItemsBillableItemsPromises).then(function(pResolved){
              for(var i=0; i<pResolved.length; i++){
                for(var j=0; j<pResolved[i].length; j++){
                  $scope.budgets[i]._embedded.items[j]._expanded = {};
                  $scope.budgets[i]._embedded.items[j]._expanded.billable_item = pResolved[i][j].data;
                }
              }
              $scope.loadingBudgets = false;
            });
          }else{
            $scope.loadingBudgets = false;
          }
        });

      });
    }

    listBudgets(1);


    var searchBudgets = function(page){

      $http({
        method: 'GET',
        data: "",
        url: $rootScope.apiPathToResource({resource: {name: 'budget'}}),
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
        $scope.budgets = response.data;
        $scope.loadingBudgets = false;
      });
    }

    $scope.search = function(){
      if($scope.searchAttrs.query===''){
        listBudgets(1);
      }else{
        searchBudgets(1);
      }
    }


    $scope.rentalConcluded = function(budget, reservation){
      var concluded = false;
      if(budget.children.rentals){
        var found = _.find(budget.children.rentals, function(rental){
          return rental.reservation_id===reservation.id;
        });
        if(found){
          concluded = true;
        }
      }
      return concluded;
    }

    $scope.viewRent = function(budget, reservation){
      if(budget.children.rentals){
        var found = _.find(budget.children.rentals, function(rental){
          return rental.reservation_id===reservation.id;
        });
        if(found){
          $rootScope.modal = $uibModal.open({
            animation: true,
            templateUrl: 'templates/reservation/view_invoice.html',
            controller: 'ReservationViewInvoiceCtrl',
            size: 'md',
            resolve: {
              reservation: function(){
                return reservation;
              },
              rental: function(){
                return found;
              },
              refresher: function(){
                return $scope.pageChanged;
              }
            }
          });
        }
      }
    }


    $scope.pageChanged = function(){
      if($scope.searchAttrs.query===''){
        listBudgets($scope.pagination.currentPage);
      }else{
        searchBudgets($scope.pagination.currentPage);
      }
    }


    $scope.delete = function(budget){
      $rootScope.modal = $uibModal.open({
        animation: true,
        templateUrl: 'templates/util/delete_modal.html',
        controller: 'BudgetDeleteCtrl',
        size: 'md',
        resolve: {
          budget: function(){
            return budget;
          },
          refresher: function(){
            return function(){$state.go('base.budgets', {}, {reload: true});};
          }
        }
      });
    }

    $scope.create = function(){
      $rootScope.modal = $uibModal.open({
        animation: true,
        templateUrl: 'templates/budget/create_update.html',
        controller: 'BudgetCreateUpdateCtrl',
        size: 'md',
        resolve: {
          budget: function(){
            return undefined;
          },
          refresher: function(){
            return $scope.pageChanged;
          }
        }
      });
    }

    $scope.edit = function(budget){
      $rootScope.modal = $uibModal.open({
        animation: true,
        templateUrl: 'templates/budget/create_update.html',
        controller: 'BudgetCreateUpdateCtrl',
        size: 'lg',
        resolve: {
          budget: function(){
            return budget;
          },
          refresher: function(){
            return $scope.pageChanged;
          }
        }
      });
    }

    $scope.createItem = function(budget){
      $rootScope.modal = $uibModal.open({
        animation: true,
        templateUrl: 'templates/budget/create_update_item.html',
        controller: 'BudgetCreateUpdateItemCtrl',
        size: 'md',
        resolve: {
          item: function(){
            return { budget_id: budget.id };
          },
          refresher: function(){
            return function(){$state.go('base.budget_show', {budgetId: budget.id}, {reload: true});};
          }
        }
      });
    }

    $scope.editItem = function(item){
      $rootScope.modal = $uibModal.open({
        animation: true,
        templateUrl: 'templates/budget/create_update_item.html',
        controller: 'BudgetCreateUpdateItemCtrl',
        size: 'md',
        resolve: {
          item: function(){
            return item;
          },
          refresher: function(){
            return function(){$state.go('base.budget_show', {budgetId: item.budget_id}, {reload: true});};
          }
        }
      });
    }

    $scope.deleteItem = function(item){
      $rootScope.modal = $uibModal.open({
        animation: true,
        templateUrl: 'templates/util/delete_modal.html',
        controller: 'BudgetDeleteItemCtrl',
        size: 'md',
        resolve: {
          item: function(){
            return item;
          },
          refresher: function(){
            return function(){$state.go('base.budget_show', {budgetId: item.budget_id}, {reload: true});};
          }
        }
      });
    }

    $scope.createAdditionalInformation = function(budget){
      $rootScope.modal = $uibModal.open({
        animation: true,
        templateUrl: 'templates/util/create_update_additional_information.html',
        controller: 'BudgetCreateUpdateAdditionalInformationCtrl',
        size: 'md',
        resolve: {
          info: function(){
            return { budget_id: budget.id };
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
        controller: 'BudgetCreateUpdateAdditionalInformationCtrl',
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
        controller: 'budgetDeleteAdditionalInformationCtrl',
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

    $scope.approveItem = function(item){
      $http({
        method: 'PUT',
        data: _.omit(item,['id']),
        url: $rootScope.apiPathToResource({
          resource: { name: 'Budget', id: item.budget_id, subResource: { name: 'BudgetItem', id: item.id} }
        }) + '/approve',
        // headers: {
        //   'Authorization': 'Bearer ' + $sessionStorage.auth.access_token
        // },
      })
      .then(function(response){
        $state.go('base.budget_show', {budgetId: item.budget_id}, {reload: true});
        toastr.success('Item aprovado com sucesso');
      })
      .catch(function(response){
        $uibModalInstance.close();
        toastr.error('Não foi possivel aprovar o item');
      });
    }

    $scope.closeBudget = function(budget){
      $http({
        method: 'PUT',
        data: _.omit(budget,['id']),
        url: $rootScope.apiPathToResource({
          resource: { name: 'Budget', id: budget.id }
        }) + '/close',
        // headers: {
        //   'Authorization': 'Bearer ' + $sessionStorage.auth.access_token
        // },
      })
      .then(function(response){
        $state.go('base.budget_show', {budgetId: budget.id}, {reload: true});
        toastr.success('Orçamento fechado com sucesso');
      })
      .catch(function(response){
        $uibModalInstance.close();
        toastr.error('Não foi possivel fechar o orçamento');
      });
    }

    $scope.order = function(budget){
      $rootScope.modal = $uibModal.open({
        animation: true,
        templateUrl: 'templates/budget/order.html',
        controller: 'BudgetOrderCtrl',
        size: 'md',
        resolve: {
          budget: function(){
            return budget;
          },
          refresher: function(){
            return function(){$state.go('base.budget_show', {budgetId: budget.id}, {reload: true});};
          }
        }
      });
    }

    

  }

})();