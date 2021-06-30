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

    renderMessages = () => {
        return (
            <Box className="ChatBox">
                {this.state.chat.map((item, index) => {

                    return (
                        <New
                            key={index.toString()}
                            messageID={item._id}
                            location={item.location}
                            sending={item.sending}
                            expected_res={item.expected_res}
                            messageSubject={item.message.subject}
                            messageMessageBody={item.message.messageBody}
                            userName=""
                            userRole=""
                            userId={item.sender}
                            userImageURL=""
                            timeSent={this.getTime(item.timeSent)}
                            timeDelivered={this.getTime(item.timeDelivered)}
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
                justify="flex-end"
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
                    <Grid
                        container item
                        direction="row"
                    >
                        <Box className="chatPanelL">

                        </Box>
                        {this.renderMessages()}
                    </Grid>
                </Box>
            </Grid>
        )
    }
}

export default Playbook;