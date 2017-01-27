/**
 * @author f.ulusoy
 * created on 26.01.2017
 */
(function () {
'use strict';

angular.module('BlurAdmin.pages.hazards', []).config(routeConfig);

function routeConfig($stateProvider) {
  $stateProvider.state('main.hazard-new', {
    url: 'new-hazard',
    templateUrl: 'pages/hazards/hazard-new.html',
    title: 'New Hazard',
    sidebarMeta: {
      icon: 'fa fa-bolt',
      order: 4,
    }
  }).state('main.hazards', {
    url: 'hazards',
    templateUrl: 'pages/hazards/hazard-list.html',
    title: 'Hazards',
    sidebarMeta: {
      icon: 'fa fa-bolt',
      order: 5,
    }
  });
}

})();
