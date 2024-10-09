// sensor.js
const mqtt   = require('mqtt');
const client = mqtt.connect("mqtt://broker.hivemq.com:1883");

// Create a random sensor ID between 1 and 999
const sensorId  = Math.floor(Math.random() * 999) + 1;
// Set the topic using the sensor ID
const topic     = `/s222177103/fire/sensor/${sensorId}`;

client.on('connect', () => {
    console.log(`Sensor ${sensorId} connected to MQTT`);

    // Publish sensor data every second
    setInterval(function () {
        // Generate random sensor data for heat, smoke, and fire - converted to a JSON string
        const msg = JSON.stringify({
            heat: Math.floor(Math.random() * 100),
            smoke: Math.floor(Math.random() * 100),
            fire: Math.floor(Math.random() * 100)
        });
        // Publish the sensor data to the topic
        client.publish(topic, JSON.stringify(msg));
        console.log("Published to Topic: " + topic + " with Message: " + msg);
    }, 1000);
});
