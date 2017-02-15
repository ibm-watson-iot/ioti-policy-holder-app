'use strict';

angular.module('BlurAdmin.services').factory('claimService', function($http, apiProtocol, claimApiHost, apiPath) {
  var apiUrl = apiProtocol + "://" + claimApiHost + apiPath + 'api/v1/claims';

  return {
    me: function() {
      return $http.get(apiUrl);
    },
    find: function(claimId) {
      return $http.get(apiUrl + '/' + claimId);
    },
    findAll: function(username) {
      var url;
      if (username) {
        url = apiUrl + '/user/' + username;
      } else {
        url = apiUrl;
      }
      return $http.get(url);
    },
    remove: function(claim) {
      return $http['delete'](apiUrl + '/', claim);
    },
    save: function(claim) {
      if (claim._id) {
        return $http.put(apiUrl, claim);
      } else {
        return $http.post(apiUrl, claim);
      }
    }
  };

});
