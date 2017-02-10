/**
 * @author f.ulusoy
 * created on 26.01.2017
 */
(function () {
'use strict';

angular.module('BlurAdmin.pages.users').controller('UserListCtrl', UserListCtrl);

function UserListCtrl(userService) {
  var vm = this;
  vm.users = [];

  userService.findAll().success(function(data) {
    vm.users = data.users;
  }).error(function(err) {
    console.error("Fetching all users is failed!");
  });
}

})();
