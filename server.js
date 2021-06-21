// const router = require("./router");
const path = require('path');
const express = require("express");


const app = express();
const PORT = process.env.PORT || 3002;
const HOST = process.env.HOST || "0.0.0.0";

// // Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// // If its production environment!
if (process.env.NODE_ENV === 'production') {
    // console.log('YOU ARE IN THE PRODUCTION ENV');
    app.use('/static', express.static(path.join(__dirname, './client/build/static')));
}

// // Add routes - this connects and activates API
// app.use(router);


// // Start the API server
app.listen(PORT, HOST, function () {
    console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});