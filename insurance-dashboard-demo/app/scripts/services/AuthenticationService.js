/**
 * @author f.ulusoy
 * created on 27.01.2017
 */
'use strict';

angular.module('BlurAdmin.services').factory('authenticationService', function() {

  return {
    isAuthenticated: function() {
      if (localStorage.getItem('dashboardAuthToken')) {
        return true;
      }
      return false;
    },
    isAdmin: function() {
      if (localStorage.getItem('dashboardAuthToken')) {
        var user = JSON.parse(localStorage.getItem('dashboardUser'));
        if (user && user.accessLevel === '3') {
          return true;
        }
      }
      return false;
    },
    getUser: function() {
      return JSON.parse(localStorage.getItem('dashboardUser'));
    },
    setUser: function(user) {
      localStorage.setItem('dashboardUser', JSON.stringify(user));
    },
    getToken: function() {
      return localStorage.getItem('dashboardAuthToken');
    },
    setToken: function(token) {
      localStorage.setItem('dashboardAuthToken', token);
    },
    signOut: function() {
      localStorage.removeItem('dashboardUser')
      localStorage.removeItem('dashboardAuthToken');
    }
  };

});
