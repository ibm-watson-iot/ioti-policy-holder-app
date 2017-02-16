/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme.components').controller('MsgCenterCtrl', MsgCenterCtrl);

  /** @ngInject */
  function MsgCenterCtrl($scope, $sce, hazardService) {

    hazardService.findAll().success(function(data) {
      $scope.hazards = data.hazardEvents;
    }).error(function(err) {
      console.error("Fetching all hazards is failed!");
    });

    $scope.users = {
      0: {
        name: 'Vlad',
      },
      1: {
        name: 'Kostya',
      },
      2: {
        name: 'Andrey',
      },
      3: {
        name: 'Nasta',
      }
    };

    $scope.notifications = [
      {
        shieldUuid: 0,
        template: '&name posted a new article.',
        time: '1 min ago'
      },
      {
        shieldUuid: 1,
        template: '&name changed his contact information.',
        time: '2 hrs ago'
      },
      {
        image: 'img/shopping-cart.svg',
        template: 'New orders received.',
        time: '5 hrs ago'
      },
      {
        shieldUuid: 2,
        template: '&name replied to your comment.',
        time: '1 day ago'
      },
      {
        shieldUuid: 3,
        template: 'Today is &name\'s birthday.',
        time: '2 days ago'
      },
      {
        image: 'img/comments.svg',
        template: 'New comments on your post.',
        time: '3 days ago'
      },
      {
        shieldUuid: 1,
        template: '&name invited you to join the event.',
        time: '1 week ago'
      }
    ];

    $scope.getMessage = function(msg) {
      var text = msg.template;
      if (msg.shieldUuid || msg.shieldUuid === 0) {
        text = text.replace('&name', '<strong>' + $scope.users[msg.shieldUuid].name + '</strong>');
      }
      return $sce.trustAsHtml(text);
    };
  }
})();
