import React, { Component } from "react";
import "./style.css";
import { Grid, Box, Avatar } from '@material-ui/core';

import YourSideMess from "../YoursideMessage"


class New extends Component {

    render = () => {
        if (this.props.location) {

            if (this.props.sending) {
                return (
                    <YourSideMess
                        opacity="50%"
                        key={this.props.key}
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
                    />
                )
            } else {
                return (
                    <YourSideMess
                        opacity="100%"
                        key={this.props.key}
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
                                    <Box className="timeDelivered">
                                        Delivered: {this.props.timeDelivered}
                                    </Box>
                                </Box>
                            </Grid>
                        </Box>

                        <Box item="true"
                            className="messageDetails otherDetails"
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