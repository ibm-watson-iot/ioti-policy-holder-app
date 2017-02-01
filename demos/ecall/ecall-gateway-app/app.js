'use strict';

/*******************************************************************************
 * Licensed Materials - Property of IBM
 * © Copyright IBM Corporation 2016. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

var when = require('when');
var IoTPlatformClient = require('./lib/IoTPlatformClient');
var BleClient = require('./lib/BleClient');

var appConfig = {
    "id": "eCallAlertsAppID",
    "type": 'shared',
    "domain": 'internetofthings.ibmcloud.com',
    "org": 'r6sunr',
    "apiKey": 'a-r6sunr-igpyaf4sez',
    "apiToken": 'p*JQd3q*TzlD1N*nAs'
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