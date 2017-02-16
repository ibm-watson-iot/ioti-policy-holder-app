/**
 * @author f.ulusoy
 * created on 27.01.2017
 */
'use strict';

angular.module('BlurAdmin.services').factory('authenticationService', function(notificationService) {

  return {
    isAuthenticated: function() {
      if (localStorage.getItem('authToken')) {
        return true;
      }
      return false;
    },
    isAdmin: function() {
      if (localStorage.getItem('authToken')) {
        var user = JSON.parse(localStorage.getItem('user'));
        if (user && user.accessLevel === '3') {
          return true;
        }
      }
      return false;
    },
    getUser: function() {
      return JSON.parse(localStorage.getItem('user'));
    },
    setUser: function(user) {
      localStorage.setItem('user', JSON.stringify(user));
    },
    getToken: function() {
      return localStorage.getItem('authToken');
    },
    setToken: function(token) {
      localStorage.setItem('authToken', token);
    },
    signOut: function() {
      localStorage.removeItem('user')
      localStorage.removeItem('authToken');
      try {
        notificationService.unRegisterDevice();
      } catch(exp) { }
    }
  };

});
