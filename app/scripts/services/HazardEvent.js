'use strict';

angular.module('BlurAdmin.services').factory('hazardEventService', function($http, apiProtocol, apiHost, apiPath) {
  var apiUrl = apiProtocol + "://" + apiHost + apiPath + 'hazardEvent';

  return {
    me: function() {
      return $http.get(apiUrl);
    },
    find: function(hazardEventId) {
      return $http.get(apiUrl + '/byHazardId/' + hazardEventId);
    },
    findAll: function(username) {
      var url;
      if (username) {
        url = apiUrl;
      } else {
        url = apiUrl + '/all';
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
