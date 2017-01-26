'use strict';

angular.module('BlurAdmin.services').factory('userService', function($http, apiProtocol, apiHost, apiPath) {
  var apiUrl = apiProtocol + "://" + apiHost + apiPath + 'user';

  return {
    me: function() {
      return $http.get(apiUrl);
    },
    find: function(profileId) {
      return $http.get(apiUrl + profileId);
    },
    findAll: function(pageNumber, pageSize) {
      var url = apiUrl;
      if (!pageNumber) {
        pageNumber = 0;
      }
      url = url + '?pageNumber=' + pageNumber;
      if (pageSize) {
        url = url + '&pageSize=' + pageSize;
      }
      return $http.get(url);
    },
    remove: function(profileId) {
      return $http['delete'](apiUrl + profileId);
    },
    save: function(profile) {
      if(profile.id) {
        return $http.put(apiUrl + profile.id, profile);
      } else {
        return $http.post(apiUrl, profile);
      }
    }
  };

});
