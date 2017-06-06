/**
 * @author f.ulusoy
 * created on 27.01.2017
 */
'use strict';

angular.module('BlurAdmin.services').factory('authenticationService', function(
  $http, $httpParamSerializer, $q, $location, $window, jwtHelper, userService,
  apiProtocol, apiHost, apiPath) {

  var tokenKey = $location.host() + '_' + $location.port() + '_' + 'dashboardAuthToken';
  var userKey = $location.host() + '_' + $location.port() + '_' + 'dashboardUser';
  var apiUrl = apiProtocol + '://' + apiHost + apiPath + '/'; // FIXME: tenantId
  var redirectUrl = $location.protocol() + '://' + $location.host() + ':' + $location.port();

  var authorizeCode = $q(function(resolve, reject) {
    var searchObject = $location.search();
    if (searchObject.code && searchObject.state) {
      $http({
        url: apiUrl + 'token',
        method: 'POST',
        data: $httpParamSerializer({
          code: searchObject.code,
          state: searchObject.state,
          grant_type: 'authorization_code',
          redirect_uri: redirectUrl
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded' // Note the appropriate header
        }
      }).then(function(response) {
        var token = response.data;
        localStorage.setItem(tokenKey, token.access_token);
        var authenticatedUser = jwtHelper.decodeToken(token.id_token);
        localStorage.setItem(userKey, JSON.stringify(authenticatedUser));

        userService.find(authenticatedUser.sub).success(function(user) {
        }).error(function(err, statusCode) {
          if (statusCode === 404) {
            authenticatedUser.address = {
              city: 'Munich'
            };
            userService.save(authenticatedUser).success(function(newUser) {
            }).error(function(err, statusCode) {
              console.error("Saving new user is failed.", err);
            });
          } else {
            console.error("Fetching the authenticated user is failed.", err);
          }
        });
        resolve();
      }, reject);
    } else {
      resolve(); // not a redirect from auth server, ignore
    }
  });

  return {
    authenticate: function() {
      var query = {
        response_type: 'code',
        redirect_uri: redirectUrl,
        scope: 'shields:read',
        state: 'test'
      };
      $window.location.href = apiUrl + 'authorization?' + $httpParamSerializer(query);
    },
    isAuthenticated: function() {
      return $q(function(resolve, reject) {
        authorizeCode.then(function() {
          if (localStorage.getItem(tokenKey)) {
            resolve();
          } else {
            reject();
          }
        }, reject);
      });
    },
    isAdmin: function() {
      return $q(function(resolve, reject) {
        authorizeCode.then(function() {
          if (localStorage.getItem(userKey)) {
            var user = JSON.parse(localStorage.getItem(userKey));
            if (user && user.accessLevel === '3') {
              resolve();
              return;
            }
          }
          reject();
        }, reject);
      });
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
