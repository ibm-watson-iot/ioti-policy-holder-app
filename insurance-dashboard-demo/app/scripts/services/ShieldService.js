'use strict';

angular.module('BlurAdmin.services').factory('shieldService', function($http, apiProtocol, apiHost, apiPath, tenantId) {
  var apiUrl = apiProtocol + '://' + apiHost + apiPath + '/' + tenantId + '/shields';

  return {
    me: function() {
      return $http.get(apiUrl);
    },
    find: function(shieldId) {
      return $http.get(apiUrl + '/' + shieldId);
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
    remove: function(shieldId) {
      return $http['delete'](apiUrl + '/' + shieldId);
    },
    updatePartial: function(shieldId, partOfShield) {
      return $http.post(apiUrl + '/' + shieldId, partOfShield);
    },
    save: function(shield) {
      if(shield._id) {
        return $http.put(apiUrl + '/' + shield._id, shield);
      } else {
        return $http.post(apiUrl, shield);
      }
    }
  };

});
