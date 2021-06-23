const express = require('express');
const router = express.Router();
const controller = require("../controller/messageController");


// Crew Chat (/crew)
router.route("/")
    .get(controller.chatCrew)
    .post(controller.newMessageCrew)
    .put(controller.reactMessage)

// Crew Chat (/crew/reply)
router.route("/reply")
    .post(controller.replyMessageCrew)


module.exports = router;