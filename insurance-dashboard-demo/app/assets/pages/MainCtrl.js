'use strict';

angular.module('BlurAdmin.pages').controller('MainCtrl', function(
  $rootScope, $scope, authenticationService) {

  $scope.isAdmin = function() {
    return authenticationService.isAdmin();
  };

});
