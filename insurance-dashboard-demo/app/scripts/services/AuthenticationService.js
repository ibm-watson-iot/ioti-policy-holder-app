/**
 * @author f.ulusoy
 * created on 27.01.2017
 */
'use strict';

angular.module('BlurAdmin.services').factory('authenticationService', function($location) {

  var tokenKey = $location.host() + '_' + $location.port() + '_' + 'dashboardAuthToken';
  var userKey = $location.host() + '_' + $location.port() + '_' + 'dashboardUser';

  return {
    isAuthenticated: function() {
      if (localStorage.getItem(tokenKey)) {
        return true;
      }
      return false;
    },
    isAdmin: function() {
      if (localStorage.getItem(tokenKey)) {
        var user = JSON.parse(localStorage.getItem(userKey));
        if (user && user.accessLevel === '3') {
          return true;
        }
      }
      return false;
    },
    getUser: function() {
      return JSON.parse(localStorage.getItem(userKey));
    },
    setUser: function(user) {
      localStorage.setItem(userKey, JSON.stringify(user));
    },
    getToken: function() {
      return localStorage.getItem(tokenKey);
    },
    setToken: function(token) {
      localStorage.setItem(tokenKey, token);
    },
    signOut: function() {
      localStorage.removeItem(userKey)
      localStorage.removeItem(tokenKey);
    }
  };

});
