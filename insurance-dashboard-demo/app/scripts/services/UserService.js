'use strict';

angular.module('BlurAdmin.services').factory('userService', function(
  $http, backendProtocol, backendHost, backendPath) {

  var backendUrl = backendProtocol + '://' + backendHost + backendPath + '/users';

  return {
    me: function() {
      return $http.get(backendUrl);
    },
    find: function(userId) {
      return $http.get(backendUrl + '/' + userId);
    },
    findAll: function(skip, limit) {
      var params = [];
      if (skip) {
        params.push('skip=' + skip);
      }
      if (limit) {
        params.push('limit=' + limit);
      }
      var url = backendUrl;
      if (Object.keys(params) && (Object.keys(params).length > 0)) {
        url =+ '?';
      }
      Object.keys(params).forEach(function(key) {
        url =+ params[key] + '&';
      });
      return $http.get(url);
    },
    remove: function(userId) {
      return $http['delete'](backendUrl + '/' + userId);
    },
    save: function(user) {
      if(user._id) {
        return $http.put(backendUrl + '/' + user._id, user);
      } else {
        user._id = user.sub;
        return $http.post(backendUrl, user);
      }
    }
  };

});
