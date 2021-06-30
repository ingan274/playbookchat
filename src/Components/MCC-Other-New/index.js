import React, { Component } from "react";
import "./style.css";
import { Grid, Box, Avatar } from '@material-ui/core';


class MCCOtherNew extends Component {

    render = () => {
        return (
            <Box className="otherMessage">
                <Grid container
                    direction="row"
                    justify="flex-end"
                    alignItems="center">

                    <Box item container
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

                    <Box item container
                        className="userNameRole"
                        direction="column"
                        justify="flex-start"
                        alignItems="center">
                        <Avatar item="true" alt={`${this.props.userId}`} src={`${this.props.userImageURL}`} className="avatar"/>
                        <Box item="true">{this.props.userName}</Box>
                        <Box item="true">{this.props.userRole}</Box>
                    </Box>


                    <Box container item
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

export default MCCOtherNew;