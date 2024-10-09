// check_and_alarm.js

// Constants for the sensor type and trigger values
const heatTrigger = 60;
const smokeTrigger = 75;
const fireTrigger = 50;

// Get the global sensor data or create an empty object if it doesn't exist
let sensorData = flow.get('sensorData') || {};

// Variables to store trigger counts
let heatTriggerCount = 0;
let smokeTriggerCount = 0;
let fireTriggerCount = 0;

// Loop through each sensors data
for (let sensorId in sensorData) {
    // Get the sensor readings
    let readings = sensorData[sensorId];
    // Check if any of the trigger values are exceeded and increment the trigger count
    if (readings.heat > heatTrigger) {
        heatTriggerCount++;
    }
    if (readings.smoke > smokeTrigger) {
        smokeTriggerCount++;
    }
    if (readings.fire > fireTrigger) {
        fireTriggerCount++;
    }
}

// Check if any of triggers have fired twice
if (heatTriggerCount >= 2 || smokeTriggerCount >= 2 || fireTriggerCount >= 2) {
    // A fire has been detected, send customised alert messages to different topics
    return [
        { payload: 'WARNING: Fire detected, please evacuate your home as soon as possible!', topic: '/s222177103/fire/alerts/homeowners' },
        { payload: 'WARNING: Fire detected, please evacuate your home as soon as possible!', topic: '/s222177103/fire/alerts/social_media' },
        { payload: `Fire detected! Readings: Heat: ${heatTriggerCount}, Smoke: ${smokeTriggerCount}, Fire: ${fireTriggerCount}`, topic: '/s222177103/fire/alerts/fireservice' },
        { payload: 'WARNING: Fire has been detected, please provide alerts', topic: '/s222177103/fire/alerts/news' }
    ];
}