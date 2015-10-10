angular.module('mega-remote.services', [])

  .factory('Chats', function () {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
      id: 1,
      name: 'Max Lynx',
      lastText: 'Hey, it\'s me',
      face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
    }, {
      id: 2,
      name: 'Adam Bradleyson',
      lastText: 'I should buy a boat',
      face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
    }, {
      id: 3,
      name: 'Perry Governor',
      lastText: 'Look at my mukluks!',
      face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
    }, {
      id: 4,
      name: 'Mike Harrington',
      lastText: 'This is wicked good ice cream.',
      face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
    }];

  return {
    all: function () {
      return chats;
    },
    remove: function (chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function (chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})
  .factory('Socket', function ($rootScope) {

  var Socket = function (hostName, port, updated) {
    this.socket = io.connect('http://'+hostName+':'+port, {'force new connection': true});
    console.log('http://'+hostName+':'+port);
    console.log('New socket created');
  };

  Socket.prototype.on = function (eventName, callback) {
    var that = this;
    this.socket.on(eventName, function () {
      var args = arguments;
      $rootScope.$apply(function () {
        callback.apply(that.socket, args);
      });
    });
  };

  Socket.prototype.emit = function (eventName, data, callback) {
    var that = this;
    this.socket.emit(eventName, data, function () {
      var args = arguments;
      $rootScope.$apply(function () {
        if (callback) {
          callback.apply(that.socket, args);
        }
      });
    });
  };

  Socket.prototype.close = function () {
    this.socket.close();
  };

  return Socket;
})
  .factory('Router', ['$q', function ($q) {

  return {
    getrouteripaddress: function (callback) {
      window.getrouteripaddress.getRouterIPAddress(function (ip) {
        callback(ip);
      });
    }
  }
}])
  .service('HttpServer', function ($http) {
  return {
    scan: function (adress, callback) {
      $http({
        timeout: 100,
        url: adress,
        method: "GET",
        params: { "action": "scan" }
      }).success(function (res) {
        console.log('success');
        callback(res);
      }).error(function (res) {
        console.log('fail');
        callback(res);
      });
    }
  };
});
