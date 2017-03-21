'use strict';

angular.module('BlurAdmin.services').factory('notificationService', function(appGUID, appRegion, clientSecret) {
  var service = {};
  var bmsPush = new BMSPush();
  var initParams = {
    "appGUID": appGUID,
    "appRegion": appRegion,
    "clientSecret": clientSecret
  };

  service.initialize = function() {
    bmsPush.initialize(initParams, function(response) {
      console.log("Push client", response.response);
    });
  };

  service.registerWithUserId = function(username) {
    // Hack for setting deviceId for bmx-push lib.
    localStorage.setItem('deviceId', username);
    bmsPush.register(function(response) {
      console.log("RegisterWithUserId:", response.response);
    });
  };

  service.unRegisterDevice = function() {
    bmsPush.unRegisterDevice(function(response) {
      console.log("UnRegisterDevice:", response.response);
    });
  };

  return service;
});
