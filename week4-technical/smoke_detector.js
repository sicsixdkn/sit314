// smoke_detector.js
const mqtt   = require("mqtt");
const client = mqtt.connect("mqtt://broker.hivemq.com:1883");

const topic     = "/sd222177103";
let message     = "";
let smoke_level = 0;

client.on("connect", () => {
    console.log("mqtt connected");

    setInterval(function () { //loops every second.
        message = smoke_level.toString();
        client.publish(topic, message);
        console.log("published to Topic: " + topic + " with Message: " + message);
        smoke_level++;
    }, 1000);
});