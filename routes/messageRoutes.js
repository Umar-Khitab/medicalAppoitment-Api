const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const hasRole = require("../middleware/validateRoleHandler");
const { getAllGlobalChatMessages, getIndividualChatMessages } = require("../controllers/messageController");

const router = express.Router();


router.get("/global-chat-messages", validateToken, getAllGlobalChatMessages);
router.get("/chats/:senderId/:recieverId", validateToken, getIndividualChatMessages);


module.exports = router;
