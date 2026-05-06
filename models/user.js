const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/
    },

    password: {
        type: String,
        required: true,
        minlength: 6
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }

}, { timestamps: true });


// HASH PASSWORD
userSchema.pre("save", async function () {

    if (!this.isModified("password")) {
        return;
    }

    this.password = await bcrypt.hash(this.password, 10);

});

module.exports = mongoose.model("User", userSchema);