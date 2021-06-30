import React, { Component } from "react";
import "./style.css";
import { Grid, Box, Avatar } from '@material-ui/core';
import Sent from '@material-ui/icons/ChatBubbleRounded';
import Sending from '@material-ui/icons/ChatBubbleRounded';
import EarliestRespAvail from '@material-ui/icons/AnnouncementRounded';


class New extends Component {
    sendingText = () => {
        return (this.props.sending === "true" ? "ETA" : "Delivered");
    };

    messageStatus = () => {
        if (this.props.sending === "true" && this.props.expected_res === "false") {
            return (
                <Grid container item
                    direction="row"
                    justify="flex-start"
                    alignItems="center">
                    <Sending />
                    <Box>{this.props.countdown}</Box>
                </Grid>
            )
        } else if (!this.props.sending === "false" && !this.props.expected_res === "false") {
            return <Sent />
        } else if (!this.props.sending === "false" && this.props.expected_res === "true") {
            return <EarliestRespAvail />
        }

    }
    render = () => {
        if (this.props.location) {
            return (
                <Box className="Message">
                    <Grid container
                        direction="row"
                        justify="flex-start"
                        alignItems="center">
                        <Box item="true"
                            className="chatBubble"
                            justify="center"
                            alignItems="flex-start">


                            <Box item="true" className="messageSubject">{this.props.messageSubject}</Box>
                            <Box item="true" className="messageText">{this.props.messageMessageBody}</Box>
                            <Box item="true" className="timeDelivered">{this.sendingText()}: {this.props.timeDelivered}</Box>
                        </Box>

                        <Box item="true"
                            className="userNameRole"
                            justify="flex-start"
                            alignItems="center">
                            <Avatar item="true" alt={`${this.props.userId}`} src={`${this.props.userImageURL}`} className="avatar" style={{width:"22px", height:"22px"}}/>
                            <Box item="true">{this.props.userName}</Box>
                            <Box item="true">{this.props.userRole}</Box>
                        </Box>

                        <Box item="true"
                            className="messageDetails"
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
                    </Grid>
                </Box>
            )
        } else {
            return (
                <Box className="otherMessage">
                    <Grid container
                        direction="row"
                        justify="flex-end"
                        alignItems="center">

                        <Box item="true"
                            className="messageDetails"
                            direction="column"
                            justify="flex-start"
                            alignItems="center"
                        >
                            <Box item="true" className="timeDetails">
                                <Box >Sent:</Box>
                                <Box >{this.props.timeSent}</Box>
                            </Box>

                            <Box item="true" className="timeDetails">
                                <Box >Delivered:</Box>
                                <Box >{this.props.timeDelivered}</Box>
                            </Box>
                        </Box>

                        <Box item="true"
                            className="userNameRole"
                            direction="column"
                            justify="flex-start"
                            alignItems="center">
                            <Avatar item="true" alt={`${this.props.userId}`} src={`${this.props.userImageURL}`} className="avatar" style={{width:"22px", height:"22px"}} />
                            <Box item="true">{this.props.userName}</Box>
                            <Box item="true">{this.props.userRole}</Box>
                        </Box>


                        <Box item="true"
                            className="chatBubble"
                            direction="column"
                            justify="center"
                            alignItems="flex-start">
                            <Box item="true" className="messageSubject">{this.props.messageSubject}</Box>
                            <Box item="true" className="messageText">{this.props.messageMessageBody}</Box>
                            <Box item="true" className="timeDelivered">Delivered: {this.props.timeDelivered}</Box>
                        </Box>
                    </Grid>
                </Box>
            )
        }

    }


}

export default New;