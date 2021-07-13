import React, { Component } from "react";
import "./style.css";
import { Grid, Box, Avatar, IconButton } from '@material-ui/core';
import MessageStatus from "../mesageStatusIcons"
import PriorityHighOutlinedIcon from '@material-ui/icons/PriorityHighOutlined';
import SpeakerNotesOffOutlinedIcon from '@material-ui/icons/SpeakerNotesOffOutlined';
import LowPriorityOutlinedIcon from '@material-ui/icons/LowPriorityOutlined';
import moment from "moment";
// import API from '../../API-Calls'


class YourSide extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isSentShown: false
        }
    }

    priorityIcon = () => {
        if (this.props.priority) {
            return <PriorityHighOutlinedIcon fontSize="small" />
        }
    }


    sendingText = () => {
        // return (this.props.sending ? "ETA" : "Estimated Deliverey");

        if (this.props.sending && !this.props.expresp) {
            return "ETA"
        } else if (!this.props.sending && !this.props.expresp) {
            return "Estimated Delivery"
        } else if (!this.props.sending && this.props.expresp) {
            return "Delivery"
        }
    };

    messageStatus = () => {
        if (this.props.sending && !this.props.expresp) {
            // Sending
            return (
                <MessageStatus sent="rgba(225, 225, 225, .3)" ert="rgba(255, 255, 255, .3)" />
            )
        } else if (!this.props.sending && this.props.expresp) {
            // send, and response if avail
            return <MessageStatus sent="rgba(255, 255, 255, .9)" ert="rgba(1255, 255, 255, .9)" />
        } else {
            // sent, but time hasnt been reached for response
            return <MessageStatus sent="rgba(255, 255, 255, .9)" ert="rgba(255, 255, 255, .3)" />
        }

    }

    countdown = () => {
        let currentTime = moment();
        let deliveryTime = moment(this.props.eta);
        let remainingMilliSeconds = deliveryTime.diff(currentTime)
        let display = moment(remainingMilliSeconds).format('mm:ss')
        return display
    }

    sendingandDeliveryRender = () => {

        return (
            <Box component="span" className="timeDelivered crewDeliveryChatText">
                {this.sendingText()}: {this.props.timeDelivered}
            </Box>
        )
    }

    sendingandDeliveryRenderTL = () => {

        let currentTime = Date.now()

        let deliveryTime = new Date(this.props.eta)
        deliveryTime = deliveryTime.getTime()

        if (currentTime < deliveryTime) {
            return (
                <Box component="span" item="true" className="timeDetails deliveryTime">
                    <Box>Time Remaining:</Box>
                    <Box>{this.countdown()}</Box>
                </Box>
            )
        } else {
            return (
                <Box component="span" item="true" className="timeDetails deliveryTime">
                    <Box>{this.sendingText()}:</Box>
                    <Box>{this.props.timeDelivered}</Box>

                </Box>
            )
        }
    }

    messageColor = () => {
        let thisUser = JSON.parse(localStorage.getItem("User"));
        let userID = thisUser.id

        if (userID === this.props.userId && this.props.sending) {
            if (this.props.priority) {
                return "rgb(190, 53, 53, .5)"
            } else {
                return "rgba(71, 112, 235, .5)"

            }
        } else if (userID === this.props.userId && !this.props.sending) {
            if (this.props.obsolete) {
                return "rgba(149, 149, 149, 0.70)"
            } else {
                if (this.props.priority) {
                    return "rgb(190, 53, 53, .7)"
                } else {
                    return "rgba(71, 112, 235, .9)"
                }
            }
        } else {
            if (this.props.obsolete) {
                return "rgba(149, 149, 149, 0.70)"
            } else {
                if (this.props.priority) {
                    return "rgb(190, 53, 53, .7)"
                } else {
                    return "rgba(112, 71, 235, .9)"

                }

            }
        }
    }

    textColor = () => {
        if (this.props.obsolete) {
            return "rgba(225, 225, 225, 0.80)"
        } else {
            return "white"
        }
    }

    prioritySubject = () => {
        if (this.props.priority) {
            return "14px"
        }
    }

    priorityClass = () => {
        if (this.props.priority && !this.props.sending) {
            return "priorityMessage"
        }
    }

    priorityBody = () => {
        if (this.props.priority) {
            return "600"
        } else {
            return "400"
        }
    }

    addPhoto = () => {
        if (this.props.attachmentSrc) {
            return (
                <Box><img src={this.props.attachmentSrc} alt="upload" className="messageImage" /></Box>
            )
        }
    }

    iconsRender = () => {
        // if priority and P-pressed
        if (this.props.priority && this.props.priorityPress) {
            return (
                <IconButton
                    size="small"
                    onClick={this.props.removePriority}
                    className="messageButton"
                >
                    <LowPriorityOutlinedIcon />
                </IconButton>
            )
        } else if (this.props.priority && !this.props.priorityPress) {
            // if priority and P-not-pressed
            return (
                <Box className="obsoleteText">
                    <IconButton
                        size="small"
                        className="messageButton"
                    >
                        <PriorityHighOutlinedIcon />
                    </IconButton>

                    Sending Update
                </Box >
            )
        } else if (!this.props.priority && this.props.priorityPress) {
            // if not Priority and P-pressed
            return (
                <Box className="obsoleteText">
                    <IconButton
                        size="small"
                        className="messageButton"
                    >
                        <PriorityHighOutlinedIcon color="secondary" />
                    </IconButton>
                    Sending Update
                </Box>
            )
        } else if (this.props.obsoletePress && !this.props.obsolete) {
            // if not Obsolete and O-pressed
            let obsoleteMessage = "Marked as irrelevent. Update is being sent."
            return (
                <Box className="obsoleteText">
                    {obsoleteMessage}
                </Box>
            )
        } else if (this.props.obsoletePress && this.props.obsolete) {
            // if Obsolete and O-pressed
            let obsoleteMessage = `${this.props.obsoleteUser} marked as irrelevent at ${this.props.obsoleteTime}`
            return (
                <Box className="obsoleteText">
                    {obsoleteMessage}
                </Box>
            )
        } else {
            return (
                <Box>
                    <IconButton
                        size="small"
                        onClick={this.props.markObsolete}
                        className="messageButton"
                    >
                        <SpeakerNotesOffOutlinedIcon />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={this.props.addPriority}
                        className="messageButton"
                    >
                        <PriorityHighOutlinedIcon />
                    </IconButton>
                </Box>
            )
        }


    }

    render = () => {
        return (
            <Box className="Message indivMessage otherCrew">
                <Grid container
                    direction="row"
                    justify="flex-start"
                    alignItems="center">
                    {/* <Box item="true" direction="column" alignItems="center" justify="center" style={{ margin: "0px 10px 0px 0px" }} onMouseEnter={this.setSentTime(true)} onMouseLeave={this.setSentTime(false)}> */}
                    <Box item="true" direction="column" alignItems="center" justify="center" className="centerDetails" style={{ margin: "0px 10px 0px 0px" }}>
                        {/* {this.renderSentTime()} */}
                        <Box item="true" className="timeDetails sentTime">
                            <Box >Sent:</Box>
                            <Box >{this.props.timeSent}</Box>
                        </Box>
                        <Avatar item="true" alt={`${this.props.userId}`} src={`${this.props.userImageURL}`} className="avatar" style={{ width: "30px", height: "30px", margin: "0px auto" }} />

                        <Box >{this.sendingandDeliveryRenderTL()}</Box>
                    </Box>
                    <Box className="messageArea" item="true">
                        <Grid item container direction="column" alignItems="flex-start">
                            <Box item="true" className="userNameRole">{this.props.userName} <Box component="span" item="true" className="userRole">{this.props.userRole}</Box></Box>

                            <Box item="true"
                                className={`chatBubble ${this.priorityClass()}`}
                                justify="center"
                                alignItems="flex-start"
                                style={{ backgroundColor: `${this.messageColor()}` }}
                            >
                                <Box className="messageSubject" style={{ color: `${this.textColor()}`, fontSize: `${this.prioritySubject()}` }}><Grid container direction="row" alignItem="center"><Box item="true">{this.priorityIcon()}</Box> <Box item="true">{this.props.messageSubject}</Box></Grid></Box>
                                <Box className="messageText" style={{ color: `${this.textColor()}`, fontWeight: `${this.priorityBody()}` }}>{this.props.messageMessageBody}</Box>
                                {this.addPhoto()}

                                {this.messageStatus()}
                                {this.sendingandDeliveryRender()}

                            </Box>
                        </Grid>
                        {this.iconsRender()}
                    </Box>

                </Grid>
            </Box >
        )
    }
}

export default YourSide;