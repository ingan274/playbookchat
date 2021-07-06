const { MongoClient } = require("mongodb");
const connect = require('./controller/model');

// Connect to MongoDB
// new Promise((resolve, reject) => {
//     client.connect().then(() => {
//         console.log("Connection to database is made.")
//         resolve()

//     })
//         .catch(err => {
//             console.log(err);
//             reject()
//         });
// })


module.exports = {
    connection: async (MONGO_URI) => {
        const client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect()
    
        console.log("Connection to database is made.")
        let dbs = connect.database(client)
        return dbs
    }
}







