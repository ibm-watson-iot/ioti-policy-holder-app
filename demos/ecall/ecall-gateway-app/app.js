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

var appConfig = {
    "id": "eCallAlertsAppID",
    "type": 'shared',
    "domain": 'internetofthings.ibmcloud.com',
    "org": 'r6sunr',
    "apiKey": 'a-r6sunr-igpyaf4sez',
    "apiToken": 'p*JQd3q*TzlD1N*nAs'
    // "org": '0vfbpa',
    // "apiKey": 'a-0vfbpa-mzjwjeq2gc',
    // "apiToken": 'u)4MgXyeAX@d)yXU0f'
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
    if (options.cleanup) {
      console.log('clean');
      bleClient.stop();
    }
    if (err) console.log(err.stack);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
