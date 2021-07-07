const { MongoClient } = require("mongodb");
const connect = require('./controller/model');


module.exports = {
    connection: async (MONGO_URI) => {
        const client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true});
        await client.connect()
    
        console.log("Connection to database is made.")
        let dbs = connect.database(client)
        return dbs
    }
}







