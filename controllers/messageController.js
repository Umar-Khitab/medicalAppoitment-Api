const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Message = require("../models/messageModel");


const getAllGlobalChatMessages = asyncHandler(async (req, res) => {
    try {
        const messages = await Message.find({ chat_type: 'global chat' }).select(["sender_id", "message", "status"]).populate({
            path: 'sender_id',
            select: '-password', // Exclude the 'password' field
        });

        res.status(200).json({ messages: messages });

    } catch (error) {
        console.log(error);
    }
});

const getIndividualChatMessages = asyncHandler(async (req, res) => {
    try {
        const sender_id = req.params.senderId;
        const reciever_id = req.params.recieverId;
        const messages = await Message.find({
            chat_type: { $ne: 'global chat' }, $or: [
                { sender_id: sender_id, reciever_id: reciever_id },
                { sender_id: reciever_id, reciever_id: sender_id }
            ]
        }).select(["sender_id", "reciever_id", "message", "status"]).populate({
            path: 'sender_id',
            select: '-password -createdAt -updatedAt', // Exclude the 'password' field
        }).populate({
            path: 'reciever_id',
            select: '-password -createdAt -updatedAt' // Exclude the 'password' field for receiver_id
        });

        res.status(200).json({ messages: messages });

    } catch (error) {
        console.log(error);
    }
});


module.exports = { getAllGlobalChatMessages, getIndividualChatMessages };