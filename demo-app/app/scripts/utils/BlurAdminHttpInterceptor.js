'use strict';

angular.module('BlurAdmin.pages').factory('blurAdminHttpInterceptor', function($q, $location, $rootScope) {

  return {
    request: function($config) {
      var isRestCall = $config.url.indexOf('api') > 0;
      if (angular.isDefined(localStorage.getItem('authToken'))) {
        $config.headers['Authorization'] = 'Basic ' + localStorage.getItem('authToken');
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
          localStorage.removeItem('user');
          localStorage.removeItem('authToken');
          $location.path("/signin");
        }
      }
      return $q.reject($config);
    }
  };

});
