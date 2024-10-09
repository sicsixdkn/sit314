const mongoose = require("mongoose");

module.exports = mongoose.model("Order", new mongoose.Schema({
    timestamp: Date,
    orderId:   String,
    itemId:    String,
    itemCount: Number
}));