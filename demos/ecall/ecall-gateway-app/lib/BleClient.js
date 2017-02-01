'use strict';

/*******************************************************************************
 * Licensed Materials - Property of IBM
 * © Copyright IBM Corporation 2016. All Rights Reserved.
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

    this.start = function() {
        var noble = require('noble');
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

                    writeCharacteristic.write(new Buffer([0x10, 0x16, 0x04, 0x48]), false, function(error) {
                        if (error) {
                            console.log('error changing the sensor mode, err:', error);
                        } else {
                            console.log('update sensor mode');
                        }
                    });

                    indicateCharacteristic.notify(true, function(error) {
                        if (error) {
                            console.log("enabling notification failed, error", error);
                        } else {
                            console.log('notification is on for characteristic', indicateCharacteristic.uuid);
                        }
                    });

                    writeCharacteristic.notify(true, function(error) {
                        if (error) {
                            console.log("enabling notification failed, error", error);
                        } else {
                            console.log('notification is on for characteristic', writeCharacteristic.uuid);
                        }
                    });

                    writeCharacteristic.on('read', function(data, isNotification) {
                        console.log("writeCharacteristic data received", data);
                    });

                    writeCharacteristic.on('error', function(err) {
                        console.log('Error received, error:', JSON.stringify(err));
                    });

                    indicateCharacteristic.on('read', function(data, isNotification) {
                        if (data) {
                            var buff = new Buffer(data);

                            bodylength += data.length;
                            chunks.push(buff);

                            // check if stream ended
                            if ((buff[buff.length - 1] === 0 && buff[buff.length - 2] === 0)
                                || (buff.length === 1 && buff[buff.length - 1] === 0)) {

                                if (!wait6Sec) {
                                    wait6Sec = true;
                                    console.log('stream end');
                                    //console.log('chunks are ', chunks);
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

                    indicateCharacteristic.on('error', function(err) {
                        console.log('Error received, error:', JSON.stringify(err));
                    });
                });
            })
        });

    };

    var sendNotification = function() {

        var finalBuff = Buffer.concat(chunks);

        var delim = new Buffer([0x30]);

        var result = bsplit(finalBuff, delim);

        var event = result[result.length - 2];

        console.log("result", result);

        console.log("event", event);

        var payload = {};
        var eventType;
        payload.rawEvent = finalBuff;
        payload.sensorID = sensorID;
        if (event[1]) {
            eventType = Number(event[1].toString(16));
        }
        else {
            eventType = 0;
        }
        console.log("eventType is", eventType);
        if (eventType === 43) {
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

        } else if (eventType === 50) {
            payload.eventType = 'PAYD';
            // handle drive behaviour events
            ioTPlatformClient.publishDeviceEvent("eCall", deviceServiceUuid, "status", "json", payload, null);
        }

    };

}

module.exports = BleClient;

