(function() {
  'use strict';

  angular.module('BlurAdmin.pages.claims', []).config(routeConfig);

  function routeConfig($stateProvider) {
    $stateProvider.state('main.claims', {
      url: 'claims',
      templateUrl: 'pages/claims/claim-list.html',
      title: 'Claims',
      sidebarMeta: {
        icon: 'fa fa-bolt',
        order: 4
      }
    }).state('main.claim-view', {
      url: 'claims/:claimId',
      templateUrl: 'pages/claims/claim-view.html',
      title: 'View Claim'
    }).state('main.claim-add', {
      url: 'claims/add/:username',
      templateUrl: 'pages/claims/claim-add.html',
      title: 'Add Claim'
    });
  }

})();
