const request = require("request");

const urlSeatSensorData = `http://localhost:3001/seatSensorData`;

// Get the sensor ID from command line arguments
const sensorId = process.argv[2];

if (!sensorId) {
    console.error("Please provide a sensor ID as a command line argument.");
    process.exit(1);
}

// Generate seat sensor data every few seconds
setInterval(seatSensor, 3000);

function seatSensor() {
    // Generate random seat state
    const occupied = Math.random() < 0.5;

    // Create seat sensor data object
    const seatSensorData = {
        id:       sensorId,
        name:     `Seat Sensor ${sensorId}`,
        time:     Date.now(),
        occupied: occupied
    };

    console.log(seatSensorData);

    // Send seat sensor data to edge node
    request({
        url:     urlSeatSensorData,
        method:  "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body:    JSON.stringify(seatSensorData)
    }, function (err, response, body) {
        if (err) {
            console.log("Error: ", err);
        }
    });
}