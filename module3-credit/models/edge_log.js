const mongoose = require("mongoose");

module.exports = mongoose.model("EdgeLog", new mongoose.Schema({
    time:            Date,
    currHumidity:    Number,
    currTemperature: Number,
    currOccupied:    Boolean,
    currHVACStatus:  String,
    message:         String
}));