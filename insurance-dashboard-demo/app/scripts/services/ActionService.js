'use strict';

angular.module('BlurAdmin.services').factory('actionService', function($http, apiProtocol, apiHost, apiPath, tenantId) {
  var apiUrl = apiProtocol + '://' + apiHost + apiPath + '/' + tenantId + '/actions';

  return {
    me: function() {
      return $http.get(apiUrl);
    },
    find: function(actionId) {
      return $http.get(apiUrl + '/' + actionId);
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
    remove: function(actionId) {
      return $http['delete'](apiUrl + '/' + actionId);
    },
    updatePartial: function(actionId, partOfAction) {
      return $http.post(apiUrl + '/' + actionId, partOfAction);
    },
    save: function(action) {
      if(action._id) {
        return $http.put(apiUrl + '/' + action._id, action);
      } else {
        return $http.post(apiUrl, action);
      }
    }
  };

});
