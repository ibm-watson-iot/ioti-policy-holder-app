'use strict';

angular.module('BlurAdmin.services').factory('hazardService', function(
  $http, authenticationService, apiProtocol, apiHost, apiPath) {

  var apiUrl = apiProtocol + "://" + apiHost + apiPath + 'hazardEvent';

  return {
    me: function() {
      return $http.get(apiUrl);
    },
    find: function(hazardEventId) {
      return $http.get(apiUrl + '/byHazardId/' + hazardEventId);
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
    remove: function(hazardEventId) {
      return $http['delete'](apiUrl + '/' + hazardEventId);
    },
    save: function(hazardEvent) {
      if(hazardEvent.id) {
        return $http.put(apiUrl + hazardEvent.id, hazardEvent);
      } else {
        return $http.post(apiUrl, hazardEvent);
      }
    }
  };

});
