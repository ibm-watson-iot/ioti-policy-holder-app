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
var iotClient = require('ibmiotf');

var messages = require('./messages.js');

IoTPlatformClient.getInstance = function (appConfig) {
    return new IoTPlatformClient(appConfig);
};

function IoTPlatformClient(appConfig) {

    var appClientConfig = {
        "id": appConfig.id,
        "type": appConfig.type,
        "domain": appConfig.domain,
        "org": appConfig.org,
        "auth-key": appConfig.apiKey,
        "auth-token": appConfig.apiToken
    };
   
    var iotfAppClient = new iotClient.IotfApplication(appClientConfig);

    this.connect = function () {
        return when.promise(function (resolve, reject) {
            try {
                iotfAppClient.connect();

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

    this.publishDeviceEvent = function (deviceType, deviceId, eventType, eventFormat, payload, qos) {
        try {
            iotfAppClient.publishDeviceEvent(deviceType, deviceId, eventType, eventFormat, payload);
        } catch (err) {
            console.error(messages.iotp_publish_failed, err, deviceId);
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
            console.log("already disconnected");
        }
    };

    this.processDeviceEvents = function (informSubscriber) {
        iotfAppClient.on("deviceEvent", function (deviceType, deviceId, eventType, format, payload) {
            informSubscriber(deviceType, deviceId, eventType, format, payload);
        });
    };

}

module.exports = IoTPlatformClient;

