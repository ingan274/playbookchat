const express = require('express');
const router = express.Router();
const controller = require("../controller/messageController");


// Get Selected Thread
router.route("/:parentThreadID/:groupChat/:location")
    .get(controller.chatMCCCrew)

module.exports = router;