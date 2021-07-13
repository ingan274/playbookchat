const { ObjectID } = require("bson");
const mongoConnect = require('../connect');

let mcccrew;
let crew;
let drafts;
// Connect to MongoDB
// Connecting to Local Mongo URI
// const MONGO_URI = 'mongodb://localhost:27017';
// Updated Mongo URI for Atlas
const MONGO_URI = "mongodb+srv://mhcinasa2021:Nasa2021Mhci@playbook.iamit.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// mongodb+srv://mhcinasa2021:<password>@playbook.iamit.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
const dbs = async () => {
    let dbconnected = await mongoConnect.connection(MONGO_URI)
    // console.log(dbconnected)

    mcccrew = dbconnected.mgdbmcccrew
    crew = dbconnected.mgdbcrew
    drafts = dbconnected.mgdbdrafts

}
dbs()


const organizingMessages = (myTimeMessages) => {

    // Pushing Crew Message ID and Time Sent to Array
    let allChatMessages = myTimeMessages.map((message, i) => {
        return {
            "id": message._id,
            "time": message.timeDelivered,
            "location": message.location
        }
    })

    // // Sorting Message based on Time
    allChatMessages.sort((item1, item2) => item1.time > item2.time ? 1 : -1);

    // console.log(allChatMessages)

    return allChatMessages;
}

const organizedFullObjectMessages = (organizedMessage, allMessagesObject) => {
    let organizedMesObj = [];

    for (let message of organizedMessage) {
        const id = message.id;

        for (let message of allMessagesObject) {
            if (message._id === id) {
                organizedMesObj.push(message);
            }
        }
    }

    return organizedMesObj
};

