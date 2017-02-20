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
var IoTPlatformClient = require('./lib/IoTPlatformClient');
var BleClient = require('./lib/BleClient');

var constants = require('./lib/constants');
var uuid = require( 'uuid');

var appConfig = {
	"session" : uuid.v4(),	
	"_gateway": true,
	"type": "TEP120-G",
	"id" : "iot4i-tep120-demo-g",
    "domain": 'internetofthings.ibmcloud.com',
    "org": "w9u594",
    "auth-key": "a-w9u594-rffhk6c56p",
    "auth-token": "yiDfQFtUp5zVNpF4le",
    "auth-method" : "token"
	// "org": 'r6sunr',
    // "apiKey": 'a-r6sunr-igpyaf4sez',
    // "apiToken": 'p*JQd3q*TzlD1N*nAs'
    //"org": '0vfbpa',
    //"apiKey": 'a-0vfbpa-mzjwjeq2gc',
    //"apiToken": 'u)4MgXyeAX@d)yXU0f'
};
var ioTPlatformClient = IoTPlatformClient.getInstance(appConfig);

var bleDeviceServiceUUID = '58d79b40bc2e11e4b2050002a5d5c51b';
var bleClient = new BleClient(bleDeviceServiceUUID, ioTPlatformClient, true);

ioTPlatformClient.connect()
.then(function() {
    bleClient.start();
}).catch(function(err) {
    console.error("Connection to IoTP failed, err:", err);
});

process.stdin.resume();//so the program will not close instantly

function exitHandler(options, err) {
	
	ioTPlatformClient.publishDeviceEvent( constants.IOTP.STATUS_MESSAGE, constants.IOTP.JSON_FORMAT, { status: 'disconnected', date: new Date()}, null);
	
  console.log('cleaning');
  bleClient.stop(function() {
    console.log('cleaned');
    process.exit();
  });
}

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {}));
