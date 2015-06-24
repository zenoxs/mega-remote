angular.module('mega-remote.controllers', [])

  .controller('HomeCtrl', function ($scope) { })

  .controller('ConnectCtrl', function ($scope, Router, $http, HttpServer, $ionicLoading) {

  $scope.searchDesktop = function () {

    $scope.servers = [];

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

    window.plugins.dnssd.browse("_mega-retro._tcp", "local.",
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
  };
})
  .controller('RemoteCtrl', function ($scope, $stateParams, Socket) {
    
  // retrieve server informations
  var server = JSON.parse($stateParams.server);
  var socket = null;

  $scope.server = server;

  window.plugins.dnssd.resolve(server.serviceName, server.regType, server.domain,
    function serviceResolved(hostName, port, serviceName, regType, domain) {
      socket = new Socket(hostName, port);
      
      socket.emit('addPlayer', {username : 'jean claude'});
    });

  $scope.$on('$ionicView.leave', function () {
    socket.close();
    socket = null;
    delete socket;
  });
})
  .controller('OptionCtrl', function ($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
