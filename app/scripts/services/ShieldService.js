'use strict';

angular.module('BlurAdmin.services').factory('shieldService', function($http, apiProtocol, apiHost, apiPath) {
  var apiUrl = apiProtocol + "://" + apiHost + apiPath + 'shield';

  return {
    me: function() {
      return $http.get(apiUrl);
    },
    find: function(shieldId) {
      return $http.get(apiUrl + '/byuuid/' + shieldId);
    },
    findAll: function(username) {
      var url;
      if (username) {
        url = apiUrl + '/byusername/' + username;
      } else {
        url = apiUrl + '/all';
      }
      return $http.get(url);
    },
    remove: function(shieldId) {
      return $http['delete'](apiUrl + '/' + shieldId);
    },
    save: function(shield) {
      if(shield.id) {
        return $http.put(apiUrl + shield.id, shield);
      } else {
        return $http.post(apiUrl, shield);
      }
    }
  };

});
