const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
    player: {
        type: String,
        required: true
    },
    opponent: {
        type: String,
        required: true
    },
    score: {
        type: String,
        default: "0-0"
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