module.exports = {
    // // Get Messages
    // Find all messages for MCC and Crew Chat and organize by as received
    chatMCCCrew: async (req, res) => {
        let userID = req.params.userID
        let location = req.params.location;
        let organizedMesObj;
        if (location === "mars") {
            // Crew Perspective
            let deliveredMessages = await mcccrew.find({ sending: false })
                .sort({ timeDelivered: 1 })
                .toArray();

            // User sending messages
            let userSendingMesage = await mcccrew.find({ location: true, sending: true, sender: userID })
                .sort({ timeDelivered: 1 })
                .toArray();

            let allMessages = userSendingMesage.concat(deliveredMessages)
            // console.log(allMessages)

            // organizingMessages(myTimeMessages, otherTimeMessages);

            if (allMessages.length > 0) {
                let organizedMessages = organizingMessages(allMessages);

                organizedMesObj = organizedFullObjectMessages(organizedMessages, allMessages)

                // Sending MCC-Crew Chat from Crew Perspective
                res.send(organizedMesObj);
            } else {
                res.send([]);
            }


        } else if (location === "earth") {
            // MCC Perspective
            let deliveredMessages = await mcccrew.find({ sending: false })
                .sort({ timeDelivered: 1 })
                .toArray();

            let userSendingMesage = await mcccrew.find({ location: false, sending: true })
                .sort({ timeDelivered: 1 })
                .toArray();

            let allMessages = userSendingMesage.concat(deliveredMessages)

            if (allMessages.length > 0) {
                let organizedMessages = organizingMessages(allMessages);

                organizedMesObj = organizedFullObjectMessages(organizedMessages, allMessages)

                // Sending MCC-Crew MCC from Crew Perspective
                res.send(organizedMesObj);
            } else {
                res.send([]);
            }

        }


        return
    },

    // Find all messages for Just Crew Chat and organize by as received
    chatCrew: async (req, res) => {
        // Crew Sent Messages
        let crewMessages = await crew.find()
            .sort({ timeDelivered: 1 })
            .toArray();

        if (crewMessages.length > 0) {
            // Sending MCC-Crew Chat from Crew Perspective
            res.send(crewMessages);
        } else {
            res.send([]);
        }
    },

    // Find all messages for where Pinned = true to the user
    pinned: async (req, res) => {
        const user = req.params.userID;
        const location = req.params.location;

        if (location === false) {
            let mccPinnedChat = [];

            let mccPinned = await mcccrew.find({ "pin.isSet": true })
                .sort({ timeSent: 1 })
                .toArray();

            // search pin.userPinned if they match the user and push into a new array
            for (let message of mccPinned) {
                let pinArray = message.pin.userPinned;

                if (pinArray.includes(user)) {
                    mccPinnedChat.push(message)
                }
            }

            res.send(mccPinnedChat);

        } else if (location === true) {
            let crewPinnedChat = [];
            let mccCrewChatPinned = await mcccrew.find({ "pin.isSet": true })
                .sort({ timeSent: 1 })
                .toArray();

            let crewChatPinned = await crew.find({ "pin.isSet": true })
                .sort({ timeSent: 1 })
                .toArray();

            // search pin.userPinned if they match the user and push into a new array
            let allCrewPinned = mccCrewChatPinned.concat(crewChatPinned)

            for (let message of allCrewPinned) {
                let pinArray = message.pin.userPinned;

                if (pinArray.includes(user)) {
                    crewPinnedChat.push(message)
                }
            }

            res.send(allCrewPinned);

        }

    },

    // Find all messages for that parrent organize by as received
    selectedThreadReceived: async (req, res) => {
        const parentThreadID = req.params.parentThreadID;
        // const parentThreadID = "60ce55e2fdea900b35a0d07e";
        const groupChat = req.params.groupChat;
        // const groupChat = "mcc-crew-chat";
        const location = req.params.location;
        // const location = false;
        let organizedReplies = [];
        let otherLocation;

        if (location) {
            otherLocation = false;
        } else {
            otherLocation = true;
        }

        if (groupChat === "mcc-crew-chat") {
            let parentMessage = await mcccrew.find({ _id: ObjectID(parentThreadID) }).toArray();

            let repliesYou = await mcccrew.find({ location: location, "parent.hasParent": true, "parent.parentID": parentThreadID })
                .sort({ timeSent: 1 })
                .toArray();

            // console.log(repliesYou)

            let repliesOther = await mcccrew.find({ location: otherLocation, "parent.hasParent": true, "parent.parentID": parentThreadID })
                .sort({ timeDelivered: 1 })
                .toArray();
            // console.log(repliesOther)

            // organizingMessages(myTimeMessages, otherTimeMessages);
            let organizedReplyArray = organizingMessages(repliesYou, repliesOther);

            organizedReplies = organizedFullObjectMessages(organizedReplyArray, repliesYou, repliesOther)


            let chatThread = parentMessage.concat(organizedReplies);

            // console.log(chatThread)
            res.send(chatThread);
        } else if (groupChat === "crew-chat") {
            let parentMessage = await crew.find({ _id: ObjectID(parentThreadID) }).toArray();

            let repliesYou = await crew.find({ location: location, "parent.hasParent": true, "parent.parentID": parentThreadID })
                .sort({ timeSent: 1 })
                .toArray();

            let repliesOther = await crew.find({ location: otherLocation, "parent.hasParent": true, "parent.parentID": parentThreadID })
                .sort({ timeDelivered: 1 })
                .toArray();

            // organizingMessages(myTimeMessages, otherTimeMessages);
            let organizedReplyArray = organizingMessages(repliesYou, repliesOther);

            organizedReplies = organizedFullObjectMessages(organizedReplyArray, repliesYou, repliesOther)


            let chatThread = parentMessage.concat(organizedReplies);

            // console.log(chatThread)
            res.send(chatThread);
        }

    },

    //  Find all Draft Messages
    allDrafts: async (req, res) => {
        const user = req.params.userID;
        let draftedMessages = await drafts.find({ "sender.current": user })
            .sort({ timeSent: 1 })
            .toArray();

        res.send(draftedMessages);
        return
    },



    // //Insert Messages
    // New MCC Crew Chat Message
    newMessageMCCCrew: async (req, res) => {
        let message = {
            groupChat: "mcc-crew-chat",
            message: req.body.message,
            priority: req.body.priority,
            priorityPressed: req.body.priorityPressed,
            urgent: req.body.urgent,
            parent: {
                hasParent: false,
            },
            obsoletePressed: false,
            obsolete: {
                isObsolete: false,
                userChange: "",
                timeChange: ""
            },
            sending: true,
            expected_resp: false,
            sender: req.body.sender,
            timeSent: req.body.sentTime,
            timeDelivered: req.body.deliveryTime,
            location: req.body.location
        }


        if (req.body.reminder) {
            message.reminder = req.body.reminder
        }

        await mcccrew.insertOne(message)
            .then(result => {
                console.log(result.ops[0])
                res.send(result.ops[0])
                console.log("Chat has been submitted to MCC Crew Chat")
            })
            .catch((status, err) => {
                console.log(err)
                res.sendStatus(status)
            });
    },

    newMessageMCCCrewPhoto: async (req, res) => {
        // console.log("initial path")
        // console.log(req.file.path)
        // console.log("Object")
        let priority;
        let priorityPressed;
        let urgent;
        let location;

        if (req.body.priority === "true") {
            priority = true
        } else {
            priority = false
        }


        if (req.body.priorityPressed === "true") {
            priorityPressed = true
        } else {
            priorityPressed = false
        }

        if (req.body.urgent === "true") {
            urgent = true
        } else {
            urgent = false
        }

        if (req.body.location === "true") {
            location = true
        } else {
            location = false
        }
        let message
        if (req.body.subjectLine === "false") {
            message = {
                groupChat: "mcc-crew-chat",
                message: {
                    subject: "",
                    messageBody: req.body.messageBody,
                },
                priority: priority,
                priorityPressed: priorityPressed,
                urgent: urgent,
                parent: {
                    hasParent: false,
                },
                obsoletePressed: false,
                obsolete: {
                    isObsolete: false,
                    userChange: "",
                    timeChange: ""
                },
                sending: true,
                expected_resp: false,
                sender: req.body.sender,
                timeSent: req.body.sentTime,
                timeDelivered: req.body.deliveryTime,
                location: location,
                attachment: {
                    attachment: true,
                    imageData: req.body.imagePath
                }
            }
        } else {
            message = {
                groupChat: "mcc-crew-chat",
                message: {
                    subject: req.body.messageSubject,
                    messageBody: req.body.messageBody,
                },
                priority: priority,
                priorityPressed: priorityPressed,
                urgent: urgent,
                obsoletePressed: false,
                obsolete: {
                    isObsolete: false,
                    userChange: "",
                    timeChange: ""
                },
                parent: {
                    hasParent: false,
                },
                sending: true,
                expected_resp: false,
                sender: req.body.sender,
                timeSent: req.body.sentTime,
                timeDelivered: req.body.deliveryTime,
                location: location,
                attachment: {
                    attachment: true,
                    imageData: req.file.path,
                    imageName: req.body.imageName
                }
            }
        }



        if (req.body.reminder) {
            message.reminder = req.body.reminder
        }

        // console.log(message)
        await mcccrew.insertOne(message)
            .then(result => {
                console.log(result.ops[0])
                res.send(result.ops[0])
                console.log("Chat has been submitted to MCC Crew Chat")
            })
            .catch((status, err) => {
                console.log(err)
                res.sendStatus(status)
            });
    },

    // New Crew Chat Message
    newMessageCrew: async (req, res) => {
        let message = {
            groupChat: "crew-chat",
            message: req.body.message,
            parent: {
                hasParent: false
            },
            sender: req.body.sender,
            timeDelivered: req.body.deliveryTime,
        }


        if (req.body.reminder) {
            message.reminder = req.body.reminder
        }

        await crew.insertOne(message)
            .then(response => res.json(response.ops[0]))
            .then(console.log("Chat has been submitted to Crew Chat"))
            .catch((err) => {
                console.log(err)
                res.send(404)
            });
    },

    newMessageCrewPhoto: async (req, res) => {
        // console.log("initial path")
        // console.log(req.file.path)
        // console.log("Object")

        let message = {
            groupChat: "crew-chat",
            message: {
                subject: req.body.messageSubject,
                messageBody: req.body.messageBody,
            },
            parent: {
                hasParent: false,
            },
            sender: req.body.sender,
            timeDelivered: req.body.deliveryTime,
            attachment: {
                attachment: true,
                imageData: req.file.path,
                imageName: req.body.imageName
            }
        }

        if (req.body.reminder) {
            message.reminder = req.body.reminder
        }

        // console.log(message)
        await crew.insertOne(message)
            .then(result => {
                console.log(result.ops[0])
                res.send(result.ops[0])
                console.log("Chat has been submitted to Crew Chat")
            })
            .catch((status, err) => {
                console.log(err)
                res.sendStatus(status)
            });
    },


    // Create Draft Message
    saveToDrafts: async (req, res) => {
        let message = {
            groupChat: req.body.groupChat,
            message: req.body.message,
            priority: req.body.priority,
            urgent: req.body.urgent,
            parent: req.body.parent,
            sending: true,
            expected_resp: false,
            sender: req.body.userID,
            timeCreated: req.body.time,
            location: req.body.location
        }

        // if a reminder is set
        if (req.body.reminder) {
            message.reminder = req.body.reminder
        }

        // if an attachement is added
        if (req.body.attachment) {
            message.attachment = req.body.attachment
        }

        await crew.insertOne(message)
            .then(console.log("Chat has been submitted to Crew Chat"))
            .then(res.send(200))
            .catch((err) => {
                console.log(err)
                res.send(404)
            });
    },

    // reply Message in MCC Crew
    replyMessageMCCCrew: async (req, res) => {
        let reply = {
            groupChat: "mcc-crew-chat",
            message: req.body.message,
            priority: req.body.priority,
            urgent: req.body.urgent,
            parent: {
                hasParent: true,
                parentID: req.body.parentID
            },
            sending: true,
            expected_resp: false,
            sender: req.body.userID,
            timeSent: req.body.time,
            timeDelivered: req.body.timeDelay,
            location: req.body.deliveryTime
        }

        // if a reminder is set
        if (req.body.reminder) {
            reply.reminder = req.body.reminder
        }

        // if an attachement is added
        if (req.body.attachment) {
            reply.attachment = req.body.attachment
        }

        await mcccrew.insertOne(reply)
            .then(response => res.json(response.ops[0]))
            .then(console.log("Reply has been submitted to MCC Crew Chat"))
            .then(res.send(200))
            .catch((err) => {
                console.log(err)
                res.send(404)
            });
    },

    // reply Message in Crew
    replyMessageCrew: async (req, res) => {
        let reply = {
            groupChat: "crew-chat",
            message: {
                subject: req.body.messageSubject,
                messageBody: req.body.messageBody
            },
            priority: req.body.priority,
            urgent: req.body.urgent,
            parent: {
                hasParent: true,
                parentID: req.body.parentID
            },
            sending: true,
            expected_resp: false,
            sender: req.body.userID,
            timeSent: req.body.time,
            timeDelivered: req.body.timeDelay,
            location: req.body.deliveryTime
        }

        // if a reminder is set
        if (req.body.reminder) {
            reply.reminder = req.body.reminder
        }

        // if an attachement is added
        if (req.body.attachment) {
            reply.attachment = req.body.attachment
        }

        await crew.insertOne(reply)
            .then(response => res.json(response.ops[0]))
            .then(console.log("Reply has been submitted to Crew Chat"))
            .then(res.send(200))
            .catch((err) => {
                console.log(err)
                res.send(404)
            });
    },



    // UPDATES TO MESSAGE
    // Update Sending to Sent
    updateToSent: async (req, res) => {
        const messageID = req.body.messageID;
        const groupChat = req.body.groupChat;


        console.log("update to sent", messageID)
        console.log(groupChat)

        let changeToSent = {
            $set: {
                sending: false
            }
        }
        if (groupChat === "mcc-crew-chat") {
            await mcccrew.updateOne({ _id: ObjectID(messageID) }, changeToSent)
                .then(console.log("MCC Crew Message", messageID, " (Message): has beeen SENT"))
                .then(res.sendStatus(200))
                .catch(err => {
                    console.log(err)
                    res.sendStatus(404)
                })
        } else if (groupChat === "crew-chat") {
            await crew.updateOne({ _id: ObjectID(messageID) }, changeToSent)
                .then(console.log("Crew Message", messageID, " (Message): has beeen SENT"))
                .then(res.sendStatus(200))
                .catch(err => {
                    console.log(err)
                    res.sendStatus(404)
                })
        }

    },

    // Update Expected Response Possible
    updateToPossibleReply: async (req, res) => {
        const messageID = req.body.messageID;
        const groupChat = req.body.groupChat;

        console.log("update to sent", messageID)
        console.log(groupChat)

        let changeToEAR = {
            $set: {
                expected_resp: true
            }
        }
        if (groupChat === "mcc-crew-chat") {
            await mcccrew.updateOne({ _id: ObjectID(messageID) }, changeToEAR)
                .then(console.log("Message", messageID, " (Message): could get a response"))
                .then(res.send(200))
                .catch(err => {
                    console.log(err)
                    res.send(404)
                })
        } else if (groupChat === "crew-chat") {
            await crew.updateOne({ _id: ObjectID(messageID) }, changeToEAR)
                .then(console.log("Message", messageID, " (Message): could get a response"))
                .then(res.send(200))
                .catch(err => {
                    console.log(err)
                    res.send(404)
                })
        }
    },

    // reply Reaction
    reactMessage: async (req, res) => {
        const personReacting = req.body.userID;
        const newreaction = req.body.reactionType
        const messageReactingTo = req.body.messsageID;
        const chatGroup = req.body.chatGroup;

        let reactionArray;
        let peopleArray;

        if (chatGroup === "mcc-crew-chat") {
            let message = await mcccrew.findOne({ _id: ObjectID(messageReactingTo) });

            if (message.reaction) {
                reactionArray = message.reaction.reactionType;
                peopleArray = message.reaction.person;

                reactionArray.push(newreaction)
                peopleArray.push(personReacting)
            } else {
                reactionArray = [newreaction];
                peopleArray = [personReacting];
            }

            let updatedReaction = {
                $set: {
                    reaction: {
                        reactionType: reactionArray,
                        person: peopleArray
                    }
                }
            }

            await mcccrew.updateOne({ _id: ObjectID(messageReactingTo) }, updatedReaction)
                .then(console.log("Message", messageReactingTo, "has beeen reacted to"))
                .then(res.send(200))
                .catch(err => {
                    console.log(err)
                    res.send(404)
                })

        } else if (chatGroup === "crew-chat") {
            let message = await crew.findOne({ _id: ObjectID(messageReactingTo) });

            if (message.reaction) {
                reactionArray = message.reaction.reactionType;
                peopleArray = message.reaction.person;

                reactionArray.push(newreaction)
                peopleArray.push(personReacting)
            } else {
                reactionArray = [newreaction];
                peopleArray = [personReacting];
            }

            let updatedReaction = {
                $set: {
                    reaction: {
                        reactionType: reactionArray,
                        person: peopleArray
                    }
                }
            }

            await crew.updateOne({ _id: ObjectID(messageReactingTo) }, updatedReaction)
                .then(console.log("Mesage", messageReactingTo, "has beeen reacted to"))
                .then(res.send(200))
                .catch(err => {
                    console.log(err)
                    res.send(404)
                })
        }
    },

    // Edit Draft Message
    editDraft: async (req, res) => {
        const updatedMessage = req.body.messageUpdate;
        const setReminder = req.body.reminder;
        const addAttachement = req.body.attachment;
        const messageID = req.body.messageID

        if (updatedMessage) {
            let messageUpdate = {
                $set: {
                    message: {
                        messageBody: updatedMessage
                    }
                }
            }
            await drafts.updateOne({ _id: ObjectID(messageID) }, messageUpdate)
                .then(console.log("Draft Message", messageID, " (Message): has beeen updated"))
                .then(res.send(200))
                .catch(err => {
                    console.log(err)
                    res.send(404)
                })
        };

        if (setReminder) {
            let settingReminder = {
                $set: {
                    reminder: setReminder
                }
            }
            await drafts.updateOne({ _id: ObjectID(messageID) }, settingReminder)
                .then(console.log("Draft Message", messageID, " (Message): has beeen updated"))
        };

        if (addAttachement) {
            let addingAttachement = {
                $set: {
                    attachment: addAttachement
                }
            }
            await drafts.updateOne({ _id: ObjectID(messageID) }, addingAttachement)
                .then(console.log("Draft Message", messageID, " (Message): has beeen updated"))
        };
        await drafts.findOne({ _id: ObjectID(messageID) })
            .then(console.log("Draft Message is updated"))
            .then(res.send(200))
            .catch(err => {
                console.log(err)
                res.send(404)
            })

    },

    // Edit then Send Draft Message
    editSendDraft: async (req, res) => {
        const updatedMessage = req.body.messageUpdate;
        const setReminder = req.body.reminder;
        const addAttachement = req.body.attachment;
        const messageID = req.body.messageID;
        const sendTo = req.body.groupChat;

        const timeUpdate = {
            $set: {
                timeSent: req.body.time,
                timeDelivered: req.body.timeDelay,
            }
        }

        await drafts.updateOne({ _id: ObjectID(messageID) }, timeUpdate)
            .then(console.log("Draft Message", messageID, " (Message): has beeen updated"))
            .then(res.send(200))
            .catch(err => {
                console.log(err)
                res.send(404)
            })

        if (updatedMessage) {
            let messageUpdate = {
                $set: {
                    message: {
                        messageBody: updatedMessage
                    }
                }
            }
            await drafts.updateOne({ _id: ObjectID(messageID) }, messageUpdate)
                .then(console.log("Draft Message", messageID, " (Message): has beeen updated"))
        };

        if (setReminder) {
            let settingReminder = {
                $set: {
                    reminder: setReminder
                }
            }
            await drafts.updateOne({ _id: ObjectID(messageID) }, settingReminder)
                .then(console.log("Draft Message", messageID, " (Reminder): has beeen updated"))
        };

        if (addAttachement) {
            let addingAttachement = {
                $set: {
                    attachment: addAttachement
                }
            }
            await drafts.updateOne({ _id: ObjectID(messageID) }, addingAttachement)
                .then(console.log("Draft Message", messageID, " (Attachement): has beeen updated"))
        };

        await drafts.findOne({ _id: ObjectID(messageID) })
            .then(console.log("Draft Message is updated"))
            .catch(err => {
                console.log(err)
                res.send(404)
            })

        if (sendTo === "mcc-crew-chat") {
            mcccrew.insertOne(drafts.findOne({ _id: ObjectID(messageID) }))
                .then(drafts.deleteOne({ _id: ObjectID(messageID) }))
                .then(res.send(200))
                .catch(err => {
                    console.log(err)
                    res.send(404)
                })
        } else if (sendTo === "crew-chat") {
            crew.insertOne(drafts.findOne({ _id: ObjectID(messageID) }))
                .then(drafts.deleteOne({ _id: ObjectID(messageID) }))
                .then(res.send(200))
                .catch(err => {
                    console.log(err)
                    res.send(404)
                })
        }

    },

    // Pin Message (add)
    pinMessage: async (req, res) => {
        const personPinning = req.body.userID;
        const messageReactingTo = req.body.messsageID;
        const chatGroup = req.body.chatGroup;
        let peopleArray;

        if (chatGroup === "mcc-crew-chat") {
            let message = await mcccrew.findOne({ _id: ObjectID(messageReactingTo) });

            if (message.pin.isSet) {
                peopleArray = message.pin.userPinned;
                peopleArray.push(personPinning)
            } else {
                peopleArray = [personPinning];
            }

            let addPin = {
                $set: {
                    pin: {
                        isSet: true,
                        userPinned: peopleArray
                    }
                }
            }
            await mcccrew.updateOne({ _id: ObjectID(messageReactingTo) }, addPin)
                .then(console.log("Message", messageReactingTo, "has beeen Pinned for", personPinning))
                .then(res.send(200))
                .catch(err => {
                    console.log(err)
                    res.send(404)
                })

        } else if (chatGroup === "crew-chat") {
            let message = await mcccrew.findOne({ _id: ObjectID(messageReactingTo) });

            if (message.pin.isSet) {
                peopleArray = message.pin.userPinned;
                peopleArray.push(personPinning)
            } else {
                peopleArray = [personPinning];
            }

            let addPin = {
                $set: {
                    pin: {
                        isSet: true,
                        userPinned: peopleArray
                    }
                }
            }
            await mcccrew.updateOne({ _id: ObjectID(messageReactingTo) }, addPin)
                .then(console.log("Message", messageReactingTo, "has beeen Pinned for", personPinning))
                .then(res.send(200))
                .catch(err => {
                    console.log(err)
                    res.send(404)
                })
        }
    },

    // Mark Obsolete
    mccObsolete: async (req, res) => {
        const messageReactingTo = req.body.messageID;
        const userChange = req.body.userUpdated;
        const timeChange = req.body.timeUpdated;

        let ignoreMessage = {
            $set: {
                obsolete: {
                    isObsolete: true,
                    userChange: userChange,
                    timeChange: timeChange
                }
            }
        }

        await mcccrew.updateOne({ _id: ObjectID(messageReactingTo) }, ignoreMessage)
            .then(console.log("Message", messageReactingTo, "has beeen Ignored"))
            .then(res.send(200))
            .catch(err => {
                console.log(err)
                res.send(404)
            })
    },

    mccObsoletePress: async (req, res) => {
        const messageReactingTo = req.body.messageID;

        let obsoletePress = {
            $set: {
                obsoletePressed: true
            }
        }

        await mcccrew.updateOne({ _id: ObjectID(messageReactingTo) }, obsoletePress)
            .then(console.log("Message", messageReactingTo, "obsolete (pressed)"))
            .then(res.send(200))
            .catch(err => {
                console.log(err)
                res.send(404)
            })
    },

    // Remove Priority
    mccPriorityRemove: async (req, res) => {
        const messageReactingTo = req.body.messageID.messageID;

        let priorityUpdate = {
            $set: {
                priority: false
            }
        }

        await mcccrew.updateOne({ _id: ObjectID(messageReactingTo) }, priorityUpdate)
            .then(console.log("Message", messageReactingTo, "is not a priority"))
            .then(res.send(200))
            .catch(err => {
                console.log(err)
                res.send(404)
            })
    },

    // Add Priority
    mccPriorityAdd: async (req, res) => {
        const messageReactingTo = req.body.messageID.messageID;

        let priorityUpdate = {
            $set: {
                priority: true
            }
        }

        await mcccrew.updateOne({ _id: ObjectID(messageReactingTo) }, priorityUpdate)
            .then(console.log("Message", messageReactingTo, "is now a priority"))
            .then(res.send(200))
            .catch(err => {
                console.log(err)
                res.send(404)
            })
    },

    // Press Priority
    mccPriorityPress: async (req, res) => {
        const messageReactingTo = req.body.messageID.messageID;
        const action = req.params.action;
        let priorityUpdate

        // console.log(messageReactingTo, typeof messageReactingTo)
        if (action === "add") {
            priorityUpdate = {
                $set: {
                    priorityPressed: true
                }
            }
        } else if (action === "remove") {
            priorityUpdate = {
                $set: {
                    priorityPressed: false
                }
            }
        }

        await mcccrew.updateOne({ _id: ObjectID(messageReactingTo) }, priorityUpdate)
            .then(console.log("Message", messageReactingTo, "priority was pressed", action))
            .then(res.send(200))
            .catch(err => {
                console.log(err)
                res.send(404)
            })
    },

    // Add Message Reminder
    addReminder: async (req, res) => {
        const personReminder = req.body.userID;
        const messageReactingTo = req.body.messsageID;
        const chatGroup = req.body.chatGroup;
        let peopleArray;

        if (chatGroup === "mcc-crew-chat") {
            let message = await mcccrew.findOne({ _id: ObjectID(messageReactingTo) });

            if (message.reminder.isSet) {
                peopleArray = message.reminder.userReminderSet;
                peopleArray.push(personReminder)
            } else {
                peopleArray = [personReminder];
            }

            let addReminder = {
                $set: {
                    reminder: {
                        isSet: true,
                        userReminderSet: peopleArray
                    }
                }
            }
            await mcccrew.updateOne({ _id: ObjectID(messageReactingTo) }, addReminder)
                .then(console.log("Message", messageReactingTo, "has beeen Pinned for", personReminder))
                .then(res.send(200))
                .catch(err => {
                    console.log(err)
                    res.send(404)
                })

        } else if (chatGroup === "crew-chat") {
            let message = await mcccrew.findOne({ _id: ObjectID(messageReactingTo) });

            if (message.reminder.isSet) {
                peopleArray = message.reminder.userReminderSet;
                peopleArray.push(personReminder)
            } else {
                peopleArray = [personReminder];
            }

            let addReminder = {
                $set: {
                    reminder: {
                        isSet: true,
                        userReminderSet: peopleArray
                    }
                }
            }
            await mcccrew.updateOne({ _id: ObjectID(messageReactingTo) }, addReminder)
                .then(console.log("Message", messageReactingTo, "has beeen Pinned for", personReminder))
                .then(res.send(200))
                .catch(err => {
                    console.log(err)
                    res.send(404)
                })
        }

    },

    // Pin Message (add)
    deletePinMessage: async (req, res) => {
        const personRemovingPinning = req.body.userID;
        const messageReactingTo = req.body.messsageID;
        const chatGroup = req.body.chatGroup;
        let peopleArray = [];
        let updatedPin;

        if (chatGroup === "mcc-crew-chat") {
            let message = await mcccrew.findOne({ _id: ObjectID(messageReactingTo) });

            if (message.pin.isSet) {
                let currentPin = message.pin.userPinned;
                for (let personPinned of currentPin) {
                    if (personPinned !== personRemovingPinning) {
                        peopleArray.push(personPinned)
                    }
                }
            }

            if (peopleArray.length === 0) {
                updatedPin = {
                    $set: {
                        pin: {
                            isSet: false,
                            userPinned: []
                        }
                    }
                }

            } else {
                updatedPin = {
                    $set: {
                        pin: {
                            isSet: true,
                            userPinned: peopleArray
                        }
                    }
                }
            }

            await mcccrew.updateOne({ _id: ObjectID(messageReactingTo) }, updatedPin)
                .then(console.log("Message", messageReactingTo, "has beeen UNpinned for", personRemovingPinning))
                .then(res.send(200))
                .catch(err => {
                    console.log(err)
                    res.send(404)
                })
        } else if (chatGroup === "crew-chat") {
            const personRemovingPinning = req.body.userID;
            const messageReactingTo = req.body.messsageID;
            const chatGroup = req.body.chatGroup;
            let peopleArray = [];
            let updatedPin;

            if (chatGroup === "mcc-crew-chat") {
                let message = await mcccrew.findOne({ _id: ObjectID(messageReactingTo) });

                if (message.pin.isSet) {
                    let currentPin = message.pin.userPinned;
                    for (let personPinned of currentPin) {
                        if (personPinned !== personRemovingPinning) {
                            peopleArray.push(personPinned)
                        }
                    }
                }

                if (peopleArray.length === 0) {
                    updatedPin = {
                        $set: {
                            pin: {
                                isSet: false,
                                userPinned: []
                            }
                        }
                    }
                }

            } else {
                updatedPin = {
                    $set: {
                        pin: {
                            isSet: true,
                            userPinned: peopleArray
                        }
                    }
                }
            }

            await mcccrew.updateOne({ _id: ObjectID(messageReactingTo) }, updatedPin)
                .then(console.log("Message", messageReactingTo, "has beeen UNpinned for", personRemovingPinning))
                .then(res.send(200))
                .catch(err => {
                    console.log(err)
                    res.send(404)
                })
        }
    },

    // Add Message Reminder
    deleteReminder: async (req, res) => {
        const personReminder = req.body.userID;
        const messageReactingTo = req.body.messsageID;
        const chatGroup = req.body.chatGroup;
        let peopleArray;
        let updatedObject;

        if (chatGroup === "mcc-crew-chat") {
            let message = await mcccrew.findOne({ _id: ObjectID(messageReactingTo) });

            if (message.reminder.isSet) {
                peopleArray = message.reminder.userReminderSet;
                peopleArray.push(personReminder)
            } else {
                peopleArray = [personReminder];
            }
            if (peopleArray.length === 0) {
                updatedObject = {
                    $set: {
                        reminder: {
                            isSet: false,
                            userReminderSet: []
                        }
                    }
                }

            } else {
                updatedObject = {
                    $set: {
                        reminder: {
                            isSet: true,
                            userReminderSet: peopleArray
                        }
                    }
                }
            }


            await mcccrew.updateOne({ _id: ObjectID(messageReactingTo) }, updatedObject)
                .then(console.log("Message", messageReactingTo, "has a reminder Removed for", personReminder))
                .then(res.send(200))
                .catch(err => {
                    console.log(err)
                    res.send(404)
                })
        } else if (chatGroup === "crew-chat") {
            let message = await mcccrew.findOne({ _id: ObjectID(messageReactingTo) });

            if (message.reminder.isSet) {
                peopleArray = message.reminder.userReminderSet;
                peopleArray.push(personReminder)
            } else {
                peopleArray = [personReminder];
            }
            if (peopleArray.length === 0) {
                updatedObject = {
                    $set: {
                        reminder: {
                            isSet: false,
                            userReminderSet: []
                        }
                    }
                }

            } else {
                updatedObject = {
                    $set: {
                        reminder: {
                            isSet: true,
                            userReminderSet: peopleArray
                        }
                    }
                }
            }


            await mcccrew.updateOne({ _id: ObjectID(messageReactingTo) }, updatedObject)
                .then(console.log("Message", messageReactingTo, "has a reminder Removed for", personReminder))
                .then(res.send(200))
                .catch(err => {
                    console.log(err)
                    res.send(404)
                })
        }

    },

    // // DELETE DRAFT
    deleteDraft: async (req, res) => {
        const messageID = req.body.messsageID;
        drafts.deleteOne({ _id: ObjectID(messageID) })
            .then(res.send(200))
            .catch(err => {
                console.log(err)
                res.send(404)
            })
    }
}