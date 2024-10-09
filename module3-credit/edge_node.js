const express  = require("express");
const request  = require("request");
const app      = express();
const EdgeLog  = require("./models/edge_log");
const mongoose = require("mongoose");

const port = 3001;

const coolTemp    = 24;
const heatTemp    = 19;
const dryHumidity = 60;

let seatState       = {};
let currentTemp     = 0;
let currentHumidity = 0;
let hvacState       = "off";

const urlAirConHeat = `http://localhost:3002/airConHeat`;
const urlAirConCool = `http://localhost:3002/airConCool`;
const urlAirConDry  = `http://localhost:3002/airConDry`;
const urlAirConOff  = `http://localhost:3002/airConOff`;

// Add middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb+srv://s222177103:OPkr3ZdpGQRu0JFf@sit314.okntx.mongodb.net/?retryWrites=true&w=majority&appName=sit314");

function updateMongoDB(message) {
    const edgeLog = new EdgeLog({
        time:            Date.now(),
        currHumidity:    currentHumidity,
        currTemperature: currentTemp,
        currOccupied:    Object.values(seatState).some((seat) => seat),
        currHVACStatus:  hvacState,
        message:         message
    });

    edgeLog.save()
        .catch((err) => {
            console.error("MongoDB Error: ", err);
        });
}

function logAirSensorData(sensorId, temperature, humidity) {
    console.log(`Air sensor ${sensorId} -- Temp: ${temperature}, Hum: ${humidity}`);
    updateMongoDB(`Air sensor ${sensorId} -- Temp: ${temperature}, Hum: ${humidity}`);
}

function logSeatData(seatId, occupied) {
    console.log(`Seat Sensor ${seatId} -- Occupied: ${occupied}`);
    updateMongoDB(`Seat Sensor ${seatId} -- Occupied: ${occupied}`);
}

function logHVACStateChange(state) {
    if (state !== "No change") {
        console.log(`HVAC State Change: ${state}`);
        updateMongoDB(`HVAC State Change: ${state}`);
    }
}

const requestPromise = require("util").promisify(request);

async function setAirConState() {
    // Check if any seat is occupied
    const anySeatOccupied = Object.values(seatState).some((seat) => seat);

    let url = null;

    // Set air conditioner state based on conditions
    if (!anySeatOccupied) {
        console.log("NO SEAT OCCUPIED -- Requesting OFF");
        url = urlAirConOff;
    } else if (currentTemp > coolTemp) {
        console.log("TEMP HIGH -- Requesting COOL");
        url = urlAirConCool;
    } else if (currentTemp < heatTemp) {
        console.log("TEMP LOW -- Requesting HEAT");
        url = urlAirConHeat;
    } else if (currentHumidity > dryHumidity) {
        console.log("HUMIDITY HIGH -- Requesting DRY");
        url = urlAirConDry;
    } else {
        console.log("CONDITIONS GOOD -- Requesting OFF");
        url = urlAirConOff;
    }

    // Make request to HVAC node to set air conditioner state using the selected URL
    if (url) {
        try {
            const response = await requestPromise({
                url:    url,
                method: "PUT",
                json:   true
            });

            // Return the state of the air conditioner from the response body
            return response.body.state;
        } catch (err) {
            console.error("Error: ", err);
            throw err;
        }
    }

    return null;
}

app.put("/airSensorData", async function (req, res) {
    const data = req.body;

    // Update current temperature and humidity
    currentTemp     = data.temperature;
    currentHumidity = data.humidity;
    res.sendStatus(200);

    // Logs air sensor data to console and writes to MongoDB
    logAirSensorData(data.id, data.temperature, data.humidity);

    try {
        // Set air conditioner state based on current conditions, the state change is returned
        const state = await setAirConState();
        // Logs the state change to console and writes to MongoDB
        logHVACStateChange(state);
    } catch (err) {
        console.error("Failed to set air conditioner state:", err);
    }
});

app.put("/seatSensorData", function (req, res) {
    const data = req.body;

    // Update seat state for the seat with the given ID
    seatState[data.id] = data.occupied;
    res.sendStatus(200);

    // Logs seat data to console and writes to MongoDB
    logSeatData(data.id, data.occupied);
});

app.listen(port, () => {
    console.log(`Edge Node listening on port ${port}`);
});
