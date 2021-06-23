const express = require('express');
const router = express.Router();
const controller = require("../controller/messageController");

// Chat Update (/toSent)
router.route("/")
    .put(controller.updateToSent)

// Chat Update (/toEAR)
router.route("/toEAR")
    .put(controller.updateToPossibleReply)

module.exports = router;