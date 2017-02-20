A gateway to get the events from the Bosch ecall sensor and publish it to IoTP

# Connection
Besides the actual bluetooth connection, there is also a connection protocol with the TEP120 device. For setting up the mode of the TEP120 and to do calibration the device needs to be in a connected state. See below code snippet from BleClient.js for the initialization data. 0x10 is the message event, 0x26 the length of the complete message, 'mode' is the wanted mode (see specification for details) and the 0x47 is for connecting as a guest user (0x48 should be used for main user).  
`var init = [0x10, 0x26, mode, 0x47];`  
`var account_id = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];`  
`var tgic_company_id = [0x00, 0x00, 0x00, 0x00];`  
`var registration_date = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];`  
`var phone_id = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];`    
Using all zeros seems to work but in most cases the TEP120 will respond with a connection reject. Protocol however supports connecting as a guest user 5 seconds after the rejection unless the main user connects during that time, so this application will automatically try to reconnect after that time. Once that is done the device will start sending watchdog events.  
There is also a separate mode (setup 0x09) for user management that could result in a better scheme for connection but nothing has been tested so far in this area.

## Selecting the wanted TEP120 device
In the lib/BleClient.js file, there is a section with the current TEP120 devices that we have. Uncomment the one from this code to pick one specific device. If left set to null, the first one found during discovery will be used.  
`var PERIPHERAL_NAME = null;`  
`//var PERIPHERAL_NAME = 'UMS iPhone 652'; // The red car`  
`//var PERIPHERAL_NAME = 'UMS iPhone 65A'; // The yellow race car`  
`//var PERIPHERAL_NAME = 'UMS iPhone 64A'; // The yellow buggy`

# Watchdog events
When in connected state, the TEP120 will send watchdog events as a heart beat. This needs to happen from the application as well or the TEP120 will disconnect. A watchdog event is being sent every 10 seconds from this application.

# Calibration
For PHYD events to be sent, the TEP120 needs to be in a calibrated state (calibration_flag set to 0x01 as part of calibration events)  
For calibration events to be sent, an initialization message needs to be sent with all zeros:  
`var PHYD_CALIBRATION_INITIALIZATION = [0x30, 0x19, 0x56, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];`  
Calibration will be done when the vehicle is being stopped/started, and an event would be sent back from the TEP120 when this happens. Once the TEP120 decides there is enough valid calibration data (5-10 vectors) the calibration_flag will be set to 0x01.  
It's the application's responsibility to store the calibration data since the TEP120 does not store this itself. This application will store the calibration data into two files named 'calibration &lt;device local name&gt;.txt' and 'calibration &lt;device local name&gt; 2nd.txt' where the latter is for the last two vectors. These are being sent back in a second message and also needs to be sent in two messages when sending them to the TEP120. If these files does not exist when the application is being started, the calibration initialization message will be sent instead. If they exist this data will be sent to the TEP120 so calibration does not have to start from the beginning again.

# Crash Message structure (also see [the specification](TEP120-BTspecification_v1.4.pdf))

## Bytes Explanation:
- <0x30> Retain = false | Type = PUBLISH | Duplicated = false | QoS = LOW
- <0x05> Length of following message
- <0x43> (‘C’) Crash
- <EVENT_ID> ID of crash event
- <CNT> Number of message in crash event
- <CI> Crash Index (0-100)
- <CS> Crash Status (0-4)

## Crash severity Index:
- CS CI[2] Description
- 0 TBD. no crash
- 1 2
- 2 > 2 normal vehicle behavior left (might indicate begin of crash)
- 3 > 40 medium crash
- 4 > 50 massive crash


# Driving Event Messages
As seen in the application overview figure there are two new modes - PHYD Mode 0x03 and Combined Mode 0x04. If TEP120 is calibrated
properly and ABC-driving events are detected, the following PHYD Event message is transmitted to the connected the Smartphone:

## Byte Explanation
- <0x30> Retain=false | Type=PUBLISH | Duplicated=false | QoS=LOW
- <0x03> length of following message
- <0x50> ('P') Pay how you drive event message
- <EVENT_TYPE> Type of PHYD event
- <EVENT_HEAVINESS> Heaviness of PHYD event (one byte, integer 0-255)

## Encoding of Event Type:
Event Type Byte
- No Event 0x00
- Heavy Braking 0x01
- Heavy Speed Up 0x02
- Heavy Lateral Speed Up Right 0x03
- Heavy Lateral Speed Up Left 0x04
