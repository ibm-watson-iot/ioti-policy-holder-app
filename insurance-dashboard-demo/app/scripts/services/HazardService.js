'use strict';

angular.module('BlurAdmin.services').factory('hazardService', function($http, apiProtocol, apiHost, apiPath, tenantId) {
  var apiUrl = apiProtocol + '://' + apiHost + apiPath + '/' + tenantId + '/hazards';

  return {
    me: function() {
      return $http.get(apiUrl);
    },
    find: function(hazardId) {
      return $http.get(apiUrl + '/' + hazardId);
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
    remove: function(hazardId) {
      return $http['delete'](apiUrl + '/' + hazardId);
    },
    updatePartial: function(hazardId, partOfHazard) {
      return $http.post(apiUrl + '/' + hazardId, partOfHazard);
    },
    save: function(hazard) {
      if(hazard._id) {
        return $http.put(apiUrl + '/' + hazard._id, hazardEvent);
      } else {
        return $http.post(apiUrl, hazardEvent);
      }
    }
  };

});
