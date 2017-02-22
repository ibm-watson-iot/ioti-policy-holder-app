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
var userStore = new BaseStore(config.database.userDb, config.database.credentials, logger, "user");

var timeout = 0;
var data = require( '../users.json');
var tid = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

_.each(data.users, function(newUser) {
  setTimeout(function() {
    userStore.create(tid, newUser)
    .then(function(resultUser) {
      logger.info(tid, 'then', 'User creation was successfull:', resultUser);
    })
    .catch(function(err) {
      logger.info(tid, 'catch', 'User creation was failed:', Boom.wrap(err, err.statusCode));
    });
  }, timeout);
  timeout += 500;
});
