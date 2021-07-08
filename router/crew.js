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


// Crew Chat (/crew)
router.route("/")
    .get(controller.chatCrew)
    .post(controller.newMessageCrew)
    .put(controller.reactMessage)

// Crew Chat (/crew/reply)
router.route("/reply")
    .post(controller.replyMessageCrew)

router.route("/photo")
    .post(upload.single('imageData'), controller.newMessageCrewPhoto)



module.exports = router;