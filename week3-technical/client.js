// client.js
const mqtt = require("mqtt");

// Connect to the broker
const client = mqtt.connect("mqtt://broker.hivemq.com:1883");

// Topic to publish to, and message to publish
const topic   = "/ijukol";
const message = "My message";

// Callback for when the mqtt client is connected to the broker
client.on("connect", () => {
    // Log that the client is connected
    console.log("mqtt connected");
    // Publish to the topic
    client.publish(topic, message);
    // Log that the message was published
    console.log("published to Topic: " + topic + " with Message: " + message);
});