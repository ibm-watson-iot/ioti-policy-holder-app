/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme.components')
      .directive('pageTop', pageTop);

  /** @ngInject */
  function pageTop($state, authenticationService) {
    return {
      restrict: 'E',
      templateUrl: 'theme/components/pageTop/pageTop.html',
      link: function (scope, element, attrs) {
          scope.signOut = function() {
              authenticationService.signOut();
              $state.go('signin');
          };
      }
    };
  }

})();
