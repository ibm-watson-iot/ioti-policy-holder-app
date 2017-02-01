var crashMessage;

var crashShieldSafelet = function(payload) {
    var crash = false;
    if (payload.crashStatus === 2 && payload.crashIndex > 2) {
        crashMessage = 'normal but might indicate begin of crash';
        crash = true;
    }
    else if (payload.crashStatus === 3 && payload.crashIndex > 40) {
        crashMessage = 'medium crash';
        crash = true;
    } else if (payload.crashStatus === 4 && payload.crashIndex > 50) {
        crashMessage = 'massive crash';
        crash = true;
    } else {
        crash = false;
    }
    return (crash);
};

var crashShieldEntryCondition = function(payload) {
    return (payload.crashIndex && payload.crashStatus && payload.eventType);
};

var crashShieldMessage = function(payload) {
    return (constructMessage(payload, "crashShield", 'DemoHazard', 'Crash Detected, status: ' + crashMessage));
};

var crashShield = function(payload) {
    var shield = getShieldByName("crashShield");
    return (commonShield(payload, shield));
};

registerShield(<shieldID>, "crashShield", crashShieldEntryCondition, undefined, crashShieldSafelet, crashShieldMessage, 5000);
