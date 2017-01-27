'use strict';

angular.module('BlurAdmin.services').factory('userService', function($http, apiProtocol, apiHost, apiPath) {
  var apiUrl = apiProtocol + "://" + apiHost + apiPath + 'user';

  return {
    me: function() {
      return $http.get(apiUrl);
    },
    find: function(userId) {
      return $http.get(apiUrl + userId);
    },
    findAll: function(username) {
      var url;
      if (username) {
        url = apiUrl + '/name/' + username;
      } else {
        url = apiUrl + '/all';
      }
      return $http.get(url);
    },
    remove: function(userId) {
      return $http['delete'](apiUrl + userId);
    },
    save: function(user) {
      if(user.id) {
        return $http.put(apiUrl + user.id, user);
      } else {
        return $http.post(apiUrl, user);
      }
    }
  };

});
