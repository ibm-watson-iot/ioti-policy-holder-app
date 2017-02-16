'use strict';

angular.module('BlurAdmin.services').factory('deviceService', function(
  $http, authenticationService, apiProtocol, apiHost, apiPath) {

  var apiUrl = apiProtocol + "://" + apiHost + apiPath + 'device';

  return {
    me: function() {
      return $http.get(apiUrl);
    },
    find: function(deviceId) {
      return $http.get(apiUrl + '/' + deviceId);
    },
    findAll: function() {
      var url;
      if (authenticationService.isAdmin()) {
        url = apiUrl + '/all';
      } else {
        url = apiUrl;
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
