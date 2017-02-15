(function() {
'use strict';

angular.module('BlurAdmin.pages.login').controller('LoginCtrl', LoginCtrl);

function LoginCtrl($rootScope, $scope, $state, $http, toastr,
  authenticationService, notificationService, userService) {

  var vm = this;
  vm.user = {
    email: '',
    password: ''
  };

  vm.signIn = function() {
    var authToken = btoa(vm.user.email + ":" + vm.user.password);
    authenticationService.setToken(authToken);

    userService.me().success(function(user) {
      $rootScope.loggedInUser = user;
      authenticationService.setUser(user);

      $rootScope.authToken = authToken;
      authenticationService.setToken(authToken);

      try {
        notificationService.initialize();
        notificationService.registerWithUserId(user.username);
      } catch(exp) {
        toastr.error("You are using unsupported browser for notifications.");
      }

      $state.go('main.dashboard');
    }).error(function(err) {
      console.error("Signin is failed.");
      toastr.error("Signin is failed.", 'Error');
    });

  };

  vm.signUp = function() {

    userService.signUp(vm.user.email, vm.user.password, function(err, result) {
      if (err) {
        console.error('Signing up is failed for', vm.user.email);
        toastr.error(err.message, 'Error');
        if (err.code === "UsernameExistsException") {
          $state.go('confirm');
        }
      } else {
        var cognitoUser = result.user;
        console.log('Signing up is successfull', vm.user.email);
        $state.go('confirm');
      }
    });
  };

  vm.confirm = function() {
    var userData = {
      username: vm.email
    };

    userService.confirmRegistration(vm.confirmationCode, true, function(err, result) {
      if (err) {
        console.error('Confirmation is failed for user', vm.email);
        toastr.error(err.message, 'Error');
      } else {
        console.log('Confirmation is successfull for user', vm.email);
        toastr.success(null, 'Success');
        $state.go('signin');
      }
    });
  };

  vm.forgot = function() {
    var userData = {
      username: vm.email
    };

    userService.forgotPassword({
      onSuccess: function(result) {
        toastr.success(null, 'Success');
        $state.go('signin');
      },
      onFailure: function(err) {
        toastr.error(err.message, 'Error');
      },
      inputVerificationCode: function() {
        var verificationCode = prompt('Please input verification code ', '');
        var newPassword = prompt('Enter new password ', '');
        cognitoUser.confirmPassword(verificationCode, newPassword, this);
      }
    });
  };

}

})();
