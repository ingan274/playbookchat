const { ObjectID } = require("bson");
const { delay } = require("q");
const messageController = require("./controller/messageController");

const collections = require("./controller/model");

const mcccrew = collections.mcccrew;
const crew = collections.crew;
const drafts = collections.drafts;


const messageDelay = 5;

const testing = (req, res) => {
    

}

testing()