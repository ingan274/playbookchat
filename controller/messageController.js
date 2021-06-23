const { ObjectID } = require("bson");
// const express = require("express");
const collections = require("./model");

const mcccrew = collections.mcccrew;
const crew = collections.crew;
const drafts = collections.drafts;

// // Delay in Minutes
const timedelay = 5;
const time = new Date();
const delayedTimeStamp = new Date(time.getTime() + timedelay * 60000);

// console.log("time", time)
// console.log("delayed", delayedTimeStamp)


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

    console.log(allChatMessages)

    // console.log(allChatMessages)

    return allChatMessages;
}

const organizedFullObjectMessages = (organizedMessage, yourMessagesObject, otherMessagesObject) => {
    let organizedMesObj = [];

    for (let message of organizedMessage) {
        const id = message.id;

        for (let yourMessage of yourMessagesObject) {
            if (yourMessage._id === id) {
                organizedMesObj.push(yourMessage);
            }
        }
        for (let otherMessage of otherMessagesObject) {
            if (otherMessage._id === id) {
                organizedMesObj.push(otherMessage);
            }
        }
    }

    return organizedMesObj
};

module.exports = {
    // // Get Messages
    // Find all messages for MCC and Crew Chat and organize by as received
    chatMCCCrew: async (req, res) => {

        let location = req.params.location;
        let organizedMesObj;

        if (location === "mars") {
            // Crew Perspective
            let crewMessages = await mcccrew.find({ location: true })
                .sort({ timeSent: 1 })
                .toArray();

            let mccMessages = await mcccrew.find({ location: false })
                .sort({ timeDelivered: 1 })
                .toArray();

            // organizingMessages(myTimeMessages, otherTimeMessages);
            let organizedMessages = organizingMessages(crewMessages, mccMessages);

            organizedMesObj = organizedFullObjectMessages(organizedMessages, crewMessages, mccMessages)

            // Sending MCC-Crew Chat from Crew Perspective
            res.send(organizedMesObj);

        } else if (location === "earth") {
            // MCC Perspective
            let crewMessages = await mcccrew.find({ location: true })
                .sort({ timeDelivered: 1 })
                .toArray();

            let mccMessages = await mcccrew.find({ location: false })
                .sort({ timeSent: 1 })
                .toArray();

            // organizingMessages(myTimeMessages, otherTimeMessages);
            let organizedMessages = organizingMessages(mccMessages, crewMessages);

            organizedMesObj = organizedFullObjectMessages(organizedMessages, mccMessages, crewMessages)


            // Sending MCC-Crew Chat from MCC Perspective
            res.send(organizedMesObj);
        }


        return
    },

    // Find all messages for Just Crew Chat and organize by as received
    chatCrew: async (req, res) => {

        let crewMessages = await crew.find({ location: true })
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

    // Find all messages for for that parrent organize by as received
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

            console.log(repliesYou)

            let repliesOther = await mcccrew.find({ location: otherLocation, "parent.hasParent": true, "parent.parentID": parentThreadID })
                .sort({ timeDelivered: 1 })
                .toArray();
            console.log(repliesOther)

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
            urgent: req.body.urgent,
            parent: {
                hasParent: false,
            },
            sending: true,
            expected_resp: false,
            sender: req.body.sender,
            timeSent: time,
            timeDelivered: delayedTimeStamp,
            location: req.body.location
        }


        if (req.body.reminder) {
            message.reminder = req.body.reminder
        }

        if (req.body.attachment) {
            message.attachment = req.body.attachment
        }

        await mcccrew.insertOne(message)
            .then(result => {
                res.send(200)
                console.log("Chat has been submitted to MCC Crew Chat")
            })
            .catch((err) => {
                console.log(err)
            });
    },

    // New Crew Chat Message
    newMessageCrew: async (req, res) => {
        let message = {
            groupChat: "crew-chat",
            message: req.body.message,
            priority: req.body.priority,
            urgent: req.body.urgent,
            parent: {
                hasParent: false
            },
            sending: true,
            expected_resp: false,
            sender: req.body.userID,
            timeSent: time,
            timeDelivered: delayedTimeStamp,
            location: req.body.location
        }


        if (req.body.reminder) {
            message.reminder = req.body.reminder
        }

        if (req.body.attachment) {
            message.attachment = req.body.attachment
        }

        await crew.insertOne(message)
            .then(console.log("Chat has been submitted to Crew Chat"))
            .then(res.send(200))
            .catch((err) => {
                console.log(err)
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
            timeCreated: time,
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
            timeSent: time,
            timeDelivered: delayedTimeStamp,
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
            .then(console.log("Reply has been submitted to MCC Crew Chat"))
            .then(res.send(200))
            .catch((err) => {
                console.log(err)
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
            timeSent: time,
            timeDelivered: delayedTimeStamp,
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
            .then(console.log("Reply has been submitted to Crew Chat"))
            .then(res.send(200))
            .catch((err) => {
                console.log(err)
            });
    },



    // UPDATES TO MESSAGE
    // Update Sending to Sent
    updateToSent: async (req, res) => {
        const messageID = req.body.messageID;
        const groupChat = req.body.groupChat;

        let changeToSent = {
            $set: {
                sending: false
            }
        }
        if (groupChat === "mcc-crew-chat") {
            await mcccrew.updateOne({ _id: ObjectID(messageID) }, changeToSent)
                .then(console.log("Draft Message", messageID, " (Message): has beeen SENT"))
                .then(res.send(200))
                .catch(err => console.log(err))
        } else if (groupChat === "crew-chat") {
            await crew.updateOne({ _id: ObjectID(messageID) }, changeToSent)
                .then(console.log("Draft Message", messageID, " (Message): has beeen SENT"))
                .then(res.send(200))
                .catch(err => console.log(err))
        }

    },

    // Update Expected Response Possible
    updateToPossibleReply: async (req, res) => {
        const messageID = req.body.messageID;
        const groupChat = req.body.groupChat;

        let changeToEAR = {
            $set: {
                expected_resp: true
            }
        }
        if (groupChat === "mcc-crew-chat") {
            await mcccrew.updateOne({ _id: ObjectID(messageID) }, changeToEAR)
                .then(console.log("Draft Message", messageID, " (Message): could get a response"))
                .then(res.send(200))
                .catch(err => console.log(err))
        } else if (groupChat === "crew-chat") {
            await crew.updateOne({ _id: ObjectID(messageID) }, changeToEAR)
                .then(console.log("Draft Message", messageID, " (Message): could get a response"))
                .then(res.send(200))
                .catch(err => console.log(err))
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
                .catch(err => console.log(err))

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
                .catch(err => console.log(err))
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
                .catch(err => console.log(err))
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
            .catch(err => console.log(err))

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
                timeSent: time,
                timeDelivered: delayedTimeStamp,
            }
        }

        await drafts.updateOne({ _id: ObjectID(messageID) }, timeUpdate)
            .then(console.log("Draft Message", messageID, " (Message): has beeen updated"))
            .then(res.send(200))
            .catch(err => console.log(err))

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
            .catch(err => console.log(err))

        if (sendTo === "mcc-crew-chat") {
            mcccrew.insertOne(drafts.findOne({ _id: ObjectID(messageID) }))
                .then(drafts.deleteOne({ _id: ObjectID(messageID) }))
                .then(res.send(200))
                .catch(err => console.log(err))
        } else if (sentTo === "crew-chat") {
            crew.insertOne(drafts.findOne({ _id: ObjectID(messageID) }))
                .then(drafts.deleteOne({ _id: ObjectID(messageID) }))
                .then(res.send(200))
                .catch(err => console.log(err))
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
                .catch(err => console.log(err))

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
                .catch(err => console.log(err))
        }
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
                .catch(err => console.log(err))

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
                .catch(err => console.log(err))
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
                .catch(err => console.log(err))
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
                .catch(err => console.log(err))
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
                .catch(err => console.log(err))
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
                .catch(err => console.log(err))
        }

    },

    // // DELETE DRAFT
    deleteDraft: async (req, res) => {
        const messageID = req.body.messsageID;
        drafts.deleteOne({ _id: ObjectID(messageID) })
            .then(res.send(200))
            .catch(err => console.log(err))
    }
}