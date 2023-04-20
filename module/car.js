const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    vehicleModel: {
        type: String,
        required: true
    },
    vehicleNumber: {
        type: String,
        required: true,
    },
    carName: {
        type: String,
    },
    seatingCapacity: {
        type: String,
        required: true,
    },
    Location: {
        type: String,
    },
    carOwner: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    Availability: {
        type: String,
        default: "Available",
        enum: ["Not Available", "Available"]
    },
    avatar: {
        public_id: {
            type: String,
            required: false,
        },
        url: {
            type: String,
            required: false,
        },
    },
    rentPerDay: {
        type: String,
        required: true
    }


}, { timestamp: true })

module.exports = mongoose.model('car', userSchema)

