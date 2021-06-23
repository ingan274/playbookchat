const express = require('express');
const router = express.Router();
const controller = require("../controller/messageController");

// Pinned (/pinned)
router.route("/:userID/:location")
    .get(controller.pinned)

router.route("/")
    .put(controller.pinMessage)

// Pinned (/pin/remove)
router.route("/remove")
    .put(controller.deletePinMessage)

module.exports = router;