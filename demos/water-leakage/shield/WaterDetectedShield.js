var waterDetectedShieldSafelet = function(payload) {
    return (payload.d.states.liquidDetected.value);
};

var waterDetectedShieldEntryCondition = function(payload) {
    return (payload.d && payload.d.states && payload.d.states.liquidDetected);
};

var waterDetectedShieldMessage = function(payload) {
    return (constructMessage(payload, "waterDetectedShield", 'DemoHazard', 'Water Leakage Detected'));
};

var waterDetectedShield = function(payload) {
    var shield = getShieldByName("waterDetectedShield");
    return (commonShield(payload, shield));
};

registerShield(<shieldID>, "waterDetectedShield", waterDetectedShieldEntryCondition, undefined, waterDetectedShieldSafelet, waterDetectedShieldMessage, 5000);
