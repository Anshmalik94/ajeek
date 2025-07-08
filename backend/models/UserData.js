    const mongoose = require("mongoose");

    const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    mobile: String,
    course: String,
    status: {
        verified: { type: Boolean, default: false },
        approved: { type: Boolean, default: false }
    }
    }, { timestamps: true });

    module.exports = mongoose.model("UserData", userSchema);
