const { MongoClient } = require("mongodb");
// // Connect to MongoDB
// Connecting to Local Mongo URI
// const MONGO_URI = 'mongodb://localhost:27017';
// Updated Mongo URI for Atlas
const MONGO_URI = 'mongodb+srv://mhcinasa2021:Nasa2021Mhci@playbook.iamit.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

const client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });


// Connect to MongoDB

new Promise((resolve, reject) => {
    client.connect().then(() => {
        console.log("Connection to database is made.")
        resolve()
    })
    .catch(err => {
        console.log(err);
        reject()
    });
})



module.exports = {
    client: client
};



