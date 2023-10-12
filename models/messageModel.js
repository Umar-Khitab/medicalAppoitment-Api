const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
    {

        sender_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        reciever_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: "User",
            default: null
        },
        message: {
            type: String,
            require: [true, "Message cannot be empty"]
        },
        status: {
            type: Boolean,
            require: true,
            default: 0
        },
        chat_type: {
            type: String,
            require: [true, "Please provide permission name"]
        },

    }, {
        timestamps: true
    });

module.exports = mongoose.model("Message", messageSchema);
