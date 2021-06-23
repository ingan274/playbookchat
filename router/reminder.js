const express = require('express');
const router = express.Router();
const controller = require("../controller/messageController");

// reminder (/addreminder)
router.route("/")
    .put(controller.addReminder)

// reminder (/removereminder)
router.route("/remove")
    .put(controller.deleteReminder)

module.exports = router;