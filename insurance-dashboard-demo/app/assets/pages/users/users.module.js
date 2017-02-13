/**
 * @author f.ulusoy
 * created on 26.01.2017
 */
(function () {
'use strict';

angular.module('BlurAdmin.pages.users', []).config(routeConfig);

function routeConfig($stateProvider) {
  $stateProvider.state('main.users', {
    url: 'users',
    templateUrl: 'pages/users/user-list.html',
    title: 'Users',
    sidebarMeta: {
      icon: 'fa fa-bolt',
      order: 5
    }
  }).state('main.user-view', {
    url: 'users/:username',
    templateUrl: 'pages/users/user-view.html',
    title: 'View User'
  }).state('main.user-shield-view', {
    url: 'users/shields/:shieldId',
    templateUrl: 'pages/users/user-shield-view.html',
    title: 'View User Shield'
  }).state('main.user-device-view', {
    url: 'users/devices/:deviceId',
    templateUrl: 'pages/users/user-device-view.html',
    title: 'View User Device'
  });
}

})();
