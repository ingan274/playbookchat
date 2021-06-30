import "./style.css";
import React, { Component } from "react";
import { Grid, Box } from '@material-ui/core';

import New from "../Components/New";
// import YouReply from "../Components/You-Reply";
// import OtherNew from "../Components/MCC-Other-New";
// import OtherReply from "../Components/MCC-Other-Reply";

import API from "../API-Calls";

class Playbook extends Component {
    constructor(props) {
        super(props);

        let userObj = JSON.parse(localStorage.getItem("User"));
        let profileArray = JSON.parse(localStorage.getItem("Profiles"));

        this.state = {
            userName: userObj.name,
            userRole: userObj.role,
            userLocation: userObj.location,
            userId: userObj.id,
            userImageURL: userObj.imageURL,
            profiles: profileArray,
            chat: [],
        }

    }

    // getting data functions
    componentDidMount = () => {
        this.getMessages();
    }

    getMessages = () => {
        API.getMCCCrew((this.state.userLocation), (this.state.userId)).then((res) => {

            this.setState({
                chat: res.data
            })

        })

    }

    getTime = (time) => {

        let timestamp = time.slice(11,)

        return timestamp
    }

    getUserInfo = (thisUser) => {

        for (let user of this.state.profiles) {
            if (user.id === thisUser) {
                return {
                    name: user.name,
                    imageURL: user.imageURL,
                    role: user.role
                }
            }
        }

    }

    // input functions
    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        })
    }

    renderMessages = () => {
        return (
            <Box className="ChatBox" item="true">
                {this.state.chat.map((item, index) => {

                    return (
                        <New
                            key={index.toString()}
                            messageID={item._id}
                            location={item.location}
                            sending={item.sending}
                            expresp={item.expected_resp}
                            messageSubject={item.message.subject}
                            messageMessageBody={item.message.messageBody}
                            userName={this.getUserInfo(item.sender).name}
                            userRole={this.getUserInfo(item.sender).role}
                            userId={item.sender}
                            userImageURL={this.getUserInfo(item.sender).imageURL}
                            timeSent={this.getTime(item.timeSent)}
                            timeDelivered={this.getTime(item.timeDelivered)}
                            eta={item.timeDelivered}
                        />
                    )
                })}
            </Box>
        )
    }

    render = () => {
        return (
            <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="center"
            >
                <Box
                    item="true"
                    className="timeline splitScreen">
                    Timeline Here
                </Box>
                <Box
                    item="true"
                    className="clDiv splitScreen">

                    <Box className="chatPanelL">
                        <Box className="buttons">ML</Box>
                        <Box className="buttons current">MCC & Crew</Box>
                        <Box className="buttons">Crew</Box>
                        <Box className="buttons task1">Task 1</Box>
                    </Box>
                    <Box>
                    {this.renderMessages()}

                    </Box>
                   

                </Box>
            </Grid>
        )
    }
}

export default Playbook;