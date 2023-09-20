const mongoose = require("mongoose");

const contactSchema = mongoose.Schema(
    {
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        name: {
            type: String,
            require: [true, "Please provide your Name"]
        },
        email: {
            type: String,
            require: [true, "Please provide your Email"]
        }
    },
    {
        timestamps: true,

    }
);

module.exports = mongoose.model("contact", contactSchema);