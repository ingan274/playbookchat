const express = require('express');
const router = express.Router();
const path = require('path');
const crewRoutes = require("./crew");
const mccCrewRoutes = require("./mcccrew");
const pinnedRoutes = require("./pinned");
const reminderRoutes = require("./reminder");
const draftsRoutes = require("./drafts");
const timedUpdatesRoutes = require("./timedUpdates");
const threadRoute = require("./selectedThread");

// API Routes
router.use("/api/crew", crewRoutes);
router.use("/api/mcccrew", mccCrewRoutes);
router.use("/api/drafts", draftsRoutes);
router.use("/api/timed", timedUpdatesRoutes);
router.use("/api/reminder", reminderRoutes);
router.use("/api/pin", pinnedRoutes);
router.use("/api/thread", threadRoute);

// If no API routes are hit, send the React app
router.use(function (req, res) {
    res.sendFile(path.join(__dirname, "../build/index.html"));
    res.send('There is a problem')
});

module.exports = router;