'use strict';

angular.module('BlurAdmin.pages').controller('MainCtrl', function(
  $rootScope, $scope, authenticationService, userService) {

  $scope.isAdmin = function() {
    return authenticationService.isAdmin();
  };

});
