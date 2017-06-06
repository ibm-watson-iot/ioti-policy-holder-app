'use strict';

angular.module('BlurAdmin.services').factory('deviceService', function($http, apiProtocol, apiHost, apiPath, tenantId) {
  var apiUrl = apiProtocol + '://' + apiHost + apiPath + '/' + tenantId + '/devices';

  return {
    me: function() {
      return $http.get(apiUrl);
    },
    find: function(deviceId) {
      return $http.get(apiUrl + '/' + deviceId);
    },
    findAll: function(skip, limit) {
      var params = [];
      if (skip) {
        params.push('skip=' + skip);
      }
      if (limit) {
        params.push('limit=' + limit);
      }
      var url = apiUrl;
      if (Object.keys(params) && (Object.keys(params).length > 0)) {
        url =+ '?';
      }
      Object.keys(params).forEach(function(key) {
        url =+ params[key] + '&';
      });
      return $http.get(url);
    },
    remove: function(deviceId) {
      return $http['delete'](apiUrl + '/' + deviceId);
    },
    save: function(device) {
      if(device._id) {
        return $http.put(apiUrl + '/' + device._id, device);
      } else {
        return $http.post(apiUrl, device);
      }
    }
  };

});
