import moment from "moment";

// Delay in Minutes
const delay = {minutes: 1};
const minuteDelay = 1
const timerDelay = minuteDelay * 60 * 1000;

// Sent Time
let time = moment().utc().format()
// console.log(time)

// Delivered Time
let delayedTimeStamp = moment().add(delay).utc().format()
// console.log(delayedTimeStamp)

let timeObject = {
    sentTime: time,
    deliveredTime: delayedTimeStamp,
    timerDelay: timerDelay,
    delay: delay
}

export default timeObject;