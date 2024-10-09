const mongoose = require("mongoose");

module.exports = mongoose.model("Stock", new mongoose.Schema({
    timestamp: Date,
    itemId:    String,
    itemCount: Number,
    minCount:  Number,
    maxCount:  Number,
    onOrder:   Boolean
}));