'use strict';

angular.module('BlurAdmin.services').factory('claimService', function($http, backendProtocol, backendHost, backendPath) {
  var backendUrl = backendProtocol + '://' + backendHost + backendPath + '/claims';

  return {
    me: function() {
      return $http.get(backendUrl);
    },
    find: function(claimId) {
      return $http.get(backendUrl + '/' + claimId);
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
    findByHazardId: function(hazardId) {
      return $http.get(backendUrl + '/?hazardId=' + hazardId);
    },
    findByUserId: function(userId) {
      return $http.get(backendUrl + '/?userId=' + userId);
    },
    remove: function(claimId) {
      return $http['delete'](backendUrl + '/', claimId);
    },
    save: function(claim) {
      if (claim._id) {
        return $http.put(backendUrl, claim);
      } else {
        return $http.post(backendUrl, claim);
      }
    }
  };

});
