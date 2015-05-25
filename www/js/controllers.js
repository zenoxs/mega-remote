angular.module('starter.controllers', [])

  .controller('HomeCtrl', function ($scope) {})

  .controller('ConnectCtrl', function ($scope, Router, $http, HttpServer, $ionicLoading) {
  	
  // action searchDesktop();
  $scope.searchDesktop = function () {

    $scope.servers = [];
  	
    // get local router ip address
    Router.getrouteripaddress(function (ip) {

      // try multiple ip address
      var loopScan = function (arrayIp, callback) {

        var serverAddress = 'http://' + arrayIp[0] + '.' + arrayIp[1] + '.' + arrayIp[2] + '.' + (1 + parseInt(arrayIp[3])) + ':1337';

        HttpServer.scan(serverAddress, function (res) {

          if (res) {
            callback(res.data);
          } else {
            arrayIp[3]++;
            loopScan(arrayIp, callback);
          }
        });
      };
  	 
      // show loader
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });
  	 
      var arrayIp = ip.split('.');
      
      // start the loop scan
      loopScan(arrayIp, function (dataServer) {
        $scope.servers.push(dataServer); // push server
  	     $ionicLoading.hide(); //hide loader
      });
    });
  };
})
.controller('RemoteCtrl', function($scope, $stateParams) {
  // retrieve server informations
  $scope.server = JSON.parse($stateParams.server);
  
  console.log(JSON.stringify($scope.server));
})

  .controller('OptionCtrl', function ($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
