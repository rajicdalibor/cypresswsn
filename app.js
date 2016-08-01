var app;
(function(){
  app = angular.module('cypressWSN', ['ngMaterial', 'nvd3'])
  .config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('blue-grey')
      .accentPalette('blue');
    $mdThemingProvider.theme('success-toast');
    $mdThemingProvider.theme('error-toast');
    
    $mdThemingProvider.alwaysWatchTheme(true);
  })  
})();

app.controller('mainController', function($scope, $mdToast){

    $scope.cypressWSN = cypressWSN;

    // ---------- Graph Code START -----------
    $scope.options = {
        chart: {
            type: 'lineChart',
            height: 250,
            width: 380,
            margin : {
                top: 20,
                right: 20,
                bottom: 40,
                left: 55
            },
            x: function(d){ return d.x; },
            y: function(d){ return d.y; },
            useInteractiveGuideline: true,
            duration: 0,    
            yAxis: {
                tickFormat: function(d){
                   return d3.format('.01f')(d);
                }
            },
            xAxis: {
                axisLabel:'Time',
                tickFormat: function(d){
                    for(var uuid in $scope.cypressWSN.peripherals){
                        if($scope.cypressWSN.peripherals[uuid].tempGraphData[0].values[d]){
                            var label = $scope.cypressWSN.peripherals[uuid].tempGraphData[0].values[d].label;
                            return label;
                        }
                    }
                }
            }
        }
    };

    $scope.tempOptions = angular.copy($scope.options);
    $scope.humidityOptions = angular.copy($scope.options);
    
    var x = 0;
    setInterval(function(){
        for(var uuid in $scope.cypressWSN.peripherals){
            if(!isNaN($scope.cypressWSN.peripherals[uuid].tempData.timeNum) && !isNaN($scope.cypressWSN.peripherals[uuid].tempData.temp)){
                $scope.cypressWSN.peripherals[uuid].tempGraphData[0].values.push(
                    { x: $scope.cypressWSN.peripherals[uuid].tempData.timeNum,
                      y: $scope.cypressWSN.peripherals[uuid].tempData.temp,
                      label:$scope.cypressWSN.peripherals[uuid].tempData.date});
            }
            if ($scope.cypressWSN.peripherals[uuid].tempGraphData[0].values.length > 100) $scope.cypressWSN.peripherals[uuid].tempGraphData[0].values.shift();

            if(!isNaN($scope.cypressWSN.peripherals[uuid].humidityData.timeNum) && !isNaN($scope.cypressWSN.peripherals[uuid].humidityData.temp)){
                $scope.cypressWSN.peripherals[uuid].humidityGraphData[0].values.push(
                    { x: $scope.cypressWSN.peripherals[uuid].humidityData.timeNum,
                      y: $scope.cypressWSN.peripherals[uuid].humidityData.temp,
                      label:$scope.cypressWSN.peripherals[uuid].tempData.date});
            }
            if ($scope.cypressWSN.peripherals[uuid].humidityGraphData[0].values.length > 100) $scope.cypressWSN.peripherals[uuid].humidityGraphData[0].values.shift();
        }
        x++;
    }, 1000);
    // ---------- Graph Code END -----------

    $scope.cypressWSN.onSuccess = function(message){
        $mdToast.show(
          $mdToast.simple()
            .content(message)
            .position('top right')
            .hideDelay(4000)
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