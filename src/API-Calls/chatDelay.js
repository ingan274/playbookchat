// Delay in Minutes
const delay = .5;
const timerDelay = delay * 60000;

// Sent Time
const time = new Date();
// console.log(time)

// Delivered Time
const delayedTimeStamp = new Date(time.getTime() + delay * 60000);
// console.log(delayedTimeStamp)

module.exports = {
    sentTime: time,
    deliveredTime: delayedTimeStamp,
    timerDelay: timerDelay
}