import React, { Component } from "react";
import "./style.css";
import { Grid, Box, Avatar } from '@material-ui/core';
import PriorityHighOutlinedIcon from '@material-ui/icons/PriorityHighOutlined';
import YourSideMess from "../YoursideMessage"


class New extends Component {

    priorityIcon = () => {
        if (this.props.priority) {
            return <PriorityHighOutlinedIcon color="action"/>
        }
    }

    addPhoto = () => {
        if (this.props.attachment) {
            return <img src={this.props.attachmentSrc} alt="upload" className="messageImage" />
        }
    }


    handleObsolete = (messageID) => {
        this.props.markObsolete(messageID)
    }

    handlePriorityAdd = (messageID) => {
        this.props.priorityAdd("add", messageID)
    }

    handlePriorityRemove = (messageID) => {
        this.props.priorityRemove("remove", messageID)
    }

    messageColor = () => {
        if (this.props.obsolete) {
            return "rgba(149, 149, 149, 0.70)"
        } else {
            if (this.props.priority) {
                return "rgb(190, 53, 53, .7)"
            } else {
                return "rgba(149, 149, 149, 1)"
            }
            
        }
    }

    textColor = () => {
        if (this.props.obsolete) {
            return "rgba(225, 225, 225, 0.850)"
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
        if (this.props.priority) {
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

    render = () => {
        let userObj = JSON.parse(localStorage.getItem("User"));
        let clientLocation = userObj.location
        let messageLocation;

        if (this.props.location) {
            messageLocation = 'mars'
        } else {
            messageLocation = 'earth'
        }


        if (clientLocation === messageLocation) {
            if (this.props.attachment) {
                return (
                    <YourSideMess
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
                        eta={this.props.eta}
                        attachmentSrc={this.props.attachmentSrc}

                        markObsolete={(messageID) => this.handleObsolete(messageID)}
                        obsolete={this.props.obsolete}
                        obsoleteUser={this.props.obsoleteUser}
                        obsoleteTime={this.props.obsoleteTime}
                        obsoletePress={this.props.obsoletePress}

                        priority={this.props.priority}
                        priorityPress={this.props.priorityPress}
                        removePriority={(messageID) => this.handlePriorityRemove(messageID)}
                        addPriority={(messageID) => this.handlePriorityAdd(messageID)}
                    />)
            } else {
                return (
                    <YourSideMess
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
                        eta={this.props.eta}

                        markObsolete={(messageID) => this.handleObsolete(messageID)}
                        obsolete={this.props.obsolete}
                        obsoleteUser={this.props.obsoleteUser}
                        obsoleteTime={this.props.obsoleteTime}
                        obsoletePress={this.props.obsoletePress}

                        priority={this.props.priority}
                        priorityPress={this.props.priorityPress}
                        removePriority={(messageID) => this.handlePriorityRemove(messageID)}
                        addPriority={(messageID) => this.handlePriorityAdd(messageID)}
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

                        <Box className="messageArea" item="true">
                            <Grid item container direction="column" alignItems="flex-start">
                                <Box item="true" className="userNameRole">{this.props.userName}   <Box component="span" item="true" className="userRole">{this.props.userRole}</Box></Box>

                                <Box item="true"
                                    className={`chatBubble otherChatBbl ${this.priorityClass()}`}
                                    justify="center"
                                    alignItems="flex-start"
                                    style={{ backgroundColor: `${this.messageColor()}` }}
                                >
                                    <Box className="messageSubject" style={{ color: `${this.textColor()}`, fontSize: `${this.prioritySubject()}` }}>{this.priorityIcon()} {this.props.messageSubject}</Box>
                                    <Box className="messageText" style={{ color: `${this.textColor()}`, fontWeight: `${this.priorityBody()}`  }}>{this.props.messageMessageBody}</Box>
                                    {this.addPhoto()}
                                </Box>
                            </Grid>
                        </Box>
                        <Box item="true" direction="column" alignItems="center" justify="center" className="centerDetails" style={{ margin: "0px 0px 0px 10px" }}>
                            <Box item="true" className="timeDetails sentTime">
                                <Box >Sent:</Box>
                                <Box >{this.props.timeSent}</Box>
                            </Box>
                            <Avatar item="true" alt={`${this.props.userId}`} src={`${this.props.userImageURL}`} className="avatar" style={{ width: "30px", height: "30px", margin: "0px auto" }} />
                            <Box item="true" className="timeDetails deliveryTime">
                                <Box >Delivered:</Box>
                                <Box >{this.props.timeDelivered}</Box>
                            </Box>

                        </Box>
                    </Grid>
                </Box>
            )

        }

    }


}

export default New;

//  return (
//                 <Box className="Message indivMessage">
//                     <Grid container
//                         direction="row"
//                         justify="flex-start"
//                         alignItems="center">
//                         <Box item="true"
//                             className="chatBubble"
//                             justify="center"
//                             alignItems="flex-start">


//                             <Box item="true" className="messageSubject">{this.props.messageSubject}</Box>
//                             <Box item="true" className="messageText">{this.props.messageMessageBody}</Box>
//                             <Box item="true" className="timeDelivered">{this.sendingText()}: {this.props.timeDelivered}</Box>
//                         </Box>

//                         <Box className="userNameRole">
//                             <Grid container
//                                 justify="center"
//                                 alignItems="center">
//                                 <Avatar item="true" alt={`${this.props.userId}`} src={`${this.props.userImageURL}`} className="avatar" style={{ width: "40px", height: "40px" }} />
//                                 <Box item="true" className="userName">{this.props.userName}</Box>
//                                 <Box item="true" className="userRole">{this.props.userRole}</Box>
//                             </Grid>
//                         </Box>

//                         <Box item="true"
//                             className="messageDetails"
//                             justify="flex-start"
//                             alignItems="center"
//                         >
//                             <Box item="true" className="timeDetails">
//                                 <Box >Sent:</Box>
//                                 <Box >{this.props.timeSent}</Box>
//                             </Box>

//                             <Box item="true" className="timeDetails">
//                                 <Box >{this.sendingText()}</Box>
//                                 <Box >{this.props.timeDelivered}</Box>
//                             </Box>
//                         </Box>
//                     </Grid>
//                 </Box>
//             )