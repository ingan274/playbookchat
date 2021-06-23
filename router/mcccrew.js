const express = require('express');
const router = express.Router();
const controller = require("../controller/messageController");


// MCC Crew Chat  (/mcccrew)
router.route("/:location")
    .get(controller.chatMCCCrew)

router.route("/")
    .post(controller.newMessageMCCCrew)
    .put(controller.reactMessage)

// MCC Crew Chat  (/mcccrew/reply)
router.route("/reply")
    .post(controller.replyMessageMCCCrew)


module.exports = router;