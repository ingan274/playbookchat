import React, { Component } from "react";
import "./style.css";
import { Grid, Box, Avatar } from '@material-ui/core';
import MessageStatus from "../mesageStatusIcons"
import moment from "moment";
// import API from '../../API-Calls'


class YourSide extends Component {

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
        let deliveryTime = moment(this.props.eta);
        let remainingMilliSeconds = deliveryTime.diff(currentTime)
        let display = moment(remainingMilliSeconds).format('mm:ss')
        return display
    }

    sendingandDeliveryRender = () => {

        return (
            <Box component="span" className="timeDelivered crewDeliveryChatText">
                Delivered: {this.props.timeDelivered}
            </Box>
        )
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

    addPhoto = () => {
        if (this.props.attachmentSrc) {
            return <img src={this.props.attachmentSrc} alt="upload" className="messageImage" />
        }
    }

    render = () => {
        return (
            <Box className="Message indivMessage otherCrew" style={{ opacity: `${this.props.opacity}` }}>
                <Grid container
                    direction="row"
                    justify="flex-start"
                    alignItems="center">
                         <Box item="true" style={{margin: "0px 10px 0px 5px " }}>
                        <Avatar item="true" alt={`${this.props.userId}`} src={`${this.props.userImageURL}`} className="avatar" style={{ width: "45px", height: "45px" }} />
                    </Box>
                    <Box item="true" >
                        <Grid item container direction="column" alignItems="flex-start">
                            <Box item="true" className="userNameRole">{this.props.userName}   <Box component="span" item="true" className="userRole">{this.props.userRole}</Box></Box>

                            <Box item="true"
                                className="chatBubble otherChatBbl"
                                justify="center"
                                alignItems="flex-start"
                                style={{backgroundColor: `${this.messageColor()}` }}
                            >
                                <Box className="messageSubject">{this.props.messageSubject}</Box>
                                <Box className="messageText">{this.props.messageMessageBody}</Box>
                                {this.addPhoto()}
                                <Box className="timeDelivered crewDeliveryChatText">
                                    {this.props.timeDelivered}
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