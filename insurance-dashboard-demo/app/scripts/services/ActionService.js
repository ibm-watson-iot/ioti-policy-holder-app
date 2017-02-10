'use strict';

angular.module('BlurAdmin.services').factory('actionService', function($http, apiProtocol, apiHost, apiPath) {
  var apiUrl = apiProtocol + "://" + apiHost + apiPath + 'action';

  return {
    me: function() {
      return $http.get(apiUrl);
    },
    find: function(deviceId) {
      return $http.get(apiUrl + '/' + deviceId);
    },
    findAll: function(username) {
      var url;
      if (username) {
        url = apiUrl + '/byUser/' + username;
      } else {
        url = apiUrl + '/all';
      }
      return $http.get(url);
    },
    remove: function(deviceId) {
      return $http['delete'](apiUrl + '/' + deviceId);
    },
    save: function(device) {
      if(device.id) {
        return $http.put(apiUrl + device.id, device);
      } else {
        return $http.post(apiUrl, device);
      }
    }
  };

});
