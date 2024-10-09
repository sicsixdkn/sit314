const mongoose = require("mongoose");

module.exports = mongoose.model("DeliveryRequest", new mongoose.Schema({
    timestamp:  Date,
    deliveryId: String,
    orders:     [{
        orderId:   String,
        itemId:    String,
        itemCount: Number
    }]
}));