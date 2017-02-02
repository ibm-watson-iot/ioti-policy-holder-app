'use strict';

angular.module('BlurAdmin.pages').controller('MainCtrl', function(
  $rootScope, $scope, $location, $window, $translate, authenticationService, userService) {

  $scope.$on('$viewContentLoaded', function() {
    //console.log("viewContentLoaded");
  });

  $rootScope.currentLanguage = 'tr';

  $scope.changeLanguage = function(key) {
    $rootScope.currentLanguage = key;
  };

  $scope.changeLanguage($scope.currentLanguage);

  $rootScope.$watch('currentLanguage', function(newValue, oldValue) {
    if (newValue) {
      $translate.use(newValue);
    }
  });

  $scope.isAdmin = function() {
    return authenticationService.isAdmin();
  };

  userService.me().success(function(user) {
    $rootScope.loggedInUser = user;
  }).error(function(err) {
    console.error("Fetching the loggedin user is failed.");
  });

}).config(function($translateProvider) {

  // $translateProvider.useStaticFilesLoader({
  //   prefix: '/translations/',
  //   suffix: '.json'
  // });
  //
  // $translateProvider.preferredLanguage('en');

});
