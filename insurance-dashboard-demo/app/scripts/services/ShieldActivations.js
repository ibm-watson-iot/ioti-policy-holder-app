'use strict';

angular.module('BlurAdmin.services').factory('shieldActivationService', function(BaseService) {
  var service = new BaseService('shield-activations');
  var originalFindAll = service.findAll;
  service.findAll = function (queryParams) {
    queryParams = queryParams || {};
    queryParams.userId = queryParams.userId || 'all';
    return originalFindAll.call(this, queryParams);
  };
  return service;
});
