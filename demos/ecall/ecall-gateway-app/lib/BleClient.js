'use strict';

/*******************************************************************************
 * Licensed Materials - Property of IBM
 * © Copyright IBM Corporation 2017. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
var fs = require('fs');
var async = require('async');

// Change if a specific device is wanted
var PERIPHERAL_NAME = null;
//var PERIPHERAL_NAME = 'UMS iPhone 652'; // The red car
//var PERIPHERAL_NAME = 'UMS iPhone 65A'; // The yellow race car
//var PERIPHERAL_NAME = 'UMS iPhone 64A'; // The yellow buggy

var MODE = 0x03; // PHYD only
var calibrationDone = false;

var PHYD_CALIBRATION_INITIALIZATION = [0x30, 0x19, 0x56, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
var PHYD_CALIBRATION_BUFFER = new Buffer(PHYD_CALIBRATION_INITIALIZATION);

var expect2ndCalibrationMessage = false;

function BleClient(deviceServiceUuid, ioTPlatformClient, testMode) {

    var mainBuffer = new Buffer([]);
    var timer = null;
    var sensorID;
    var noble = require('noble');
    var constants = require('./constants');
    var connectedPeripheral = null;

    this.start = function() {

        noble.on('warning', function(message) {
          console.warn(message);
        });

        var startScanning = function() {
          console.log('scanning...');
          noble.startScanning([deviceServiceUuid], false);
        };

        console.log("start ble client");
        if (noble.state === 'poweredOn') {
          startScanning();
        } else {
          noble.on('stateChange', function(state) {
              console.log("state", state);
              if (state === 'poweredOn') {
                startScanning();
              }
              else {
                  noble.stopScanning();
                  console.log("Please enable the bluetooth");
              }
          });
        }

        var self = this;
        noble.on('discover', function(peripheral) {
            console.log('found peripheral:', peripheral.advertisement);

            if (PERIPHERAL_NAME && peripheral.advertisement.localName !== PERIPHERAL_NAME) {
              // not the device we want, continue searching
              return;
            }

            peripheral.on('disconnect', function() {
              console.log("Peripheral disconnected.");
              self.connectedPeripheral = null;
            });

            var ensureConnected = function(peripheral, cb) {
              var callback = function(err) {
                  if (err) {
                    console.error("Error connecting: %j", err.toString());
                    peripheral.disconnect();
                    return;
                  }

                  console.log("Peripheral connected");

                  peripheral.discoverAllServicesAndCharacteristics(function(error, services, characteristics) {

                    var indicateCharacteristic = null;
                    var writeCharacteristic = null;
                      characteristics.forEach(function(characteristic) {
                        if (characteristic.properties[0] === 'write') {
                          writeCharacteristic = characteristic;
                        } else if (characteristic.properties[0] === 'indicate') {
                          indicateCharacteristic = characteristic;
                        }
                      });

                      cb(indicateCharacteristic, writeCharacteristic);
                  });
              };
              if (self.connectedPeripheral) {
                callback();
              } else {
                peripheral.connect(callback);
              }
            };

            var getCalibrationFileName = function(peripheral, secondary) {
              var name = "calibration " + peripheral.advertisement.localName;
              if (secondary) {
                name += " 2nd";
              }
              name += ".txt";
              return name;
            };

            var establishConnection = function() {
              ensureConnected(peripheral, function(indicateCharacteristic, writeCharacteristic) {
                self.connectedPeripheral = peripheral;

                console.log("Establishing conncetion");

                function calibratePhyd(cb) {
                  // Load calibration data
                  try {
                    var buffer = fs.readFileSync(getCalibrationFileName(peripheral, false));
                    console.log("Buffer data: %s", buffer.toString('hex'));
                    sendMessage(buffer, function() {
                      console.log("Sent primary calibration data");
                      try {
                        buffer = fs.readFileSync(getCalibrationFileName(peripheral, true));
                        sendMessage(buffer, function() {
                          console.log("Sent secondary calibration data");
                          cb();
                        });
                      } catch (e) {
                        // no second file exists? Ignore
                        console.log("No secondary calibration data");
                        cb();
                      }
                    });
                    calibrationDone = true;
                  } catch (e) {
                    // file does not exist? Ignore
                  }

                  if (!calibrationDone) {
                    sendMessage(PHYD_CALIBRATION_BUFFER, function() {
                      console.log('Calibration initialization message sent');
                      cb();
                    });
                  }
                }

                function connection(mode, cb) {
                  var init = [0x10, 0x26, mode, 0x47];
                  var account_id = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
                  var tgic_company_id = [0x00, 0x00, 0x00, 0x00];
                  var registration_date = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
                  var phone_id = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
                  var buffer = new Buffer(init.concat(account_id, tgic_company_id, registration_date, phone_id));
                  sendMessage(buffer, function(error) {
                      if (error) {
                        console.log('error connecting, err:', error);
                      } else {
                        console.log("Connect sequence written");
                      }
                  });
                }

                // enable notify mode for the indicate characteristic
                indicateCharacteristic.notify(true, function(error) {
                    if (error) {
                        console.log("enabling notification failed, error", error);
                    } else {
                        console.log('notification is on for indicate characteristic', indicateCharacteristic.uuid);

                        // connect to device
                        connection(MODE, function() {

                        });
                    }
                });

                function puback_response() {
                  writeCharacteristic.write(new Buffer([0x40, 0x01, 0x00]), false, function(error) {
                    if (error) {
                      console.error("Error sending puback: %j", error);
                    } else {
                      console.log("Sent puback");
                    }
                  });
                }

                function sendMessage(buffer, callback) {
                  var LENGTH = 12;

                  var sets = Math.trunc(buffer.length / LENGTH);
                  if (buffer.length % LENGTH > 0) {
                    sets++;
                  }
                  var f = function(newBuffer, cb) {
                    writeCharacteristic.write(newBuffer, false, function(error) {
                      if (error) {
                        console.error("Error sending burst: %j", error);
                      } else {
                        //console.log("Sent burst");
                      }
                      cb(error);
                    });
                  };
                  var buffers = [];
                  for (var i = 0; i < sets; i++) {
                    var length = LENGTH;
                    if (i*LENGTH + LENGTH > buffer.length) {
                      length = buffer.length - i*LENGTH;
                    }
                    var newBuffer = buffer.slice(LENGTH*i, LENGTH*i + length);
                    buffers.push(newBuffer);
                  }
                  async.eachSeries(buffers, function(buffer, cb) {
                    f(buffer, cb);
                  }, function(err) {
                    callback(err);
                  });
                }

                function publish(message, length) {
                  var event = message[0];
                  switch (event) {
                    case constants.CRASH_EVENT_TYPE:
                      puback_response(); // Respond with a puback?
                      if (message.length !== 5) {
                        console.error("Unexpected length of crash event message: %j", message);
                      }
                      var crashEventId = message[1];
                      var numberOfMessage = message[2];
                      var crashIndex = message[3];
                      var crashStatus = message[4];
                      switch (crashStatus) {
                        case 0:
                          console.log("Crash event %d number %d: No crash.", crashEventId, numberOfMessage);
                          break;
                        case 1:
                          console.log("Crash event %d number %d: Normal vehicle behavior left (might indicate begin of crash). Index %d", crashEventId, numberOfMessage, crashIndex);
                          break;
                        case 2:
                          console.log("Crash event %d number %d: Medium crash. Index %d", crashEventId, numberOfMessage, crashIndex);
                          break;
                        case 3:
                          console.log("Crash event %d number %d: Massive crash. Index %d", crashEventId, numberOfMessage, crashIndex);
                          break;
                        default:
                          console.log("Crash event %d number %d: Unxpected crash status. Status: %d, Index %d", crashEventId, numberOfMessage, crashStatus, crashIndex);
                      }
                      sendNotification({
                        crashIndex: crashIndex,
                        crashStatus: crashStatus,
                        eventType: constants.IOTP.CRASH_MESSAGE
                      }, message);
                      break;
                    case constants.PHYD_EVENT_TYPE:
                      if (message.length !== 3) {
                        console.error("Unexpected length of phyd message: %j", message);
                      }
                      var phydEvent = message[1];
                      var heaviness = message[2];
                      switch (phydEvent) {
                        case 0x00:
                          console.log("PHYD event. No event. Heaviness: %d", heaviness);
                          break;
                        case 0x01:
                          console.log("PHYD event. Heavy breaking. Heaviness: %d", heaviness);
                          break;
                        case 0x02:
                          console.log("PHYD event. Heavy speed up. Heaviness: %d", heaviness);
                          break;
                        case 0x03:
                          console.log("PHYD event. Heavy lateral Speed Up Right. Heaviness: %d", heaviness);
                          break;
                        case 0x04:
                          console.log("PHYD event. Heavy lateral Speed Up Left. Heaviness: %d", heaviness);
                          break;
                        default:
                          console.error("Unexpected PHYD event. Message: %j", message);
                      }
                      sendNotification({
                        eventType: constants.IOTP.PHYD_MESSAGE,
                        phydEvent: phydEvent,
                        heaviness: heaviness
                      }, message);
                      break;
                    case constants.PHYD_CALIBRATION_EVENT_TYPE:
                      if (expect2ndCalibrationMessage) {
                        // Handling the special 2nd event
                        expect2ndCalibrationMessage = false;
                        fs.writeFile(getCalibrationFileName(peripheral, true), newBuffer, function(err) {
                          if (err) {
                            console.error("Failed to write secondary calibration file: %j", err);
                          } else {
                            console.log("Wrote secondary calibration file");
                          }
                        });
                        return;
                      }

                      var gravity = message.slice(1, 13).toString('hex');
                      var longitude = message.slice(13, 25).toString('hex');
                      var calibrationFlag = message[25];
                      var nbrVectors = message[26];
                      var vectors = [];
                      console.log("Gravity: %s, longitude: %s, calibrationFlag: %d, nbrVectors: %d", gravity, longitude, calibrationFlag, nbrVectors);
                      // for (var i = 0; i < nbrVectors; i++) {
                      //   //var index = message[27 + i*13];
                      //   var vector = message.slice(27 + i*12, 39 + i*12).toString('hex');
                      //   console.log("Vector: %s", vector);
                      // }

                      var newBuffer = Buffer.concat([new Buffer([0x30, message.length]), message]);
                      //newBuffer[27] = 0x01; // set calibration flag

                      if (length === 255) {
                        // A 2nd calibration message is expected to come next
                        expect2ndCalibrationMessage = true;
                        console.log("Expecting secondary calibration message");
                      }
                      if (nbrVectors > 0) {
                        fs.writeFile(getCalibrationFileName(peripheral, false), newBuffer, function(err) {
                          if (err) {
                            console.error("Failed to write calibration file: %j", err);
                          } else {
                            console.log("Wrote calibration file");
                          }
                        });

                        // If not already set to calibration, do it now
                        // if (!calibrationDone) {
                        //   calibrationDone = true;
                        //   sendMessage(newBuffer, function() {
                        //     console.log("Sent calibration");
                        //   });
                        // }
                      }

                      sendNotification({
                    	  nbrVectors: nbrVectors,
                    	  calibrationFlag: calibrationFlag,
                          eventType: constants.IOTP.CALIB_MESSAGE
                        }, message);

                      break;
                    default:
                      console.error("Unknown publish message");
                  }
                }

                function messageReceived(event, message, length) {
                  if (event === constants.CONNECTION_RESPONSE_MESSAGE) {
                    response(message);
                  } else if (event === constants.PUBLISH_MESSAGE) {
                    publish(message, length);
                  } else if (event === constants.PUBACK_MESSAGE) {
                    puback(message);
                  } else if (event === constants.WATCHDOG_MESSAGE) {
                    watchdog(message);
                  } else {
                    console.error("Unexpected message. Event %d. Message: %j", event, message);
                  }
                }

                function response(message) {
                  if (message.length !== 12) {
                    console.error("Unexpected message length of connection response event");
                  }
                  var status = message[0];
                  var rc = message[1];
                  var rcMeaning = connectionReturnCodeMeaning(rc);
                  var uid = message.slice(2, 8).toString('hex');
                  var hw_ver = message[8];
                  var sw_ver_maj = message[9];
                  var sw_ver_min = message[10];
                  var protocolVer = message[11];
                  console.log("Connection response. Status: %d, Return code: %d (%s), MAC adress: %j, Hardware version: %d, Software version: %d.%d, Protocol version %d", status, rc, rcMeaning, uid, hw_ver, sw_ver_maj, sw_ver_min, protocolVer);
                  if (rc === 0x00) {
                    // We are running. Start sending watchdog events
                    var sendWatchdog = function() {
                      writeCharacteristic.write(new Buffer([0xC0, 0x00]), false, function(error) {
                        if (error) {
                          console.error("Error sending watchdog event: %j", error);
                        } else {
                          //console.log("Sent watchdog");
                        }
                      });
                      setTimeout(sendWatchdog, 10000); // 10s
                    };

                    ioTPlatformClient.publishDeviceEvent( constants.IOTP.STATUS_MESSAGE, constants.IOTP.JSON_FORMAT, { status: 'connected', date: new Date()}, null);

                    // Do calibration, then start sending watchdog events
                    calibratePhyd(function() {
                      sendWatchdog();
                    });
                  } else if (rc === 0x04) {
                    // This is a reject. We're retrying after 5 sec. Guest users would be allowed this way given that the main user does not connect during that timer
                    setTimeout(function() {
                      establishConnection();
                    }, 5000);
                  }
                }

                function dataInput(data, isNotification) {
                    if (data) {
                      // Reset timer
                      if (timer) {
                        clearTimeout(timer);
                        timer = null;
                      }
                      mainBuffer = Buffer.concat([mainBuffer, new Buffer(data)]);
                      var event = mainBuffer[0];
                      var length = mainBuffer[1];
                      if (length === 0) {
                        length = 256;
                      }
                      var setTimer = true;
                      if (mainBuffer.length >= length + 2) {
                        var message = mainBuffer.slice(2, length + 2);
                        messageReceived(event, message, length);
                        if (mainBuffer.length > length + 2) {
                          mainBuffer = mainBuffer.slice(length + 2);
                        } else {
                          mainBuffer = new Buffer([]);
                          setTimer = false;
                        }
                      }
                      // 6 second wait to clean main buffer
                      if (setTimer) {
                        timer = setTimeout(function() {
                          console.warn("Missed data: %j", mainBuffer);
                          mainBuffer = new Buffer([]);
                        }, 6000); // wait 6 seconds (recommended in the sensor documentation) to avoid wrong events
                      }
                    }
                    else {
                        console.log('no data returned on read');
                    }
                  }

                // listen for data from the indicate characteristic
                indicateCharacteristic.on('data', dataInput);
                indicateCharacteristic.on('read', dataInput);

                // listen for errors from the indicate characteristic
                indicateCharacteristic.on('error', function(err) {
                    console.log('Error received, error:', JSON.stringify(err));
                });

              });
            };

            // we found a peripheral, stop scanning
            sensorID = peripheral.uuid;
            var self = this;
            noble.stopScanning(function() {

              establishConnection();
          });
        });
    };

    this.stop = function(cb) {
      if (this.connectedPeripheral) {
        this.connectedPeripheral.disconnect(function() {
          cb();
        });
      } else {
        cb();
      }
    };


    function puback(message) {
      var rc = message[0];
      if (message.length !== 1) {
        console.error("Unexpected length of PUBACK message");
      }
      switch (rc) {
        case 0x00:
          console.log("PUBACK: normal/success");
          break;
        case 0xF1:
          console.log("PUBACK: Setup action in normal mode initiated");
          break;
        case 0xF0:
          console.log("PUBACK: Not authorized");
          break;
        case 0xED:
          console.log("PUBACK: Unknown error");
          break;
        default:
          console.log("PUBACK: Unknown error code");
      }
    }

    function watchdog(message) {
      if (message.length !== 1) {
        console.error("Unexpected message length of watchdog event");
      }
      var status = message[0];
      if (status & 0x10) {
        var error = "Error: ";
        // error code
        if (status & 0x01) {
          error += "The Bluetooth chip in the TEP 120 is no longer working properly. ";
        }
        if (status & 0x02) {
          error += "The 3-axis sensor in the TEP120 delivers implausible values. ";
        }
        if (status & 0x04) {
          error += "The accelerometer in TEP120 is no longer working properly. ";
        }
        if (status & 0x08) {
          error += "An error has occurred with the internal memory of the TEP120. ";
        }
        if (status & 0x20) {
          error += "A memory overflow has occurred in the TEP120. ";
        }
        if (status & 0x40) {
          error += "A system error has caused a restart of theTEP120. Please disconnect the connector from the power supply and then reconnect. If the error occurs again, the connector must be sent for repair.";
        }
        console.log("Watchdog status: %d. %s", status, error);
      }
    }

    function connectionReturnCodeMeaning(rc) {
      switch (rc) {
        case 0x00:
          return "User has reinstalled the app and re-registers the TEP120 OR Normal connection of an app with an enabled account";
        case 0x01:
          return "User has changed the smartphone and re-registers the TEP120";
        case 0x02:
          return "User registers with its existing app with another AccountID";
        case 0x03:
          return "Users registers on the same smartphone with a new app (other insurance) with a new account.";
        case 0x04:
          return "A connect attempt by a known iPhone is rejected";
        case 0xFE:
          return "User has successfully registered an app of another insurance on the same smartphone. Now the first connection with the old app takes place, which has not been disabled by the insurance company. This scenario can also occur with guest users, if the guest user account did not receive an erase-PUSH";
        case 0xFD:
          return "Connector if full";
        case 0xFC:
          return "First ever user who wants to register connector is a guest user and the sensor still does not have a main user.";
        case 0xFB:
          return "Main user memory space is occupied and a second main user tries to connect";
        case 0xFF:
          return "TEP120 functional test unsuccessful";
        default:
          return "Unknown return code!";
      }
    }

    var sendNotification = function(payload, message) {
      payload.sensorID = sensorID;
      payload.rawEvent = message;
      ioTPlatformClient.publishDeviceEvent( payload.eventType, constants.IOTP.JSON_FORMAT, payload, null);
    };
}

module.exports = BleClient;
