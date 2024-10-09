const mongoose = require("mongoose");

module.exports = mongoose.model("ShelfStock", new mongoose.Schema({
    timestamp: Date,
    shelfId:   String,
    itemId:    String,
    itemCount: Number,
    minCount:  Number,
    maxCount:  Number,
    restocking: Boolean
}));