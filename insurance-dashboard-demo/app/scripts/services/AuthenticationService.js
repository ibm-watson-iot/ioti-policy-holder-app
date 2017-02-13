/**
 * @author f.ulusoy
 * created on 27.01.2017
 */
(function() {
'use strict';

angular.module('BlurAdmin.services').factory('authenticationService', AuthenticationService);

function AuthenticationService() {

  return {
    isLoggedIn: function() {
      if (localStorage.getItem('dashboardAuthToken')) {
        return true;
      }
      return false;
    },
    isAdmin: function() {
      if (localStorage.getItem('dashboardAuthToken')) {
        var user = JSON.parse(localStorage.getItem('dashboardUser'));
        if (user && user.accessLevel === '1') {
          return true;
        }
      }
      return false;
    },
    getUser: function() {
      var user = JSON.parse(localStorage.getItem('dashboardUser'));
      //console.info("User is fetched from localStorage.");
      return user;
    },
    setUser: function(user) {
      localStorage.setItem('dashboardUser', JSON.stringify(user));
      console.info("User is saved in localStorage.");
    },
    getToken: function() {
      var token = localStorage.getItem('dashboardAuthToken');
      console.info("AuthToken is fetched from localStorage.");
      return token;
    },
    setToken: function(token) {
      localStorage.setItem('dashboardAuthToken', token);
      console.info("User is saved in localStorage.");
    },
    signOut: function() {
      localStorage.clear();
    }
  };

}

})();
