const express            = require("express");
const mongoose           = require("mongoose");
const weather            = require("weather-js");
const TemperatureReading = require("./models/TemperatureReading");

const app  = express();
const port = 3010;

app.use(express.json());

// Connect to MongoDB
const serverAddress = "mongodb+srv://s222177103:OPkr3ZdpGQRu0JFf@sit314.okntx.mongodb.net/?retryWrites=true&w=majority&appName=sit314";
mongoose.connect(serverAddress).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log(err);
});

// POST request to add a new temperature reading
app.post("/api/weather", (req, res) => {
    const {temperature, location} = req.body;

    if (!temperature || !location) {
        return res.status(400).json({message: "Temperature and location are required"});
    }

    const temperatureReading = new TemperatureReading({
        location:    req.body.location,
        temperature: req.body.temperature,
        timestamp:   new Date()
    });

    // Save the new temperature reading to the database
    temperatureReading.save().then((result) => {
        res.json(result);
    }).catch((err) => {
        console.log(err);
        res.status(500).json({message: err.message});
    });
});

// GET request to get the latest temperature reading
app.get("/api/weather/latest", (req, res) => {
    // Find the latest temperature reading, sort by timestamp in descending order
    TemperatureReading.findOne().sort({timestamp: -1}).then((result) => {
        res.json(result);
    }).catch((err) => {
        console.log(err);
        res.status(500).json({message: err.message});
    });
});

// PUT request to update a temperature reading by ID
app.put("/api/weather/:id", (req, res) => {
    const {temperature, location} = req.body;

    if (!temperature || !location) {
        return res.status(400).json({message: "Temperature and location are required"});
    }

    // Find the temperature reading by ID and update it
    TemperatureReading.findByIdAndUpdate(req.params.id, {
        location:    req.body.location,
        temperature: req.body.temperature,
        timestamp:   new Date()
    }, {new: true}).then((result) => {
        res.json(result);
    }).catch((err) => {
        console.log(err);
        res.status(500).json({message: err.message});
    });
});

// DELETE request to delete a temperature reading by ID
app.delete("/api/weather/:id", (req, res) => {
    // Find the temperature reading by ID and delete it
    TemperatureReading.findByIdAndDelete(req.params.id).then((result) => {
        res.json(result);
    }).catch((err) => {
        console.log(err);
        res.status(500).json({message: err.message});
    });
});

// GET request to get weather for a location
app.get("/api/weather/location/:location", (req, res) => {
    // Use the weather-js library to get the weather for the specified location
    weather.find({search: req.params.location, degreeType: "C"}, function (err, result) {
        if (err) {
            console.log(err);
            return res.status(500).json({message: err.message});
        }
        res.json(result[0]);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});