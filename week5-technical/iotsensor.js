const mongoose = require("mongoose");
const Sensor   = require("./models/sensor");

// Set up a timer to generate and save sensor data every second
setInterval(sensorTest, 1000);

function sensorTest() {
    // Get the current time
    let startTime = Date.now();
    mongoose.connect("mongodb+srv://s222177103:OPkr3ZdpGQRu0JFf@sit314.okntx.mongodb.net/?retryWrites=true&w=majority&appName=sit314");

    const low  = 10;
    const high = 40;

    // Generate sensor data with random temperature
    const sensordata = {
        id:          0,
        name:        "temperaturesensor",
        address:     "221 Burwood Hwy, Burwood VIC 3125",
        time:        Date.now(),
        temperature: Math.floor(Math.random() * (high - low) + low)
    };

    // Convert the sensor data to a new Sensor document
    const newSensor = new Sensor({
        id:          sensordata.id,
        name:        sensordata.name,
        address:     sensordata.address,
        time:        sensordata.time,
        temperature: sensordata.temperature
    });

    // Save the new Sensor document to the database
    newSensor.save().then(doc => {
        // Print the total time taken
        console.log(`${Date.now() - startTime} milliseconds`);
        // Print the saved document
        // console.log(doc);
    });
}

