angular.module('mega-remote.controllers', [])

  .controller('HomeCtrl', function ($scope) { })

  .controller('ConnectCtrl', function ($scope, Router, $http, HttpServer, $ionicLoading) {
  	
  // action searchDesktop();
  $scope.searchDesktop = function () {

    $scope.servers = [];
  	
    // get local router ip address
    Router.getrouteripaddress(function (ip) {

      // try multiple ip address
      /*var loopScan = function (arrayIp, callback) {
        var serverAddress = 'http://' + arrayIp[0] + '.' + arrayIp[1] + '.' + arrayIp[2] + '.' + (1 + parseInt(arrayIp[3])) + ':1337';
        HttpServer.scan(serverAddress, function (res) {

          if (res) {
            callback(res.data);
          } else {
            arrayIp[3]++;
            loopScan(arrayIp, callback);
          }
        });
      };*/

      var servers = [];
      $scope.servers = servers; 
  	 
      // show loader
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });

      window.plugins.dnssd.browse("_mega-retro._tcp", "",
        function serviceFound(serviceName, regType, domain, moreComing) {

          var server = {
            serviceName: serviceName,
            regType: regType,
            domain: domain
          };

          servers.push(server);

          if (!moreComing) {
            $ionicLoading.hide(); // remove loader;
          }

        }, function serviceLost(serviceName, regType, domain, moreComing) {

          var server = {
            serviceName: serviceName,
            regType: regType,
            domain: domain
          };

          var idxServer = servers.indexOf(server);

          servers.splice(idxServer, 1);
          $scope.$apply();
        });
    });
  };
})
  .controller('RemoteCtrl', function ($scope, $stateParams, Socket) {
  // retrieve server informations
  var server = JSON.parse($stateParams.server);
  $scope.server = server;

  window.plugins.dnssd.resolve(server.serviceName, server.regType, server.domain, 
  function serviceResolved(hostName, port, serviceName, regType, domain) {
    console.log(hostName);
    console.log(port);
    var socket = new Socket(hostName, port);
  });
})
  .controller('OptionCtrl', function ($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
