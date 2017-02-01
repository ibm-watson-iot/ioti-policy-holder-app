'use strict';

angular.module('BlurAdmin.services').factory('shieldAssociationService', function($http, apiProtocol, apiHost, apiPath) {
  var apiUrl = apiProtocol + "://" + apiHost + apiPath + 'shieldassociation';

  return {
    me: function() {
      return $http.get(apiUrl);
    },
    find: function(shieldAssociationId) {
      return $http.get(apiUrl + '/' + shieldAssociationId);
    },
    findAll: function(username) {
      var url;
      if (username) {
        url = apiUrl + '/byuser/' + username;
      } else {
        url = apiUrl + '/all';
      }
      return $http.get(url);
    },
    remove: function(shieldAssociationId) {
      return $http['delete'](apiUrl + '/' + shieldAssociationId);
    },
    save: function(shieldAssociation) {
      if(shieldAssociation.id) {
        return $http.put(apiUrl + shieldAssociation.id, shieldAssociation);
      } else {
        return $http.post(apiUrl, shieldAssociation);
      }
    }
  };

});
