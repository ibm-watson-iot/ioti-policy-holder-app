'use strict';

/*******************************************************************************
 * Licensed Materials - Property of IBM
 * © Copyright IBM Corporation 2017. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

var when = require('when');
var Boom = require('boom');
var _ = require('lodash');

var logger = require('./utils/Logger.js');
var BaseStore = require('./stores/BaseStore.js');

var config = require( './config.js');
var shieldStore = new BaseStore(config.database.shieldDb, config.database.credentials, logger, "shield");
var jscodeStore = new BaseStore(config.database.jscodeDb, config.database.credentials, logger, "jscode");

var timeout = 0;
var data = require( '../shields.json');
var tid = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

_.each(data.shields, function(newShieldInfo) {
  setTimeout(function() {
    shieldStore.create(tid, newShieldInfo.shield)
    .then(function(resultShield) {
      logger.info(tid, 'then', 'Shield creation was successfull:', resultShield);
      jscodeStore.create(tid, newShieldInfo.jscode)
      .then(function(resultJscode) {
        logger.info(tid, 'then', 'Jscode creation was successfull:', resultJscode);
      })
      .catch(function(err) {
        logger.info(tid, 'catch', 'Jscode creation was failed:', Boom.wrap(err, err.statusCode));
      });
    })
    .catch(function(err) {
      logger.info(tid, 'catch', 'Shield creation was failed:', Boom.wrap(err, err.statusCode));
    });
  }, timeout);
  timeout += 500;
});
