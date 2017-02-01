/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
'use strict';

angular.module('BlurAdmin.pages.profile').controller('ProfilePageCtrl', ProfilePageCtrl);

/** @ngInject */
function ProfilePageCtrl($scope, $filter, $uibModal, fileReader, toastr, userService) {

  var isFullnameChanged = false;
  var isEmailChanged = false;
  var isPhoneNumberChanged = false;

  $scope.phoneNumbers = [ "+4917672246110", "+4915207145469" ];

  userService.me().success(function(user) {
    $scope.user = user;

    $scope.$watch('user.fullname', function(newValue, oldValue) {
      if (newValue && (oldValue !== newValue)) {
        isFullnameChanged = true;
      }
    });

    $scope.$watch('user.email', function(newValue, oldValue) {
      if (newValue && (oldValue !== newValue)) {
        isEmailChanged = true;
      }
    });

    $scope.$watch('user.phoneNumber', function(newValue, oldValue) {
      if (newValue && (oldValue !== newValue)) {
        isPhoneNumberChanged = true;
      }
    });

  }).error(function(err) {
    console.error("Fetching the user is failed.");
  });

  function updateAttribute(attributeName, newValue) {
    userService.updateAttribute($scope.user.username, attributeName, newValue).success(function(data) {
      toastr.success(null, "Updating profile is successful.");
    }).error(function(err) {
      toastr.error("Updating profile is failed!", "Error");
    });
  }

  $scope.saveUser = function() {
    if (isFullnameChanged) {
      updateAttribute('fullname', $scope.user.fullname);
    }
    if (isEmailChanged) {
      updateAttribute('email', $scope.user.email);
    }
    if (isPhoneNumberChanged) {
      updateAttribute('phoneNumber', $scope.user.phoneNumber);
    }
  };


  $scope.picture = $filter('profilePicture')('Nasta');

  $scope.removePicture = function () {
    $scope.picture = $filter('appImage')('theme/no-photo.png');
    $scope.noPicture = true;
  };

  $scope.uploadPicture = function () {
    var fileInput = document.getElementById('uploadFile');
    fileInput.click();
  };

  $scope.showModal = function (item) {
    $uibModal.open({
      animation: false,
      controller: 'ProfileModalCtrl',
      templateUrl: 'pages/profile/profileModal.html'
    }).result.then(function (link) {
        item.href = link;
      });
  };

  $scope.getFile = function () {
    fileReader.readAsDataUrl($scope.file, $scope).then(function(result) {
      $scope.picture = result;
    });
  };

}

})();
