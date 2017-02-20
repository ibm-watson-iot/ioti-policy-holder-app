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
var iotClient = require('ibmiotf');

var messages = require('./messages.js');

IoTPlatformClient.getInstance = function (appConfig) {
    return new IoTPlatformClient(appConfig);
};

function IoTPlatformClient(appConfig) {

    var clientConfig = appConfig;
   
    var iotfAppClient = clientConfig._gateway ? new iotClient.IotfApplication( clientConfig) :	new iotClient.IotfDevice( clientConfig);

    this.connect = function () {
        return when.promise(function (resolve, reject) {
            try {
            	iotfAppClient.connect();
            	
            	// iotfAppClient.log.setLevel('debug');

            	iotfAppClient.on("connect", function () {
                    console.log(messages.iotP_connected);
                    resolve();
                });
            	iotfAppClient.on("error", function (err) {
                    console.error(messages.iotP_uncaught_error, err);
                    reject(err);
                });
            } catch (err) {
                console.error(messages.iotP_connection_failed, err.message);
                reject(err);
            }
        });
    };

    this.publishDeviceEvent = function ( eventType, eventFormat, payload, qos) {
        try {
        	// console.log('Sending %s to %s/%s',eventType, clientConfig.type, clientConfig.id);
        	
        	payload.session = clientConfig.session;
        	
        	if ( clientConfig._gateway) {
        		iotfAppClient.publishDeviceEvent( clientConfig.type, clientConfig.id, eventType, eventFormat, payload);
        	} else {
        		iotfAppClient.publish(eventType, eventFormat, payload);
        	}
        } catch (err) {
            console.error(messages.iotp_publish_failed, err, clientConfig.id);
        }
    };

    this.subscribeToEvents = function () {
        return when.promise(function (resolve, reject) {
            try {
           		iotfAppClient.subscribeToDeviceEvents();
                resolve();
            } catch (err) {
                console.error(messages.subscribe_to_events_failed);
                reject(err);
            }
        });
    };

    this.disconnect = function () {
        try {
        	iotfAppClient.disconnect();
        } catch (err) {
            console.log("Error disconnecting iot client: %s", err);
        }
    };

    this.processDeviceEvents = function (informSubscriber) {
    	iotfDeviceClient.on("deviceEvent", function (deviceType, deviceId, eventType, format, payload) {
            informSubscriber(deviceType, deviceId, eventType, format, payload);
        });
    };

}

module.exports = IoTPlatformClient;

