const mongoose = require("mongoose");

module.exports = mongoose.model("DeliveryTruck", new mongoose.Schema({
    truckId:     String,
    timestamp:   Date,
    current_gps: {latitude: Number, longitude: Number},
    deliveryId:  String
}));