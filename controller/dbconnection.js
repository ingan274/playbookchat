
const mongocalls = (mcccrewdb, crewdb, draftsdb) => {
 return ({
     mgdbmcccrew: mcccrewdb,
     mgdbcrew: crewdb,
     mgdbdrafts: draftsdb,
 })
}

module.exports = {
    mongocalls: mongocalls,
}