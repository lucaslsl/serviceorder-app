'use strict';

/**
 * Route configuration for the RDash module.
 */
angular.module('ServiceOrder').config(['$stateProvider', '$urlRouterProvider','valdrProvider','valdrMessageProvider', '$breadcrumbProvider',
  function($stateProvider, $urlRouterProvider,valdrProvider,valdrMessageProvider, $breadcrumbProvider) {

    // For unmatched routes
    $urlRouterProvider.otherwise('/');

    // Application routes
    $stateProvider
      .state('login', {
        url: '/login',
        views: {
          'main': {
            templateUrl: 'templates/general/login.html',
            controller: 'LoginCtrl'
          }
        },
        authenticationRequired: false
      })
      .state('base', {
        url: '/',
        views: {
          'main': {
            templateUrl: 'templates/general/base.html',
            controller: 'MasterCtrl'
          }
        },
        ncyBreadcrumb: {
          label: 'Início'
        },
        authenticationRequired: true
      })
      .state('base.dashboard', {
        url: 'dashboard',
        views: {
          'content': {
            templateUrl: 'templates/dashboard.html'
          }
        },
        authenticationRequired: true
      })
      .state('base.billable_items', {
        url: 'billable_items',
        views: {
          'content': {
            templateUrl: 'templates/billable_item/list.html',
            controller: 'BillableItemListCtrl'
          }
        },
        ncyBreadcrumb: {
          label: 'Itens de Cobrança'
        },
        authenticationRequired: true
      })
      .state('base.customers', {
        url: 'customers',
        views: {
          'content': {
            templateUrl: 'templates/customer/list.html',
            controller: 'CustomerListCtrl'
          }
        },
        ncyBreadcrumb: {
          label: 'Clientes'
        },
        authenticationRequired: true
      })
      .state('base.customer_show', {
        url: 'customers/:customerId',
        views: {
          'content': {
            templateUrl: 'templates/customer/list.html',
            controller: 'CustomerListCtrl'
          }
        },
        ncyBreadcrumb: {
          parent: 'base.customers',
          label: '{{customers[0].name}}'
        },
        authenticationRequired: true
      })
      .state('base.budgets', {
        url: 'budgets',
        views: {
          'content': {
            templateUrl: 'templates/budget/list.html',
            controller: 'BudgetListCtrl'
          }
        },
        ncyBreadcrumb: {
          label: 'Orçamentos'
        },
        authenticationRequired: true
      })
      .state('base.budget_show', {
        url: 'budgets/:budgetId',
        views: {
          'content': {
            templateUrl: 'templates/budget/list.html',
            controller: 'BudgetListCtrl'
          }
        },
        ncyBreadcrumb: {
          parent: 'base.budgets',
          label: '{{budgets[0].id}}'
        },
        authenticationRequired: true
      })
      .state('base.orders', {
        url: 'orders',
        views: {
          'content': {
            templateUrl: 'templates/order/list.html',
            controller: 'OrderListCtrl'
          }
        },
        ncyBreadcrumb: {
          label: 'Ordens de Serviço'
        },
        authenticationRequired: true
      })
      .state('base.order_show', {
        url: 'orders/:orderId',
        views: {
          'content': {
            templateUrl: 'templates/order/list.html',
            controller: 'OrderListCtrl'
          }
        },
        ncyBreadcrumb: {
          parent: 'base.orders',
          label: '{{orders[0].id}}'
        },
        authenticationRequired: true
      })
      .state('base.users', {
        url: 'users',
        views: {
          'content': {
            templateUrl: 'templates/user/list.html',
            controller: 'UserListCtrl'
          }
        },
        ncyBreadcrumb: {
          label: 'Usuários'
        },
        authenticationRequired: true
      });

    $breadcrumbProvider.setOptions({
      templateUrl: 'templates/general/breadcrumb.html'
    });

    valdrProvider.addValidator('undefinedObjectValidator');
    valdrProvider.addValidator('nationalRegistrationNumberValidator');

      
    valdrProvider.addConstraints({
      Order: {
      },
      Budget: {
        customer: {
          undefinedObjectValidator: {
            message: 'Selecione um cliente'
          },
          required: {
            message: 'Selecione um cliente'
          }
        }
      },
      BudgetItem: {
        billable_item: {
          undefinedObjectValidator: {
            message: 'Item de Cobrança nao selecionado'
          },
          required: {
            message: 'Item de Cobrança nao selecionado'
          }
        },
        quantity: {
          digits: {
            integer: 4,
            fraction: 0,
            message: 'Quantidade invalida'
          },
          required: {
            message: 'Quantidade obrigatória'
          }
        }
      },
      Customer: {
        name: {
          size: {
            min: 1,
            max: 30,
            message: 'Nome deve conter entre 1 e 30 caracteres'
          },
          required: {
            message: 'Nome é obrigatório'
          }
        },
        national_registration_number: {
          nationalRegistrationNumberValidator: {
            message: 'Deve ser CPF/CNPJ'
          },
          required: {
            message: 'CPF/CNPJ é obrigatório'
          }
        }
      },
      AdditionalInformation: {
        key: {
          size: {
            min: 1,
            max: 30,
            message: 'Chave deve conter entre 1 e 30 caracteres'
          },
          required: {
            message: 'Chave é obrigatório'
          }
        },
        value: {
          size: {
            min: 1,
            max: 60,
            message: 'Valor deve conter entre 1 e 60 caracteres'
          },
          required: {
            message: 'Valor é obrigatório'
          }
        }
      },
      CustomerAddress: {
        formatted_address: {
          size: {
            min: 3,
            max: 160,
            message: 'Endereço deve conter entre 3 e 160 caracteres'
          },
          required: {
            message: 'Endereço é obrigatório'
          }
        },
        locality: {
          size: {
            min: 3,
            max: 60,
            message: 'Cidade deve conter entre 3 e 60 caracteres'
          },
          required: {
            message: 'Cidade é obrigatório'
          }
        },
        postal_code: {
          size: {
            min: 3,
            max: 60,
            message: 'CEP deve conter entre 3 e 60 caracteres'
          },
          required: {
            message: 'CEP é obrigatório'
          }
        }
      },
      CustomerDocument: {
        name: {
          size: {
            min: 1,
            max: 20,
            message: 'Nome deve conter entre 1 e 20 caracteres'
          },
          required: {
            message: 'Nome é obrigatório'
          }
        },
        number: {
          size: {
            min: 6,
            max: 40,
            message: 'Número deve conter entre 6 e 40 caracteres'
          },
          required: {
            message: 'Número é obrigatório'
          }
        },
        authority: {
          size: {
            min: 3,
            max: 60,
            message: 'Autoridade deve conter entre 3 e 60 caracteres'
          },
          required: {
            message: 'Autoridade é obrigatório'
          }
        }
      },
      BillableItem: {
        name: {
          size: {
            min: 3,
            max: 60,
            message: 'Nome deve conter entre 3 e 60 caracteres.'
          },
          required: {
            message: 'Nome é obrigatório'
          }
        },
        description: {
          size: {
            min: 0,
            max: 200,
            message: 'Descrição deve conter até 200 caracteres.'
          }
        },
        cost: {
          required: {
            message: 'Valor é obrigatório'
          }
        }
      },
      User: {
        first_name: {
          size: {
            min: 2,
            max: 200,
            message: 'Nome deve conter entre 2 e 200 caracteres.'
          },
          required: {
            message: 'Nome é obrigatório'
          }
        },
        last_name: {
          size: {
            min: 2,
            max: 200,
            message: 'Sobrenome deve conter entre 2 e 200 caracteres.'
          },
          required: {
            message: 'Sobrenome é obrigatório'
          }
        },
        username: {
          required: {
            message: 'Nome de usuário é obrigatório'
          }
        },
        password: {
          required: {
            message: 'Senha é obrigatório'
          }
        }
      },
    });

    valdrMessageProvider
      .setTemplate('<div><p class="valdr-msg">{{ violation.message }}</p></div>');


  }


]).run(['$http', '$rootScope', '$state', '$sessionStorage', function($http, $rootScope, $state, $sessionStorage){
  // delete $http.defaults.headers['get'];
  $http.defaults.headers.get = {'Content-Type': 'application/json'};
  $http.defaults.headers.patch = {'Content-Type': 'application/json'};
  $http.defaults.headers.put = {'Content-Type': 'application/json'};
  $http.defaults.headers.delete = {'Content-Type': 'application/json'};
  $http.defaults.headers.post = {'Content-Type': 'application/json'};

  $rootScope.apiResources = {
    'Customer': {
      path: 'customers',
      subResources: {
        'Address': { path: 'addresses' }, 
        'AdditionalInformation': { path: 'infos' } 
      } 
    },
    'Budget': {
      path: 'budgets',
      subResources: {
        'BudgetItem': { path: 'items' }
      } 
    },
    'BillableItem': { path: 'billable_items' },
    'Order': { path: 'orders' }
  };
  $rootScope.apiPath = {{API_PATH}};
  $rootScope.apiPathToResource = function(opts){
    var path = $rootScope.apiPath;

    if(opts && opts.resource && opts.resource.name && $rootScope.apiResources[opts.resource.name]){
      path += '/' + $rootScope.apiResources[opts.resource.name].path;

      if(opts.resource.id){
        path += '/' + opts.resource.id;

        if(opts.resource.subResource && opts.resource.subResource.name && $rootScope.apiResources[opts.resource.name].subResources[opts.resource.subResource.name]){
          path += '/' + $rootScope.apiResources[opts.resource.name].subResources[opts.resource.subResource.name].path;

          if(opts.resource.subResource.id){
            path += '/' + opts.resource.subResource.id;
          }
        }
      }
    }
    return path;
  }

  $rootScope.$on('$stateChangeStart', function(event, next, current, toState, toParams, fromState, fromParams){

    // if(toState.authenticationRequired){
    //   if($sessionStorage.user===undefined || $sessionStorage.user.id=== undefined){
    //     $http({
    //       method: 'GET',
    //       data: '',
    //       url:'/api/v1/users/me'
    //     })
    //     .then(function(response){
    //       if(response.data.isAdmin){
    //         $sessionStorage.user = response.data;
    //       }else{
    //         $state.go('login');
    //       }
    //     })
    //     .catch(function(response){
    //       $state.go('login');
    //     });
    //   }
      
    // }


  });

}]);