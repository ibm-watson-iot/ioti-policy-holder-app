/**
 * @author f.ulusoy
 * created on 27.01.2017
 */
(function() {
'use strict';

angular.module('BlurAdmin.services').factory('authenticationService', AuthenticationService);

function AuthenticationService(notificationService) {

  return {
    isLoggedIn: function() {
      if (localStorage.getItem('authToken')) {
        return true;
      }
      return false;
    },
    isAdmin: function() {
      if (localStorage.getItem('authToken')) {
        var user = JSON.parse(localStorage.getItem('user'));
        if (user && user.accessLevel === '1') {
          return true;
        }
      }
      return false;
    },
    getUser: function() {
      var user = JSON.parse(localStorage.getItem('user'));
      //console.info("User is fetched from localStorage.");
      return user;
    },
    setUser: function(user) {
      localStorage.setItem('user', JSON.stringify(user));
      console.info("User is saved in localStorage.");
    },
    getToken: function() {
      var token = localStorage.getItem('authToken');
      console.info("AuthToken is fetched from localStorage.");
      return token;
    },
    setToken: function(token) {
      localStorage.setItem('authToken', token);
      console.info("User is saved in localStorage.");
    },
    signOut: function() {
      localStorage.clear();
      try {
        notificationService.unRegisterDevice();
      } catch(exp) { }
    }
  };

}

})();
