//smoke_alarm.js
const mqtt   = require("mqtt");
const client = mqtt.connect("mqtt://broker.hivemq.com:1883");

const topic = "/sa222177103";

client.on("connect", () => {
    client.subscribe(topic);
    console.log("mqtt connected");
});

client.on("message", (topic, message) => {
    console.log("Smoke Alert");
});