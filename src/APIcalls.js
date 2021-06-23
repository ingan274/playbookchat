
import axios from "axios";

const APICall = {
    // MCC Crew Chat
    getMCCCrew: location => axios.get(`/api/mcccrew/${location}`),

    newMCCCrew: (newMessage) => axios.post("/api/mcccrew/", newMessage),

    reactMCCCrew: (update) => axios.put("/api/mcccrew/", update),

    replyMCCCrew: (replyMessage) => axios.post("/api/mcccrew/reply", replyMessage),

    // Crew Chat
    getCrew: () => axios.get("/api/crew/"),

    newCrew: (newMessage) => axios.post("/api/crew/", newMessage),

    reactCrew: (update) => axios.put("/api/crew/", update),

    replyCrew: (replyMessage) => axios.post("/api/crew/reply", replyMessage),

    // Drafts
    getDrafts: (userID) => axios.get(`/api/mcccrew/${userID}`),

    newDraft: (newMessage) => axios.post("/api/draft/", newMessage),

    sendDraft: (sendMessage) => axios.post("/api/draft/send", sendMessage),

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

    // Timed Updates

    updateToSent: message => axios.put("/api/timed", message),

    updateRespAvail: (message) => axios.put("/api/timed", message)
}

export default APICall;