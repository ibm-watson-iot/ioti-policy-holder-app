'use strict';

/*******************************************************************************
 * Licensed Materials - Property of IBM
 * © Copyright IBM Corporation 2017. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

var IoTPlatformClient = require('./lib/IoTPlatformClient');
var request = require('request');
var when = require('when');

var appConfig = {
    'id': 'valveControlAppID',
    'type': 'shared',
    'domain': 'internetofthings.ibmcloud.com',
    'org': 'f2msp0',
    'apiKey': 'a-f2msp0-sqjdzop1no',
    'apiToken': 'k_JLN@)p5hu)1dTpUs'
};
var gatewayConfigs = {
    'valveDeviceID': '0196EA1F',
    'gatewayUrl': 'http://192.168.1.100:8080',
    'apiCredentials': {
        username: 'user',
        password: 'user'
    },
    'closeValveBody': {
        'state': {
            'functions': [
                {
                    'key': 'valve',
                    'value': 'close'
                }
            ]
        }
    }
};
var ioTPlatformClient = IoTPlatformClient.getInstance(appConfig);

ioTPlatformClient.connect().then(function() {
    ioTPlatformClient.subscribeToDeviceCommands().then(function() {
        ioTPlatformClient.processDeviceCommands(processCommand);
    });
});

var processCommand = function(type, id, commandName, commandFormat, payload, topic) {
    // console.log(type, id, commandName, commandFormat, payload, topic);
    var commandPayload = JSON.parse(payload);
    if (commandPayload && commandPayload.type === 'hazard' && commandPayload.shieldUUID === 'waterDetectedShield') {
        closeValve().then(function() {
            console.log("Valve closed successfully !");
        }).catch(function(error) {
            console.log("Failed to close the valve, error: " + error);
        });
    }
};

var closeValve = function() {
    return when.promise(function(resolve, reject) {
        request({
                url: gatewayConfigs.gatewayUrl + '/devices/' + gatewayConfigs.valveDeviceID + '/state',
                method: 'PUT',
                json: true,
                body: gatewayConfigs.closeValveBody,
                auth: gatewayConfigs.apiCredentials
            },
            function(error, response, body) {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
    });
};