const express = require('express');
const router = express.Router();
const controller = require("../controller/messageController");
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
        // cb(null, path.join(__dirname, './uploads/'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        // rejects storing a file
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

// MCC Crew Chat  (/mcccrew/:location/:userID)
router.route("/:location/:userID")
    .get(controller.chatMCCCrew)

router.route("/")
    .post(controller.newMessageMCCCrew)
    .put(controller.reactMessage)

// MCC Crew Chat  (/mcccrew/reply)
router.route("/reply")
    .post(controller.replyMessageMCCCrew)

// MCC Crew Chat  (/mcccrew/photo)
router.route("/photo")
    .post(upload.single('imageData'), controller.newMessageMCCCrewPhoto)

// MCC Crew Chat  (/mcccrew/ignore)
router.route("/ignore")
    .put(controller.mccObsolete)


// MCC Crew Chat  (/mcccrew/ignorepress)
router.route("/ignorepress")
    .put(controller.mccObsoletePress)

router.route("/priority/remove")
    .put(controller.mccPriorityRemove)

router.route("/priority/add")
    .put(controller.mccPriorityAdd)

router.route("/prioritypress/:action")
    .put(controller.mccPriorityPress)


module.exports = router;