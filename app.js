var app;
(function(){
  app = angular.module('cypressWSN', ['ngMaterial'])
  .config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('blue')
      .accentPalette('pink');
    $mdThemingProvider.theme('success-toast');
    $mdThemingProvider.theme('error-toast');
    
    $mdThemingProvider.alwaysWatchTheme(true);
  })  
})();

app.controller('mainController', function($scope, $mdToast){

    $scope.cypressWSN = cypressWSN;

    $scope.cypressWSN.onSuccess = function(message){
        $mdToast.show(
          $mdToast.simple()
            .content(message)
            .position('top right')
            .hideDelay(2500)
            .theme("success-toast")
        );
    };

    $scope.cypressWSN.onError = function(message){
        $mdToast.show(
          $mdToast.simple()
            .content(message)
            .position('top right')
            .hideDelay(2500)
            .theme("error-toast")
        );
    };

    $scope.cypressWSN.updateUI = function(){
      $scope.$apply();
    };

    $scope.cypressWSN.onSuccess('Scanning ....');
});