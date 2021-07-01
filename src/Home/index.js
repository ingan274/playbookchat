import "./style.css";
import React, { Component } from "react";
import { Grid, Box } from '@material-ui/core';
import dateTime from "../API-Calls/chatDelay"
import API from "../API-Calls";
import New from "../Components/New";
import AttachFileRoundedIcon from '@material-ui/icons/AttachFileRounded';
import SendRoundedIcon from '@material-ui/icons/SendRounded';
import moment from "moment";

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
            subject: "",
            messageBody: "",
            nextDeliveryTime: "",
            currentTime: "",
            currentDate: "",
            deliveryBSON: "",
            currentBSON: "",
        }
    }

    // getting data functions
    componentDidMount = async () => {
        this.getMessages();

        let delay = dateTime.delay;
        // Get Messages every 2 seconds
        setInterval(()=> {
            this.getMessages();
        }, 2000);


    // Update time every second
        setInterval(() => {

            let time = moment().utc().format()
            let nowTimestamp = (this.getTime(time))
            let nowDate = time.slice(0, 10)

            let delayedTimeStamp = moment().add(delay).utc().format()
            let deliveryTime = (this.getTime(delayedTimeStamp))
            this.setState({
                nextDeliveryTime: deliveryTime,
                currentTime: nowTimestamp,
                currentDate: nowDate,
                currentBSON: time.valueOf(),
                deliveryBSON: delayedTimeStamp.valueOf(),
            })

        }, 1000);
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
        timestamp = timestamp.slice(0, 8)

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

    handleSubmitMessage = event => {
        if (this.state.subject && this.state.messageBody) {
            let locationBool;
            if (this.state.userLocation === "mars") {
                locationBool = true;
            } else {
                locationBool = false;
            }
            let newMesssage = {
                groupChat: "mcc-crew-chat",
                message: {
                    subject: this.state.subject,
                    messageBody: this.state.messageBody
                },
                urgent: false,
                priority: false,
                sender: this.state.userId,
                location: locationBool,
                sentTime: this.state.currentBSON,
                deliveryTime: this.state.deliveryBSON,
            }

            API.newMCCCrew(newMesssage);

            this.setState({
                subject: "",
                messageBody: "",
            })
            this.getMessages();
        }


    }

    // Renderings
    renderMessages = () => {
        return (
            <Box className="ChatBox chatMessDiv" item="true">
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
                direction="column"
                justify="flex-start"
                alignItems="center"
            >
                <Grid item container direction="row" className="timeHeader" alignItems="center" justify="center">
                    <Box className="currentDT" mr={3}>Date: {this.state.currentDate}  Current Time: {this.state.currentTime}</Box>
                </Grid>
                <Grid
                    item container
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
                            {/* <form className="text-center">
                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="topic"
                                    name="q"
                                    value={this.state.q}
                                    onChange={this.handleInputChange}
                                />
                            </div>
                            <button className="btn" onClick={this.handleFormSubmit}>Search</button>
                        </form> */}

                            <Box className="ChatBox chatBoxInput">
                                <Grid
                                    container
                                    direction="row"
                                    justify="space-between"
                                    alignItems="center">
                                    <AttachFileRoundedIcon style={{ width: "20px", height: "20px", marginLeft: "10px", color: "grey" }} />
                                    <form className="form-control">
                                        <input
                                            type="text"
                                            className="inputArea"
                                            name="subject"
                                            value={this.state.subject}
                                            onChange={this.handleInputChange}
                                            placeholder="Subject"
                                        />
                                        <input
                                            type="text"
                                            className="inputArea"
                                            name="messageBody"
                                            value={this.state.messageBody}
                                            onChange={this.handleInputChange}
                                            placeholder={`Estimated Time of Arrival: ${this.state.nextDeliveryTime}`}
                                        />
                                    </form>
                                    <SendRoundedIcon style={{ width: "20px", height: "20px", margin: "0px 5px", color: "grey" }} onClick={this.handleSubmitMessage} />

                                </Grid>

                            </Box>
                        </Box>


                    </Box>
                </Grid>
            </Grid>
        )
    }
}

export default Playbook;