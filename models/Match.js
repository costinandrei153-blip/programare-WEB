const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({

    player: {
        type: String,
        required: true,
        minlength: 2
    },

    opponent: {
        type: String,
        required: true,
        minlength: 2
    },

    score: {
        type: String,
        default: "0-0"
    },

    tournament: {
        type: String,
        enum: ["ATP", "WTA", "Grand Slam"],
        default: "ATP"
    },

    rounds: {
        type: Number,
        min: 1,
        max: 5,
        default: 3
    },

    isFinished: {
        type: Boolean,
        default: false
    },

    matchDate: {
        type: Date,
        default: Date.now
    },

    status: {
        type: String,
        enum: ["live", "finished"],
        default: "live"
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

}, { timestamps: true });

module.exports = mongoose.model("Match", matchSchema);