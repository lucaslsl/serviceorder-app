/**
 * Master Controller
 */

angular.module('ServiceOrder')
  .controller('MasterCtrl', ['$http','$scope', '$cookieStore', '$state', '$sessionStorage', '$breadcrumb', 'toastr', MasterCtrl]);

function MasterCtrl($http,$scope, $cookieStore, $state, $sessionStorage, $breadcrumb, toastr) {
  /**
   * Sidebar Toggle & Cookie Control
   */
  var mobileView = 992;

  $scope.getWidth = function() {
    return window.innerWidth;
  };

  $scope.$watch($scope.getWidth, function(newValue, oldValue) {
    if (newValue >= mobileView) {
      if (angular.isDefined($cookieStore.get('toggle'))) {
        $scope.toggle = ! $cookieStore.get('toggle') ? false : true;
      } else {
        $scope.toggle = true;
      }
    } else {
      $scope.toggle = false;
    }

  });

  $scope.toggleSidebar = function() {
    $scope.toggle = !$scope.toggle;
    $cookieStore.put('toggle', $scope.toggle);
  };

  window.onresize = function() {
    $scope.$apply();
  };

  $scope.$on('$stateChangeSuccess', function () {
    if($state.is('base')){
        $state.go('base.budgets');
    }
  });

  $scope.breadcrumbLast = function(){
    return $breadcrumb.getLastStep().ncyBreadcrumbLabel;
  }

  // if($sessionStorage.user===undefined || $sessionStorage.user.id=== undefined){
  //   $http({
  //     method: 'GET',
  //     data: '',
  //     url:'/api/v1/users/me'
  //   })
  //   .then(function(response){
  //     if(response.data.isAdmin){
  //       $sessionStorage.user = response.data;
  //     }else{
  //       $state.go('login');
  //     }
  //   })
  //   .catch(function(response){
  //     $state.go('login');
  //   });
  // }else{
  //   $scope.user = $sessionStorage.user;
  // }

  $scope.logout = function(){
    $http({
      method: 'DELETE',
      data: '',
      headers: {
        'Authorization': 'Bearer ' + $sessionStorage.auth.access_token
      },
      url:'/api/v1/auth'
    })
    .then(function(response){
      $sessionStorage.user = {};
      $sessionStorage.auth = {};
      $state.go('login');
    })
    .catch(function(response){
      toastr.error('Um erro ocorreu. Tente novamente.');
    });
  }

}