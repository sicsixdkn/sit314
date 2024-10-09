const mongoose = require("mongoose");

module.exports = mongoose.model("TemperatureReading", new mongoose.Schema({
    location:    String,
    temperature: Number,
    timestamp:   Date
}));