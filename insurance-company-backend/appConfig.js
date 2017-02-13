'use strict';

/*******************************************************************************
 * Licensed Materials - Property of IBM
 * © Copyright IBM Corporation 2016. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/


function BackendConfig(requiredProperties) {
  var self = this;

  // First read required properties from the defaults
  for (var p in requiredProperties) {
    if (requiredProperties.hasOwnProperty(p)) {
      self[p] = requiredProperties[p];
    }
  }

  // Override any property from the environment
  if (process.env.VCAP_APPLICATION) {
    self.appInfo = JSON.parse(process.env.VCAP_APPLICATION);
  }
  if (process.env.VCAP_APPLICATION) {
    self.appPort = process.env.PORT || 8080;
    self.appHost = '0.0.0.0';
  }

  var vcapServices;
  if (process.env.VCAP_SERVICES) {
    vcapServices = JSON.parse(process.env.VCAP_SERVICES);
  } else {
    var config = require('./config.json');
    vcapServices = config.services;
  }
  if (vcapServices["cloudantNoSQLDB"] && vcapServices["cloudantNoSQLDB"][0]) {
    self.dbCredentials = vcapServices["cloudantNoSQLDB"][0].credentials;
  }

  validate();

  function validate() {
    // confirm that all required properties are now set
    var valid = true;
    for (var p in requiredProperties) {
      if (requiredProperties.hasOwnProperty(p) && self[p] === undefined) {
        console.error('Required property', p, 'still not set');
        valid = false;
      }
    }
    if (!valid) {
      process.exit(-1);
    }
  }

}

/**
 * @param requiredProperties: object with a property for each required property, mapped to a default value or undefined.
 *
 * example:
 * requiredProps = {
 *        'appPort': 8080,
 *        'appHost': 'localhost',
 *        'dbCrendentials': undefined
 * }
 */
BackendConfig.getConfig = function (requiredProperties) {
  // In local testing of isolated components, it's convenient to use local-vcap.json file
  // However, in a real deployment, the config is read from environment values.
  return new BackendConfig(requiredProperties);
};

module.exports = BackendConfig;

