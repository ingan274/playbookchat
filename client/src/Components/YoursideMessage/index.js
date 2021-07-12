import React, { Component } from "react";
import "./style.css";
import { Grid, Box, Avatar } from '@material-ui/core';
import MessageStatus from "../mesageStatusIcons"
import moment from "moment";
// import API from '../../API-Calls'


class YourSide extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isSentShown: false
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

        if (userID === this.props.userId) {
            return "rgba(71, 112, 235, .8)"
        } else {
            return "rgba(112, 71, 235, .8)"
        }
    }

    addPhoto = () => {
        if (this.props.attachmentSrc) {

            return (
                <Box><img src={this.props.attachmentSrc} alt="upload" className="messageImage" /></Box>
            )
        }
    }

    // setSentTime = (show) => {

    //     this.setState({
    //         isSentShown: show
    //     })

    // }

    // renderSentTime = () => {
    //     if (this.state.isSentShown) {
    //         return (
    //             <Box item="true" className="timeDetails sentTime">
    //                 <Box >Sent:</Box>
    //                 <Box >{this.props.timeSent}</Box>
    //             </Box>
    //         )

    //     } else {
    //         return (
    //             <Box item="true" className="timeDetails sentTime" style={{ display: "hidden" }}>
    //                 <Box >Sent:</Box>
    //                 <Box >{this.props.timeSent}</Box>
    //             </Box>
    //         )
    //     }
    // }

    render = () => {
        return (
            <Box className="Message indivMessage otherCrew" style={{ opacity: `${this.props.opacity}` }}>
                <Grid container
                    direction="row"
                    justify="flex-start"
                    alignItems="center">
                    {/* <Box item="true" direction="column" alignItems="center" justify="center" style={{ margin: "0px 10px 0px 0px" }} onMouseEnter={this.setSentTime(true)} onMouseLeave={this.setSentTime(false)}> */}
                    <Box item="true" direction="column" alignItems="center" justify="center" className="centerDetails" style={{ margin: "0px 10px 0px 0px"}}>
                        {/* {this.renderSentTime()} */}
                        <Box item="true" className="timeDetails sentTime">
                            <Box >Sent:</Box>
                            <Box >{this.props.timeSent}</Box>
                        </Box>
                        <Avatar item="true" alt={`${this.props.userId}`} src={`${this.props.userImageURL}`} className="avatar" style={{ width: "30px", height: "30px", margin: "0px auto" }} />

                        <Box >{this.sendingandDeliveryRenderTL()}</Box>
                    </Box>
                    <Box item="true">
                        <Grid item container direction="column" alignItems="flex-start">
                            <Box item="true" className="userNameRole">{this.props.userName}   <Box component="span" item="true" className="userRole">{this.props.userRole}</Box></Box>

                            <Box item="true"
                                className="chatBubble"
                                justify="center"
                                alignItems="flex-start"
                                style={{ backgroundColor: `${this.messageColor()}` }}
                            >
                                <Box className="messageSubject">{this.props.messageSubject}</Box>
                                <Box className="messageText">{this.props.messageMessageBody}</Box>
                                {this.addPhoto()}

                                {this.messageStatus()}
                                {this.sendingandDeliveryRender()}

                            </Box>
                        </Grid>
                    </Box>

                </Grid>
            </Box >
        )
    }
}

export default YourSide;