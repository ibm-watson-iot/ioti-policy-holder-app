'use strict';

/*******************************************************************************
 * Licensed Materials - Property of IBM
 * © Copyright IBM Corporation 2017. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

function BleClient(deviceServiceUuid, ioTPlatformClient, testMode) {

    var chunks = [];
    var bodylength = 0;
    var wait6Sec = false;
    var bsplit = require('buffer-split');
    var sensorID;
    var noble = require('noble');
    var constants = require('./constants');

    this.start = function() {

        console.log("start ble client");
        noble.on('stateChange', function(state) {
            console.log("state", state);
            if (state === 'poweredOn') {
                console.log('scanning...');
                noble.startScanning([deviceServiceUuid], false);
            }
            else {
                noble.stopScanning();
                console.log("Please enable the bluetooth");
            }
        });

        noble.on('discover', function(peripheral) {
            // we found a peripheral, stop scanning
            noble.stopScanning();

            console.log('found peripheral:', peripheral.advertisement);
            sensorID = peripheral.uuid;

            peripheral.connect(function(err) {
                peripheral.discoverAllServicesAndCharacteristics(function(error, services, characteristics) {
                    var indicateCharacteristic = characteristics[0];
                    var writeCharacteristic = characteristics[1];

                    // change sensor mode to 4 which means PHYD and Crash
                    writeCharacteristic.write(new Buffer([0x10, 0x16, 0x04, 0x48]), false, function(error) {
                        if (error) {
                            console.log('error changing the sensor mode, err:', error);
                        } else {
                            console.log('update sensor mode');
                        }
                    });

                    // enable notify mode for the indicate characteristic
                    indicateCharacteristic.notify(true, function(error) {
                        if (error) {
                            console.log("enabling notification failed, error", error);
                        } else {
                            console.log('notification is on for characteristic', indicateCharacteristic.uuid);
                        }
                    });

                    // enable notify mode for the write characteristic
                    writeCharacteristic.notify(true, function(error) {
                        if (error) {
                            console.log("enabling notification failed, error", error);
                        } else {
                            console.log('notification is on for characteristic', writeCharacteristic.uuid);
                        }
                    });

                    // listen for data from the write characteristic
                    writeCharacteristic.on('read', function(data, isNotification) {
                        console.log("writeCharacteristic data received", data);
                    });

                    // listen for errors from the write characteristic
                    writeCharacteristic.on('error', function(err) {
                        console.log('Error received, error:', JSON.stringify(err));
                    });

                    // listen for data from the indicate characteristic
                    indicateCharacteristic.on('read', function(data, isNotification) {
                        if (data) {
                            var buff = new Buffer(data);
                            bodylength += data.length;
                            chunks.push(buff);

                            // check if stream ended
                            if ((buff[buff.length - 1] === 0 && buff[buff.length - 2] === 0)
                                || (buff.length === 1 && buff[buff.length - 1] === 0)) {

                                // wait 6 seconds (recommended in the sensor documentation) to avoid wrong events
                                if (!wait6Sec) {
                                    wait6Sec = true;
                                    console.log('stream end');
                                    sendNotification();
                                    bodylength = 0;
                                    chunks = [];
                                    setTimeout(function() {
                                        wait6Sec = false;
                                    }, 6000);
                                }
                            }
                        }
                        else {
                            console.log('no data returned on read');
                        }
                    });

                    // listen for errors from the indicate characteristic
                    indicateCharacteristic.on('error', function(err) {
                        console.log('Error received, error:', JSON.stringify(err));
                    });
                });
            })
        });
    };

    var sendNotification = function() {
        // split the final buffer when 0x30 found
        var finalBuff = Buffer.concat(chunks);
        var delim = new Buffer([0x30]);
        var result = bsplit(finalBuff, delim);
        // the event is the last data received after the end of stream data
        var event = result[result.length - 2];
        console.log("result", result);
        console.log("event", event);

        var payload = {};
        var eventType;
        payload.rawEvent = finalBuff;
        payload.sensorID = sensorID;
        // event type has order 1 in the buffer array as per documentations
        if (event[1]) {
            eventType = Number(event[1].toString(16));
        }
        console.log("eventType is", eventType);
        // handle crash events, event type 43
        if (eventType === constants.CRASH_EVENT_TYPE) {
            if (event[4] && event[5]) {
                var crashIndex = Number(event[4]);
                var crashStatus = Number(event[5]);
                // crash event
                if (testMode) {
                    // increase value
                }
                payload.crashIndex = crashIndex;
                payload.crashStatus = crashStatus;
                payload.eventType = 'crash';
                console.log("crashStatus is", payload.crashStatus);
                console.log("crashIndex is", payload.crashIndex);
                ioTPlatformClient.publishDeviceEvent("eCall", deviceServiceUuid, "status", "json", payload, null);
            }
        } else if (eventType === constants.PHYD_EVENT_TYPE) {
            payload.eventType = 'PHYD';
            // handle drive behaviour events
            ioTPlatformClient.publishDeviceEvent("eCall", deviceServiceUuid, "status", "json", payload, null);
        }
    };
}

module.exports = BleClient;

