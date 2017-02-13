'use strict';

/*******************************************************************************
 * Licensed Materials - Property of IBM
 * © Copyright IBM Corporation 2016. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

var express = require('express');
var bodyParser = require('body-parser');

var logger = require('./utils/Logger');
var messages = require('./utils/messages.js');
var ClaimEndpoint = require('./apis/ClaimEndpoint');


var props = {
  appInfo: {},
  appPort: 4000,
  appHost: 'localhost',
  dbCredentials: undefined,
  claimsDbName: 'claims'
};

var config = require('./appConfig.js').getConfig(props);

process.on('uncaughtException', function (err) {
  var uuidV4 = require('uuid/v4');
  var errorId = uuidV4();
  logger.error('uncaughtException', messages.uncaught_error, errorId, err.stack);
  logger.error('uncaughtException', "Error %s %j", errorId, err);
});

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
  next();
});

var apiRouter = express.Router();
app.use('/api/v1', apiRouter);

var claimEndpoint = new ClaimEndpoint(config, logger, apiRouter);

var server = app.listen(config.appPort, function () {
  var host = server.address().address;
  host = (host === '::' ? 'localhost' : host);
  var port = server.address().port;
  logger.info('listen', 'Backend is running at', host, port);
});