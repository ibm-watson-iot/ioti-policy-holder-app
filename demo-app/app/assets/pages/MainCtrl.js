'use strict';

angular.module('BlurAdmin.pages').controller('MainCtrl', function(
  $rootScope, $scope, $location, $window, authenticationService, userService) {

  $scope.$on('$viewContentLoaded', function() {
    //console.log("viewContentLoaded");
  });

  $scope.isAdmin = function() {
    return authenticationService.isAdmin();
  };

  userService.me().success(function(user) {
    $rootScope.loggedInUser = user;
  }).error(function(err) {
    console.error("Fetching the loggedin user is failed.");
  });

});
