angular.module('mega-remote.controllers', [])

  .controller('HomeCtrl', function ($scope) { })

  .controller('ConnectCtrl', function ($scope, Router, $http, HttpServer, $ionicLoading) {
    
    // Event lors de la recherche d'hôte
    $scope.searchDesktop = function () {
    
      // Scope array contenant la liste des des hôtes
      $scope.servers = [];
      var servers = [];
      $scope.servers = servers; 
  	 
      // Affiche le loader
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });
    
      // Event DNSSD pour retrouver les hôtes
      window.plugins.dnssd.browse("_mega-retro._tcp", "local.",
        function serviceFound(serviceName, regType, domain, moreComing) {

          var server = {
            serviceName: serviceName,
            regType: regType,
            domain: domain
          };

          servers.push(server);

          if (!moreComing) {
            $ionicLoading.hide(); // desactive le loader;
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
    
    // Recupére les informations du serveur (nom du serveur)
    var server = JSON.parse($stateParams.server);
    var socket = null;
  
    // Passe le server dans le scope de la view
    $scope.server = server;
  
    // Résoud l'ip et le port de l'hôte
    window.plugins.dnssd.resolve(server.serviceName, server.regType, server.domain,
      function serviceResolved(hostName, port, serviceName, regType, domain) {
        console.log('try to connect to :');
        console.log('hostName : ' + hostName);
        console.log('port : ' + port);
        // Création de la web socket
        //socket = new Socket(hostName, port);
        socket = new Socket(hostName,port);
      
        // Envoie l'event addPlayer à l'hote
        socket.emit('addPlayer', {username : 'jean claude'});
      });
    
    // Event lorsque l'utilisateur quitte la view    
    $scope.$on('$ionicView.leave', function () {
      // Suppression de la socket
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
