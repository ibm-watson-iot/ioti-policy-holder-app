A gateway to get the events from the Bosch ecall sensor and publish it to IoTP

# Crash Message structure

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