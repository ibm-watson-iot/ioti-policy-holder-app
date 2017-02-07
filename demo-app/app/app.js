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
.run(function($rootScope, $state, $location, editableOptions, editableThemes,
  PermRoleStore, authenticationService, notificationService, userService) {

    // xeditable theme
    editableOptions.theme = 'bs3';
    editableThemes.bs3.inputClass = 'input-sm';

    PermRoleStore.defineRole('AUTHORIZED', function() {
      return authenticationService.isLoggedIn();
    });

    PermRoleStore.defineRole('ADMIN', function() {
      return authenticationService.isAdmin();
    });

    var originalPath = $location.path();
    // Try getting valid user with existing token or go to login page.
    var authToken = authenticationService.getToken();
    if (!authToken) {
        if (originalPath !== "/signin") {
            $location.path("/signin");
        }
    } else {
        $rootScope.authToken = authToken;
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
        $state.go(toState.redirectTo, params, {
            location: 'replace'
        });
      }
      if (toState.name !== 'signin') {
        if (authenticationService.getToken()) {
          $rootScope.loggedInUser = authenticationService.getUser();
          if (!$rootScope.loggedInUser) {
            userService.me().success(function(user) {
              $rootScope.loggedInUser = user;
              notificationService.registerWithUserId(user.username);
            }).error(function(err) {
              console.error("Fetching the loggedin user is failed.");
            });
          }
        } else if ((toState.name !== 'signup') && (toState.name !== 'confirm') && (toState.name !== 'forgotpwd')) {
          $state.go('signin');
          event.preventDefault();
        }
      }
    });
})
.constant('apiProtocol', 'https')
.constant('apiHost', 'iot4insurance-api-393b0bf3-830a-4065-a906-50ef7fa967e4.eu-gb.mybluemix.net')
.constant('apiPath', '/');
