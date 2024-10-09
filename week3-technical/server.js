// server.js
const mqtt = require("mqtt");

// Connect to the broker
const client = mqtt.connect("mqtt://broker.hivemq.com:1883");

// Topic to subscribe to
const topic = "/ijukol";

// Callback for when the mqtt client is connected to the broker
client.on("connect", () => {
    // Subscribe to the topic
    client.subscribe(topic);
    // Log that the mqtt client is connected
    console.log("mqtt connected");
});

// Callback for when the mqtt client receives a message
client.on("message", (topic, message) => {
    // Log the topic and message
    console.log("Topic is: " + topic);
    console.log("Message is: " + message);
});