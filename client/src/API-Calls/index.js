
import axios from "axios";
import delay from "./chatDelay";
// let upload = multer({ dest: '../../uploads/' })

const timerDelay = delay.timerDelay
const secondDelay = delay.timerDelay * 2

// Timed Updates

const updateToSent = message => axios.put("/api/timed", message);
const updateRespAvail = (message) => axios.put("/api/timed/toert", message);

// const updateToSent = message => axios.put("http://localhost:3002/api/timed", message)
// const updateRespAvail = (message) => axios.put("http://localhost:3002/api/timed/toert", message)

const timedUpdates = (response) => {

    let messageUpdate = {
        messageID: response.data._id,
        groupChat: response.data.groupChat
    }

    // console.log(messageUpdate)

    let cycle = 2
    // updated Message to Sent
    let sent = setInterval(function () {
        if (cycle === 1) {
            clearInterval(sent);
            return;
        }
        updateToSent(messageUpdate)
        cycle--;
    }, timerDelay);

    let responseExpected = setInterval(function () {
        if (cycle === 0) {
            clearInterval(responseExpected);
            return;
        }
        updateRespAvail(messageUpdate)
        cycle--;
    }, secondDelay);


}


const APICall = {
    // MCC Crew Chat
    getMCCCrew: (location, userID) => axios.get(`/api/mcccrew/${location}/${userID}`),

    newMCCCrew: (newMessage) => {
        axios.post("/api/mcccrew/", newMessage)
            .then(response => {
                timedUpdates(response)
            })
    },

    newMCCCrewPhoto: (newMessage) => {
        axios.post("/api/mcccrew/photo", newMessage)
            .then(response => {
                timedUpdates(response)
            })
    },

    markObsolete: (ignoreMessage) => {
        let messageID = ignoreMessage.messageID;
        axios.put("/api/mcccrew/ignorepress", { messageID: messageID })

        let cycle = 1
        let markObsolete = setInterval(function () {
            if (cycle === 0) {
                clearInterval(markObsolete);
                return;
            }
            axios.put("/api/mcccrew/ignore", ignoreMessage)
            cycle--;
        }, timerDelay);


    },

    handlePriority: (action, message) => {

        axios.put(`/api/mcccrew/prioritypress/${action}`, { messageID: message })

        let cycle = 1
        let updatePriority = setInterval(function () {
            if (cycle === 0) {
                clearInterval(updatePriority);
                return;
            }
            axios.put(`/api/mcccrew/priority/${action}`, { messageID: message })
            cycle--;
        }, timerDelay);


    },

    reactMCCCrew: (update) => {
        let cycle = 1;
        let reaction = setInterval(function () {
            if (cycle === 0) {
                clearInterval(reaction);
                return;
            }
            axios.put("/api/mcccrew/", update)
            cycle--;
        }, timerDelay);
    },

    replyMCCCrew: (replyMessage) => {
        axios.post("/api/mcccrew/reply", replyMessage)
            .then(response => {
                timedUpdates(response)
            })
    },

    // Crew Chat
    getCrew: () => axios.get("/api/crew/"),

    newCrew: (newMessage) => {
        axios.post("/api/crew/", newMessage)
            .then(response => {
                timedUpdates(response)
            })
    },

    newCrewPhoto: (newMessage) => {
        axios.post("/api/crew/photo", newMessage)
    },

    reactCrew: (update) => {
        let cycle = 1;
        let reaction = setInterval(function () {
            if (cycle === 0) {
                clearInterval(reaction);
                return;
            }
            axios.put("/api/crew/", update)
            cycle = - 1;
        }, timerDelay);
    },

    replyCrew: (replyMessage) => {
        axios.post("/api/crew/reply", replyMessage)
            .then(response => {
                timedUpdates(response)
            })
    },

    // Drafts
    getDrafts: (userID) => axios.get(`/api/mcccrew/${userID}`),

    newDraft: (newMessage) => axios.post("/api/draft/", newMessage),

    sendDraft: (sendMessage) => {
        axios.post("/api/draft/send", sendMessage)
            .then(response => {
                timedUpdates(response)
            })
    },

    editDraft: (update) => axios.put("/api/draft/", update),

    deleteDraft: (deleteMessage) => axios.delete("/api/draft/", deleteMessage),

    // Thread
    getThread: (parentThreadID, groupChat, location) => axios.get(`/api/mcccrew/${parentThreadID}/${groupChat}/${location}`),

    // Pinned
    getPinned: (userID, location) => axios.get(`/api/mcccrew/${userID}/${location}`),

    addPin: (pin) => axios.put("/api/pin/", pin),

    deletePin: (pin) => axios.put("/api/pin/remove", pin),

    // Reminder
    addReminder: (reminder) => axios.put("/api/reminder/", reminder),

    deleteReminder: (reminder) => axios.put("/api/reminder/remove", reminder),
}

