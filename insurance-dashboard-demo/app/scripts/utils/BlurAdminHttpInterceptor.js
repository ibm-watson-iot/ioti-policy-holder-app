'use strict';

angular.module('BlurAdmin.utils').factory('blurAdminHttpInterceptor', function(
  $q, $location, $rootScope, apiHost, claimApiHost) {

  var tokenKey = $location.host() + '_' + $location.port() + '_' + 'dashboardAuthToken';

  return {
    request: function($config) {
      var isAPICall = $config.url.indexOf(apiHost) > 0;
      var authToken = localStorage.getItem(tokenKey);
      if (isAPICall && angular.isDefined(authToken) && !($config.url.indexOf(claimApiHost) > 0)) {
        $config.headers['Authorization'] = 'Basic ' + authToken;
      }
      return $config || $q.when($config);
    },
    response: function($config) {
      return $config;
    },
    responseError: function($config, asd) {
      var isAPICall = $config.config.url.indexOf(apiHost) > 0;
      if (isAPICall && ($config.status === 401)) {
        var originalPath = $location.path();
        if (originalPath !== "/signin") {
          authenticationService.signOut();
          $location.path("#/signin");
        }
      }
      return $q.reject($config);
    }
  };

});
