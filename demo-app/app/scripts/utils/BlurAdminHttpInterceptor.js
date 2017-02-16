'use strict';

angular.module('BlurAdmin.utils').factory('blurAdminHttpInterceptor',
function($q, $location, authenticationService, apiHost) {

  return {
    request: function($config) {
      var isAPICall = $config.url.indexOf(apiHost) > 0;
      var authToken = localStorage.getItem('authToken');
      if (isAPICall && angular.isDefined(authToken)) {
        $config.headers['Authorization'] = 'Basic ' + authToken;
      }
      return $config || $q.when($config);
    },
    response: function($config) {
      return $config;
    },
    responseError: function($config) {
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
