/**
 * @author f.ulusoy
 * created on 26.01.2017
 */
(function () {
'use strict';

angular.module('BlurAdmin.pages.devices', []).config(routeConfig);

function routeConfig($stateProvider) {
  $stateProvider.state('main.device-new', {
    url: 'new-device',
    templateUrl: 'pages/devices/device-new.html',
    title: 'New Device',
    sidebarMeta: {
      icon: 'fa fa-mobile',
      order: 6,
    }
  }).state('main.devices', {
    url: 'devices',
    templateUrl: 'pages/devices/device-list.html',
    title: 'Devices',
    sidebarMeta: {
      icon: 'fa fa-mobile',
      order: 7,
    }
  });
}

})();
