const express = require('express');
const router = express.Router();
const controller = require("../controller/messageController");


// Drafts (/drafts)
router.route("/:userID")
    .get(controller.allDrafts)

router.route("/")
    .post(controller.saveToDrafts)
    .put(controller.editDraft)
    .delete(controller.deleteDraft)

// Send Drafts (/draft/send)
router.route("/send")
    .post(controller.editSendDraft)

module.exports = router;