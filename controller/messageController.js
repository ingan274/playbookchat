const collections = require("./model");

const mcccrew = collections.mcccrew;
const crew = collections.crew;
const drafts = collections.drafts;

const organizingMessages = (myTimeMessages, otherTimeMessages = null) => {
    let allChatMessages;

    // Pushing Crew Message ID and Time Sent to Array
    let userTimeArray = myTimeMessages.map((message, i) => {
        return {
            "id": message._id,
            "time": message.timeSent,
            "location": message.location
        }
    })

    if (otherTimeMessages !== null) {
        // // Pushing MCC Message ID and Time Delivered to Array
        let otherTimeArray = otherTimeMessages.map((message, i) => {
            return {
                "id": message._id,
                "time": message.timeDelivered,
                "location": message.location
            }
        })

        allChatMessages = userTimeArray.concat(otherTimeArray);
    } else {
        allChatMessages = userTimeArray;
    }

    // // Sorting Message based on Time
    allChatMessages.sort((item1, item2) => item1.time > item2.time ? 1 : -1);

    // console.log(allChatMessages)

    return allChatMessages;
}

const testing = async (req, res) => {
    let pinned = await mcccrew.find({ "sender.current": "mcc", pin: 0 })
        .sort({ timeSent: 1 })
        .toArray();
    console.log(pinned)
    return
}

testing()

module.exports = {
    //Get Messages

    // Find all messages for MCC and Crew Chat and organize by as received
    chatMCCCrew: async (req, res) => {

        let location = req.location;
        let organizedMesObj = [];

        if (location === "mars") {
            // Crew Perspective
            let crewMessages = await mcccrew.find({ location: 1 })
                .sort({ timeSent: 1 })
                .toArray();

            let mccMessages = await mcccrew.find({ location: 0 })
                .sort({ timeDelivered: 1 })
                .toArray();

            // let allMessagesArray = organizingMessages(crewMessages, mccMessages);
            let organizedMessages = organizingMessages(crewMessages, mccMessages);


            for (let message of organizedMessages) {
                const id = message.id;
                const location = message.location;

                if (location === 1) {
                    for (let crewObj of crewMessages) {
                        if (crewObj._id === id) {
                            organizedMesObj.push(crewObj);
                        }
                    }
                } else if (location === 0) {
                    for (let mccObj of mccMessages) {
                        if (mccObj._id === id) {
                            organizedMesObj.push(mccObj);
                        }
                    }
                }
            }

            // Sending MCC-Crew Chat from Crew Perspective
            res.send(organizedMesObj);

        } else if (location === "earth") {
            // MCC Perspective
            let crewMessages = await mcccrew.find({ location: 1 })
                .sort({ timeDelivered: 1 })
                .toArray();

            let mccMessages = await mcccrew.find({ location: 0 })
                .sort({ timeSent: 1 })
                .toArray();

            // let allMessagesArray = organizingMessages(crewMessages, mccMessages);
            let organizedMessages = organizingMessages(mccMessages, crewMessages);


            for (let message of organizedMessages) {
                const id = message.id;
                const location = message.location;

                if (location === 1) {
                    for (let crewObj of crewMessages) {
                        if (crewObj._id === id) {
                            organizedMesObj.push(crewObj);
                        }
                    }
                } else if (location === 0) {
                    for (let mccObj of mccMessages) {
                        if (mccObj._id === id) {
                            organizedMesObj.push(mccObj);
                        }
                    }
                }
            }

            // Sending MCC-Crew Chat from MCC Perspective
            res.send(organizedMesObj);
        }


        return
    },

    // Find all messages for Just Crew Chat and organize by as received
    chatCrew: async (req, res) => {

        let crewMessages = await crew.find({ location: 1 })
            .sort({ timeSent: 1 })
            .toArray();
        // let allMessagesArray = organizingMessages(crewMessages, mccMessages);
        let organizedMessages = organizingMessages(crewMessages);
        let organizedMesObj = [];

        for (let message of organizedMessages) {
            const id = message.id;

            for (let crewObj of crewMessages) {
                if (crewObj._id === id) {
                    organizedMesObj.push(crewObj);
                }
            }
        }

        res.send(organizedMesObj);
        return
    },

    // Find all messages for where Pinned = true to the user
    pinned: async (req, res) => {
        const user = req.userID;
        const location = req.location;

        if (location === 0) {
            let mccPinnedChat = [];

            let mccPinned = await mcccrew.find({"pin.isSet": 1})
                .sort({ timeSent: 1 })
                .toArray();

                // search pin.userPinned if they match the user and push into a new array
            for (let message of mccPinned) {
                let pinArray = message.pin.userPinned;
            }

            // res.send(mccPinned);

        } else if (location === 1) {

            let mccCrewChatPinned = await mcccrew.find({"pin.isSet": 1})
            .sort({ timeSent: 1 })
            .toArray();

            let crewChatPinned = await crew.find({"pin.isSet": 1})
            .sort({ timeSent: 1 })
            .toArray();

             // search pin.userPinned if they match the user and push into a new array

            let allPinned = mccCrewChatPinned.concat(crewChatPinned)

            // res.send(allPinned);

        }

    },

    // Find all messages for for that parrent organize by as received
    selectedThreadReceived: async (req, res) => {
        const parentThreadID = req.parentThreadID;

    },


    // //Insert Messages
    newMessageMCCCrew: (req, res) => {

    },


    newMessageCrew: (req, res) => {

    },

    // replyMessage:
    replyMessage: (req, res) => {

    },

    // replyReaction:
    reactMessage: (req, res) => {

    },



    // // Drafts
    //  Find all Draft Messages
    allDrafts: async (req, res) => {
        const user = req.userID;
        let draftedMessages = await drafts.find({ "sender.current": user })
            .sort({ timeSent: 1 })
            .toArray();

        res.send(draftedMessages);
        return


    },

    // Edit Message
    editDraft: () => {

    }


};