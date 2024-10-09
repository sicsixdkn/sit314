const request = require("request");

const urlAirSensorData = `http://localhost:3001/airSensorData`;

const minHumidity    = 10;
const maxHumidity    = 100;
const minTemperature = 15;
const maxTemperature = 27;

// Generate air sensor data every second
setInterval(airSensor, 1000);

function airSensor() {
    // Generate random humidity and temperature
    const humidity    = Math.floor(Math.random() * (maxHumidity - minHumidity) + minHumidity);
    const temperature = Math.floor(Math.random() * (maxTemperature - minTemperature) + minTemperature);

    // Create air sensor data object
    const airSensorData = {
        id:          1,
        name:        `Air Sensor 1`,
        time:        Date.now(),
        humidity:    humidity,
        temperature: temperature
    };

    console.log(airSensorData);

    // Send air sensor data to edge node
    request({
        url: urlAirSensorData,
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body:  JSON.stringify(airSensorData)
    }, function (err, response, body) {
        if (err) {
            console.log("Error: ", err);
        }
    });
}
