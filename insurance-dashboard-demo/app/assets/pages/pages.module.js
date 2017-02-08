/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages', [
    'ui.router',
    'BlurAdmin.pages.main',
    'BlurAdmin.pages.dashboard',
    'BlurAdmin.pages.profile',
    'BlurAdmin.pages.maps',

    'BlurAdmin.pages.shields',
    'BlurAdmin.pages.hazards',
    'BlurAdmin.pages.devices'
  ]).config(routeConfig);

  /** @ngInject */
  function routeConfig($urlRouterProvider, baSidebarServiceProvider) {
    $urlRouterProvider.otherwise('/');
  }

})();
