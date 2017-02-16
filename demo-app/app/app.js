/**
 * @author f.ulusoy
 * created on 27.01.2017
 */
'use strict';

angular.module('BlurAdmin', [
  'uuid',
  'toastr',
  'ngTouch',
  'ngJsTree',
  'ngAnimate',
  'xeditable',
  'smart-table',
  'ui.router',
  'ui.sortable',
  'ui.bootstrap',
  'ui.slimscroll',
  'angular-progress-button-styles',

  'permission',
  'permission.ui',

  'BlurAdmin.utils',
  'BlurAdmin.services',
  'BlurAdmin.theme',
  'BlurAdmin.pages'
])
.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

  $httpProvider.interceptors.push('blurAdminHttpInterceptor');

})
.run(function($rootScope, $state, editableOptions, editableThemes,
  PermRoleStore, authenticationService, notificationService, userService) {

    // xeditable theme
    editableOptions.theme = 'bs3';
    editableThemes.bs3.inputClass = 'input-sm';

    PermRoleStore.defineRole('AUTHORIZED', function() {
      return authenticationService.isAuthenticated();
    });

    PermRoleStore.defineRole('ADMIN', function() {
      return authenticationService.isAdmin();
    });

    if (authenticationService.isAuthenticated()) {
      $rootScope.loggedInUser = authenticationService.getUser();
      if (!$rootScope.loggedInUser) {
        userService.me().success(function(user) {
          $rootScope.loggedInUser = user;
          notificationService.registerWithUserId(user.username);
        }).error(function(err) {
          console.error("Fetching the loggedin user is failed.");
        });
      }
    }

    $rootScope.$on('$stateChangeStart', function(event, toState, params) {
      if (toState.redirectTo) {
        event.preventDefault();
        $state.go(toState.redirectTo, params, { location: 'replace' });
      }
    });
});