// const APICallLocal = {
//     // MCC Crew Chat
//     getMCCCrew: (location, userID) => axios.get(`http://localhost:3002/api/mcccrew/${location}/${userID}`),

//     newMCCCrew: (newMessage) => {
//         axios.post("http://localhost:3002/api/mcccrew/", newMessage)
//             .then(response => {
//                 timedUpdates(response)
//             })
//     },

//     reactMCCCrew: (update) => {
//         let cycle = 1;
//         let reaction = setInterval(function () {
//             if (cycle === 0) {
//                 clearInterval(reaction);
//                 return;
//             }
//             axios.put("http://localhost:3002/api/mcccrew/", update)
//             cycle = - 1;
//         }, timerDelay);
//     },

//     replyMCCCrew: (replyMessage) => {
//         axios.post("http://localhost:3002/api/mcccrew/reply", replyMessage)
//             .then(response => {
//                 timedUpdates(response)
//             })
//     },

//     // Crew Chat
//     getCrew: () => axios.get("http://localhost:3002/api/crew/"),

//     newCrew: (newMessage) => {
//         axios.post("/api/crew/", newMessage)
//             .then(response => {
//                 timedUpdates(response)
//             })
//     },

//     reactCrew: (update) => {
//         let cycle = 1;
//         let reaction = setInterval(function () {
//             if (cycle === 0) {
//                 clearInterval(reaction);
//                 return;
//             }
//             axios.put("http://localhost:3002/api/crew/", update)
//             cycle = - 1;
//         }, timerDelay);
//     },

//     replyCrew: (replyMessage) => {
//         axios.post("http://localhost:3002/api/crew/reply", replyMessage)
//             .then(response => {
//                 timedUpdates(response)
//             })
//     },

//     // Drafts
//     getDrafts: (userID) => axios.get(`http://localhost:3002/api/mcccrew/${userID}`),

//     newDraft: (newMessage) => axios.post("http://localhost:3002/api/draft/", newMessage),

//     sendDraft: (sendMessage) => {
//         axios.post("http://localhost:3002/api/draft/send", sendMessage)
//             .then(response => {
//                 timedUpdates(response)
//             })
//     },

//     editDraft: (update) => axios.put("http://localhost:3002/api/draft/", update),

//     deleteDraft: (deleteMessage) => axios.delete("/api/draft/", deleteMessage),

//     // Thread
//     getThread: (parentThreadID, groupChat, location) => axios.get(`/api/mcccrew/${parentThreadID}/${groupChat}/${location}`),

//     // Pinned
//     getPinned: (userID, location) => axios.get(`/api/mcccrew/${userID}/${location}`),

//     addPin: (pin) => axios.put("/api/pin/", pin),

//     deletePin: (pin) => axios.put("/api/pin/remove", pin),

//     // Reminder
//     addReminder: (reminder) => axios.put("/api/reminder/", reminder),

//     deleteReminder: (reminder) => axios.put("/api/reminder/remove", reminder),
// }

export default APICall;