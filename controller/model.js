// const connect = require("../connect");
const databasecalls = require('./dbconnection')

let mcccrew;
let crew;
let drafts;

module.exports = {
    database: (client) => {
        const dbName = 'playbookMessages';
        const database = client.db(dbName)
        // Check if collections exist, if not then create them and set validation
        let collections = database.listCollections().toArray()

        // BSON types
        // string ("string")- text
        // double ("double") - floating point values
        // Object ("object") - object
        // ObjectId ("objectId") - floating point values
        // integer ("int")- number up to 36-bit

        if (collections.length === 0) {
            database.createCollection("mcc-crew-chat", {
                validator: {
                    $jsonSchema: {
                        bsonType: "object",
                        required: ["groupChat", "message", "priority", "urgent", "sending", "expected_resp", "sender", "timeSent", "timeDelivered", "location"],
                        properties: {
                            groupChat: {
                                bsonType: "string",
                                enum: ["mcc-crew-chat"],
                                description: "must be a profile and is required"
                            },
                            message: {
                                bsonType: "object",
                                properties: {
                                    subject: {
                                        bsonType: "string",
                                        description: "must be a string and is required"
                                    },
                                    messageBody: {
                                        bsonType: "string",
                                        description: "must be a string and is required"
                                    }
                                }
                            },
                            priority: {
                                bsonType: "bool",
                                description: "must be a bool - timer will change with timer"
                            },
                            urgent: {
                                enum: ["None", "ETA", "QResponse"],
                                description: "asking for a request needed"
                            },
                            obsoletePressed: {
                                bsonType: "bool",
                                description: "must be a bool, timer wull update the bottom later"
                            },
                            obsolete: {
                                bsonType: "object",
                                required: ["isObsolete"],
                                properties: {
                                    isObsolete: {
                                        bsonType: "bool",
                                        description: "must be a bool and is required"
                                    },
                                    userChange: {
                                        bsonType: "string",
                                        description: "Person Who Set It"
                                    },
                                    timeChange: {
                                        bsonType: "string",
                                        description: "Time it was changed"
                                    }
                                }
                            },
                            parent: {
                                bsonType: "object",
                                required: ["hasParent"],
                                properties: {
                                    hasParent: {
                                        bsonType: "bool",
                                        description: "must be a bool and is required"
                                    },
                                    parentID: {
                                        bsonType: "string",
                                        description: "this needs to be an objectID"
                                    },
                                }
                            },
                            sending: {
                                bsonType: "bool",
                                description: "must be a bool - timer will change with timer"
                            },
                            expected_resp: {
                                bsonType: "bool",
                                description: "must be a bool - timer will change with timer after sending"
                            },
                            sender: {
                                enum: ["mcc", "crew1", "crew2", "crew3", "crew4", "crew5"],
                                description: "must be a profile and is required"
                            },
                            timeCreated: {
                                bsonType: "date",
                                description: "must be a time"
                            },
                            timeSent: {
                                bsonType: "date",
                                description: "must be a time"
                            },
                            timeDelivered: {
                                bsonType: "date",
                                description: "must be a time"
                            },
                            location: {
                                bsonType: "bool",
                                description: "0 is earth and 1 is mars"
                            },
                            pin: {
                                bsonType: "object",
                                properties: {
                                    isSet: {
                                        bsonType: "array",
                                        description: "array of pinned"
                                    },
                                    userPinned: {
                                        bsonType: "array",
                                        description: "array of users who pinned"
                                    }
                                }
                            },
                            reminder: {
                                bsonType: "object",
                                properties: {
                                    isSet: {
                                        bsonType: "bool",
                                        description: "is there any reminder for any user"
                                    },
                                    userPinned: {
                                        bsonType: "array",
                                        description: "array of users who pinned"
                                    }
                                }
                            },
                            reaction: {
                                bsonType: "object",
                                properties: {
                                    reactType: {
                                        bsonType: "array",
                                        description: "must be an array and required"
                                    },
                                    person: {
                                        bsonType: "array",
                                        description: "must be a profile in it and index matches the react. type and is required if reacted"
                                    },
                                }
                            },
                            attachment: {
                                bsonType: "object",
                                properties: {
                                    attachment: {
                                        bsonType: "bool",
                                        description: "has to an attachment"
                                    },
                                    imageName: {
                                        bsonType: "string",
                                        description: "attachmentName"
                                    },
                                    imageData: {
                                         bsonType: "bool",
                                        description: "array to support many image links"
                                    }
                                }
                            },
                        }
                    }
                }
            })

            database.createCollection("crew-chat", {
                validator: {
                    $jsonSchema: {
                        bsonType: "object",
                        required: ["groupChat", "message", "expected_resp", "sender", "timeDelivered"],
                        properties: {
                            groupChat: {
                                bsonType: "string",
                                enum: ["crew-chat"],
                                description: "must be a one of the pre-set Chats and is required"
                            },
                            message: {
                                bsonType: "object",
                                properties: {
                                    subject: {
                                        bsonType: "string",
                                        description: "must be a string and is required"
                                    },
                                    messageBody: {
                                        bsonType: "string",
                                        description: "must be a string and is required"
                                    }
                                }
                            },
                            priority: {
                                bsonType: "bool",
                                description: "must be a bool - timer will change with timer"
                            },
                            urgent: {
                                enum: ["None", "ETA", "QResponse"],
                                description: "asking for a request needed"
                            },
                            parent: {
                                bsonType: "object",
                                required: ["hasParent"],
                                properties: {
                                    hasParent: {
                                        bsonType: "bool",
                                        description: "must be a bool and is required"
                                    },
                                    parentID: {
                                        bsonType: "string",
                                        description: "this needs to be an objectID"
                                    },
                                }
                            },
                            sending: {
                                bsonType: "bool",
                                description: "must be a bool - timer will change with timer"
                            },
                            expected_resp: {
                                bsonType: "bool",
                                description: "must be a bool - timer will change with timer after sending"
                            },
                            sender: {
                                enum: ["mcc", "crew1", "crew2", "crew3", "crew4", "crew5"],
                                description: "must be a profile and is required"
                            },
                            timeCreated: {
                                bsonType: "date",
                                description: "must be a time"
                            },
                            timeSent: {
                                bsonType: "date",
                                description: "must be a time"
                            },
                            timeDelivered: {
                                bsonType: "date",
                                description: "must be a time"
                            },
                            location: {
                                bsonType: "bool",
                                description: "0 is earth and 1 is mars"
                            },
                            pin: {
                                bsonType: "object",
                                properties: {
                                    isSet: {
                                        bsonType: "array",
                                        description: "array of pinned"
                                    },
                                    userPinned: {
                                        bsonType: "array",
                                        description: "array of users who pinned"
                                    }
                                }
                            },
                            reminder: {
                                bsonType: "object",
                                properties: {
                                    isSet: {
                                        bsonType: "bool",
                                        description: "is there any reminder for any user"
                                    },
                                    userPinned: {
                                        bsonType: "array",
                                        description: "array of users who pinned"
                                    }
                                }
                            },
                            reaction: {
                                bsonType: "object",
                                properties: {
                                    reactType: {
                                        bsonType: "array",
                                        description: "must be an array and required"
                                    },
                                    person: {
                                        bsonType: "array",
                                        description: "must be a profile in it and index matches the react. type and is required if reacted"
                                    },
                                }
                            },
                            attachment: {
                                bsonType: "object",
                                properties: {
                                    attachment: {
                                        bsonType: "bool",
                                        description: "has to an attachment"
                                    },
                                    imageName: {
                                        bsonType: "string",
                                        description: "attachmentName"
                                    },
                                    imageData: {
                                         bsonType: "bool",
                                        description: "array to support many image links"
                                    }
                                }
                            },
                        }
                    }
                }
            })

            database.createCollection("drafts", {
                validator: {
                    $jsonSchema: {
                        bsonType: "object",
                        required: ["groupChat", "message", "priority", "urgent", "sending", "expected_resp", "sender", "timeCreated", "location"],
                        properties: {
                            groupChat: {
                                bsonType: "string",
                                enum: ["crew-chat", "mcc-crew-chat"],
                                description: "must be a one of the pre-set Chats and is required"
                            },
                            message: {
                                bsonType: "object",
                                properties: {
                                    subject: {
                                        bsonType: "string",
                                        description: "must be a string and is required"
                                    },
                                    messageBody: {
                                        bsonType: "string",
                                        description: "must be a string and is required"
                                    }
                                }
                            },
                            priority: {
                                bsonType: "bool",
                                description: "must be a bool - timer will change with timer"
                            },
                            urgent: {
                                enum: ["None", "ETA", "QResponse"],
                                description: "asking for a request needed"
                            },
                            parent: {
                                bsonType: "object",
                                required: ["hasParent"],
                                properties: {
                                    hasParent: {
                                        bsonType: "bool",
                                        description: "must be a bool and is required"
                                    },
                                    parentID: {
                                        bsonType: "string",
                                        description: "this needs to be an objectID"
                                    },
                                }
                            },
                            sending: {
                                bsonType: "bool",
                                description: "must be a bool - timer will change with timer"
                            },
                            expected_resp: {
                                bsonType: "bool",
                                description: "must be a bool - timer will change with timer after sending"
                            },
                            sender: {
                                enum: ["mcc", "crew1", "crew2", "crew3", "crew4", "crew5"],
                                description: "must be a profile and is required"
                            },
                            timeCreated: {
                                bsonType: "date",
                                description: "must be a time"
                            },
                            timeSent: {
                                bsonType: "date",
                                description: "must be a time"
                            },
                            timeDelivered: {
                                bsonType: "date",
                                description: "must be a time"
                            },
                            location: {
                                bsonType: "bool",
                                description: "0 is earth and 1 is mars"
                            },
                            pin: {
                                bsonType: "object",
                                properties: {
                                    isSet: {
                                        bsonType: "bool",
                                        description: "is there any reminder for any user"
                                    },
                                    userPinned: {
                                        bsonType: "array",
                                        description: "array of users who pinned"
                                    }
                                }
                            },
                            reminder: {
                                bsonType: "object",
                                properties: {
                                    isSet: {
                                        bsonType: "bool",
                                        description: "is there any reminder for any user"
                                    },
                                    userPinned: {
                                        bsonType: "array",
                                        description: "array of users who pinned"
                                    }
                                }
                            },
                            reaction: {
                                bsonType: "object",
                                properties: {
                                    reactType: {
                                        bsonType: "array",
                                        description: "must be an array and required"
                                    },
                                    person: {
                                        bsonType: "array",
                                        description: "must be a profile in it and index matches the react. type and is required if reacted"
                                    },
                                }
                            },
                            attachment: {
                                bsonType: "object",
                                properties: {
                                    attachment: {
                                        bsonType: "bool",
                                        description: "has to an attachment"
                                    },
                                    imageName: {
                                        bsonType: "string",
                                        description: "attachmentName"
                                    },
                                    imageData: {
                                         bsonType: "bool",
                                        description: "array to support many image links"
                                    }
                                }
                            },
                        }
                    }
                }
            })

            mcccrew = database.collection('mcc-crew-chat');
            crew = database.collection('crew-chat');
            drafts = database.collection('drafts');

            let dbs = databasecalls.mongocalls(mcccrew, crew, drafts)
            return dbs

        } else {
            mcccrew = database.collection('mcc-crew-chat');
            crew = database.collection('crew-chat');
            drafts = database.collection('drafts');

            let dbs = databasecalls.mongocalls(mcccrew, crew, drafts)
           return dbs
        }
    },
};
