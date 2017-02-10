'use strict';

angular.module('BlurAdmin.services').factory('notificationService', function() {
  var service = {};
  var bmsPush = new BMSPush();
  var initParams = {
    "appGUID": "0fb99bcf-b441-41fc-850b-d3bdf348055a",
    "appRegion": ".eu-gb.bluemix.net",
    "clientSecret": "71bb4ac6-63e2-4020-97ed-1f952d281ba2"
  };

  service.initialize = function() {
    bmsPush.initialize(initParams, function(response) {
      console.log("Push client", response.response);
    });
  };

  service.registerWithUserId = function(username) {
    bmsPush.registerWithUserId(username, function(response) {
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
