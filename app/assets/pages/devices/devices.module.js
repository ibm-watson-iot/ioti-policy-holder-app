/**
 * @author f.ulusoy
 * created on 26.01.2017
 */
(function () {
'use strict';

angular.module('BlurAdmin.pages.devices', []).config(routeConfig);

function routeConfig($stateProvider) {
  $stateProvider.state('main.devices', {
    url: 'devices',
    templateUrl: 'pages/devices/device-list.html',
    title: 'Devices',
    sidebarMeta: {
      icon: 'fa fa-mobile',
      order: 5,
    }
  }).state('main.device-edit', {
    url: 'device/:deviceId',
    templateUrl: 'pages/devices/device-edit.html',
    title: 'Device'
  });
}

})();
