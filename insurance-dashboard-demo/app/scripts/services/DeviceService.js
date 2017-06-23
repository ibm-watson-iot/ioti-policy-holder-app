'use strict';

angular.module('BlurAdmin.services').factory('deviceService', function(BaseService) {
  var service = new BaseService('devices');
  var originalFindAll = service.findAll;
  service.findAll = function (queryParams) {
    queryParams = queryParams || {};
    queryParams.userId = queryParams.userId || 'all';
    return originalFindAll.call(this, queryParams);
  };
  return service;
});
