'use strict';

angular.module('BlurAdmin.utils').factory('blurAdminHttpInterceptor', function($q, $location, $rootScope, claimApiHost) {

  return {
    request: function($config) {
      var isRestCall = $config.url.indexOf('api') > 0;
      if (angular.isDefined(localStorage.getItem('dashboardAuthToken')) && !($config.url.indexOf(claimApiHost) > 0)) {
        $config.headers['Authorization'] = 'Basic ' + localStorage.getItem('dashboardAuthToken');
      }

      return $config || $q.when($config);
    },
    response: function($config) {
      return $config;
    },
    responseError: function($config, asd) {
      var isRestCall = $config.config.url.indexOf('api') > 0;
      if (isRestCall && ($config.status === 401 || $config.status === -1)) {
        var originalPath = $location.path();
        if (originalPath !== "/signin") {
          localStorage.removeItem('dashboardUser');
          localStorage.removeItem('dashboardAuthToken');
          $location.path("/signin");
        }
      }
      return $q.reject($config);
    }
  };

});
