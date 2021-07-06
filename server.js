// const router = require("./router");
require('dotenv').config();
const path = require('path');
const express = require("express");
const router = require("./router/index");
const cors = require('cors');
const morgan = require('morgan');


const app = express();
const PORT = process.env.PORT || 3002;



// // Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(morgan('combined'));
// // Add routes - this connects and activates API
app.use(router);
app.use(express.static("public"));

// // If its production environment!
if (process.env.NODE_ENV === 'production') {
    // console.log('YOU ARE IN THE PRODUCTION ENV');
    app.use('/static', express.static(path.join(__dirname, './build/static')));
}
// // Start the API server
app.listen(PORT, function () {
    console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});


