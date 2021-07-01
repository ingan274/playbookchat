import React, { Component } from "react";
import "./style.css";
import { Grid, Box, Avatar } from '@material-ui/core';
import MessageStatus from "../mesageStatusIcons"
import moment from "moment";


class YourSide extends Component {
    sendingText = () => {
        return (this.props.sending ? "ETA" : "Delivered");
    };

    messageStatus = () => {
        if (this.props.sending && !this.props.expresp) {
            // Sending
            return (
                <MessageStatus sent="rgba(245, 245, 245, .8)" ert="rgba(245, 245, 245, .8)" />
            )
        } else if (!this.props.sending && this.props.expresp) {
            // send, and response if avail
            return <MessageStatus sent="rgba(112 , 210 , 122)" ert="rgba(112 , 210 , 122)" />
        } else {
            // sent, but time hasnt been reached for response
            return <MessageStatus sent="rgba(112 , 210 , 122)" ert="rgba(245, 245, 245, .8)" />
        }

    }

    countdown = () => {
        let currentTime = moment();
        let deliveryTime = moment(this.props.eta)
        let remainingMilliSeconds = deliveryTime.from(currentTime)


        console.log(remainingMilliSeconds)

        let timeRemaining = setInterval(function () {

            if (remainingMilliSeconds <= 0) {
                clearInterval(timeRemaining)
                return
            }

            let remainingSeconds = (remainingMilliSeconds) / 1000
            let minutesRemain = Math.floor(remainingSeconds / 60)
            let secondsRemain = remainingSeconds % 60

            let dislayTime = minutesRemain + ":" + secondsRemain;

            return dislayTime
        }, 1000)
    }

    sendingandDeliveryRender = () => {

        let currentTime = Date.now()

        let deliveryTime = new Date(this.props.eta)
        deliveryTime = deliveryTime.getTime()

        if (currentTime < deliveryTime) {
            return (
                <Box component="span" className="timeDelivered crewDeliveryChatText">
                    Time Remaining: {this.countdown()}
                </Box>
            )
        } else {
            return (
                <Box component="span" className="timeDelivered crewDeliveryChatText">
                    {this.sendingText()}: {this.props.timeDelivered}
                </Box>
            )
        }
    }

    messageColor = () => {
        let thisUser = JSON.parse(localStorage.getItem("User"));
        let userID = thisUser.id

        if (userID === this.props.userId) {
            return "rgb(71, 112, 235)"
        } else {
            return "rgb(112, 71, 235)"
        }
    }

    render = () => {
        return (
            <Box className="Message indivMessage otherCrew" style={{ opacity: `${this.props.opacity}` }}>
                <Grid container
                    direction="row"
                    justify="flex-start"
                    alignItems="center">
                    <Box item="true"
                        className="messageDetails youDetails"
                        justify="flex-start"
                        alignItems="center"
                    >
                        <Box item="true" className="timeDetails">
                            <Box >Sent:</Box>
                            <Box >{this.props.timeSent}</Box>
                        </Box>

                        <Box item="true" className="timeDetails">
                            <Box >{this.sendingText()}</Box>
                            <Box >{this.props.timeDelivered}</Box>
                        </Box>
                    </Box>

                    <Box item="true">
                        <Grid item container direction="column" alignItems="flex-start">
                            <Grid item container direction="row" justify="space-between" alignItems="flex-end">
                                <Box item="true" className="userNameRole">{this.props.userName}   <Box component="span" item="true" className="userRole">{this.props.userRole}</Box></Box>

                                <Box style={{position:"relative"}}>
                                <Avatar item="true" alt={`${this.props.userId}`} src={`${this.props.userImageURL}`} className="avatar" style={{ width: "25px", height: "25px", position:"absolute", bottom:"100%", right:"100%" }} />
                                </Box>
                            </Grid>

                            <Box item="true"
                                className="chatBubble"
                                justify="center"
                                alignItems="flex-start"
                                style={{ backgroundColor: `${this.messageColor()}` }}
                            >
                                <Box className="messageSubject">{this.props.messageSubject}</Box>
                                <Box className="messageText">{this.props.messageMessageBody}</Box>
                                <Box>

                                    {this.messageStatus()}
                                    {this.sendingandDeliveryRender()}
                                </Box>

                            </Box>
                        </Grid>
                    </Box>
                </Grid>
            </Box>
        )
    }
}

export default YourSide;