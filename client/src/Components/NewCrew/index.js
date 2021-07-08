import React, { Component } from "react";
import "./style.css";
import { Grid, Box, Avatar } from '@material-ui/core';
import YourSideMess from "../YoursideMessageCrew"


class New extends Component {

    addPhoto = () => {
        if (this.props.attachment) {
            return <img src={this.props.attachmentSrc} alt="upload" className="messageImage" />
        }
    }

    render = () => {
        let userObj = JSON.parse(localStorage.getItem("User"));
        let client = userObj.id



        if (client === this.props.userId) {
            if (this.props.attachment) {
                return (
                    <YourSideMess
                        opacity="100%"
                        key={this.props.messageID}
                        messageID={this.props.messageID}
                        sending={this.props.sending}
                        expresp={this.props.expresp}
                        messageSubject={this.props.messageSubject}
                        messageMessageBody={this.props.messageMessageBody}
                        userName={this.props.userName}
                        userRole={this.props.userRole}
                        userId={this.props.userId}
                        userImageURL={this.props.userImageURL}
                        timeSent={this.props.timeSent}
                        timeDelivered={this.props.timeDelivered}
                        clientUser={this.props.clientUser}
                        eta=""
                        attachmentSrc={this.props.attachmentSrc}
                        groupChat = "crew-chats"
                    />)
            } else {
                return (
                    <YourSideMess
                        opacity="100%"
                        key={this.props.messageID}
                        messageID={this.props.messageID}
                        sending={this.props.sending}
                        expresp={this.props.expresp}
                        messageSubject={this.props.messageSubject}
                        messageMessageBody={this.props.messageMessageBody}
                        userName={this.props.userName}
                        userRole={this.props.userRole}
                        userId={this.props.userId}
                        userImageURL={this.props.userImageURL}
                        timeSent={this.props.timeSent}
                        timeDelivered={this.props.timeDelivered}
                        clientUser={this.props.clientUser}
                        eta=""
                        groupChat = "crew-chats"
                    />
                )
            }
        } else {
            return (
                <Box className="otherMessage indivMessage">
                    <Grid container
                        direction="row"
                        justify="flex-end"
                        alignItems="center">

                        <Box item="true">
                            <Grid item container direction="column" alignItems="flex-start">
                                <Grid item container direction="row" justify="space-between" alignItems="flex-end">
                                    <Box style={{ position: "relative" }}>
                                        <Avatar item="true" alt={`${this.props.userId}`} src={`${this.props.userImageURL}`} className="avatar" style={{ width: "25px", height: "25px", position: "absolute", bottom: "100%", left: "100%" }} />
                                    </Box>
                                    <Box item="true" className="userNameRole">{this.props.userName}   <Box component="span" item="true" className="userRole">{this.props.userRole}</Box></Box>
                                </Grid>
                                <Box item="true"
                                    className="chatBubble otherChatBbl"
                                    justify="center"
                                    alignItems="flex-start"
                                >
                                    <Box className="messageSubject">{this.props.messageSubject}</Box>
                                    <Box className="messageText">{this.props.messageMessageBody}</Box>
                                    {this.addPhoto()}
                                    <Box className="timeDelivered">
                                        Delivered: {this.props.timeDelivered}
                                    </Box>
                                </Box>
                            </Grid>
                        </Box>
                    </Grid>
                </Box>
            )
        }

    }


}

export default New;