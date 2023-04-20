const mongoose = require('mongoose');

const rentSchema = new mongoose.Schema({
    rentedcar:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "car",
    },
    rentedByUser:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },
    Datefrom: {
        type: String,
        required: [true, 'Please enter date from'],
    },
    Todate: {
        type: String,
        required: [true, 'Please enter a date '],
    },
    Active: {
        type: Boolean,
        default: true,
        required: false
    },
    Rate: {
        type: Number,
        default: 0,
        required: false
    },
    // Date:new Date(mongoose.now)
}, { timestamp: { createdAt: 'created_at' } })

module.exports = mongoose.model('rentedOrders', rentSchema)