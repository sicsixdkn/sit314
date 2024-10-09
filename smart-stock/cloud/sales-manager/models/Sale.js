const mongoose = require('mongoose');

module.exports = mongoose.model('Sale', new mongoose.Schema({
    timestamp: Date,
    checkoutId: String,
    trolleyId: String,
    itemCount: Number,
    items: []
}));