import "./style.css";
import React, { Component } from "react";
import { Grid, Box } from '@material-ui/core';
import API from "../API-Calls";
import New from "../Components/NewCrew";
import AttachFileRoundedIcon from '@material-ui/icons/AttachFileRounded';
import SendRoundedIcon from '@material-ui/icons/SendRounded';
import moment from "moment";
import {
    Link,
} from "react-router-dom";

let imageData;

let url = new URL(window.location.href)
let hostname = url.hostname
console.log(hostname)

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
            // subject: "",
            messageBody: "",
            nextDeliveryTime: "",
            currentTime: "",
            currentDate: "",
            currentBSON: "",

            uploadedImage: "",
        }
    }

    // getting data functions
    componentDidMount = async () => {
        this.getMessages();
        // Get Messages every 2 seconds
        setInterval(() => {
            this.getMessages();
        }, 20000);


        // Update time every second
        setInterval(() => {

            let time = moment().utc().format()
            let nowTimestamp = (this.getTime(time))
            let nowDate = time.slice(0, 10)

            this.setState({
                currentTime: nowTimestamp,
                currentDate: nowDate,
                currentBSON: time.valueOf()
            })

        }, 1000);
    }

    getMessages = () => {
        API.getCrew(this.state.userId).then((res) => {
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
                    role: user.roles
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
        let newMesssage;
        if (this.state.messageBody && this.state.uploadedImage === "") {

            newMesssage = {
                message: {
                    subject: this.state.subject,
                    messageBody: this.state.messageBody
                },
                sender: this.state.userId,
                deliveryTime: this.state.currentBSON,
            }

            API.newCrew(newMesssage);

            this.setState({
                subject: "",
                messageBody: ""
            })
            this.getMessages();
        } else if (this.state.uploadedImage !== "") {

            let message = {
                // subject: this.state.subject,
                messageBody: this.state.messageBody
            }

            newMesssage = new FormData();

            // This turns all booleans into strings!!
            newMesssage.append("message", message)
            newMesssage.append("sender", this.state.userId)
            newMesssage.append("deliveryTime", this.state.currentBSON)
            newMesssage.append("imageData", imageData)
            newMesssage.append("imageName", "image" + Date.now())

            API.newCrewPhoto(newMesssage);
            this.setState({
                subject: "",
                messageBody: "",
                uploadedImage: ""
            })
            this.getMessages();

        }


    }

    // Renderings
    renderMessages = () => {
        if (this.state.chat.length > 0) {
            return (
                <Box className="ChatBox chatMessDiv" item="true">
                    {this.state.chat.map((item, index) => {
                        // console.log(item)
                        if (item.attachment) {
                            // console.log(`${hostname}/${item.attachment.imageData}`)
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
                                    timeSent={this.getTime(item.timeDelivered)}
                                    timeDelivered={this.getTime(item.timeDelivered)}
                                    userImageURL={this.getUserInfo(item.sender).imageURL}
                                    attachment={item.attachment.attachment}
                                    attachmentSrc={`/${item.attachment.imageData}`}
                                />
                            )
                        } else {
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
                                    timeSent={this.getTime(item.timeDelivered)}
                                    timeDelivered={this.getTime(item.timeDelivered)}
                                    userId={item.sender}
                                    userImageURL={this.getUserInfo(item.sender).imageURL}
                                />
                            )
                        }


                    })}
                </Box>
            )
        } else {
            return (
                <Box className="ChatBox chatMessDiv" item="true">
                    <Box className="noMessages">No Messages so far. Compose a message below.</Box>
                </Box>
            )
        }
    }

    uploadImage = (event) => {
        // stores a readable instance of 
        // the image being uploaded using multer
        this.setState({
            uploadedImage: URL.createObjectURL(event.target.files[0])
        });
        imageData = event.target.files[0]

    }

    render = () => {
        let previewImageStyle;
        if (this.state.uploadedImage === "") {
            previewImageStyle = { display: 'none' }
        } else {
            previewImageStyle = { display: 'block' }
        }


        return (
            <Grid
                container
                direction="column"
                justify="flex-start"
                alignItems="center"
            >
                <Grid item container direction="row" className="timeHeader" alignItems="center" justify="center">
                    <Box className="currentDT" mr={3}>Date: {this.state.currentDate} <Box component="span" mr={10} ml={10}> </Box> Current Time: {this.state.currentTime}</Box>
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
                            <Link to="/playbookmcccrew">
                                <Box className="buttons">MCC & Crew</Box>
                            </Link>
                            <Link to="/playbookcrew">
                                <Box className="buttons current">Crew</Box>
                            </Link>
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
                                <form encType="multipart/form-data">
                                    <Grid
                                        container item
                                        direction="row"
                                        justify="space-between"
                                        alignItems="center">
                                        <Box item="true">
                                            <label for="imageUpload">
                                                <AttachFileRoundedIcon style={{ width: "20px", height: "20px", marginLeft: "10px", color: "grey" }} />
                                            </label>
                                            <input
                                                className="attachment"
                                                type="file"
                                                id="imageUpload" name="imageUpload"
                                                accept="image/png, image/jpeg"
                                                onChange={this.uploadImage}
                                            />
                                        </Box>

                                        <Box item="true" className="previewImage" style={previewImageStyle}>
                                            <img src={this.state.uploadedImage} alt="upload" className="previewImageAsset" />
                                        </Box>
                                        <Box item="true" className="form-control">

                                            {/* <input
                                                type="text"
                                                className="inputArea"
                                                name="subject"
                                                value={this.state.subject}
                                                onChange={this.handleInputChange}
                                                placeholder="Subject"

                                            /> */}
                                            <input
                                                type="text"
                                                className="inputArea"
                                                name="messageBody"
                                                value={this.state.messageBody}
                                                onChange={this.handleInputChange}
                                                placeholder="Text Message"
                                            />
                                        </Box>
                                        <SendRoundedIcon style={{ width: "20px", height: "20px", padding: "0px 5px", color: "grey" }} onClick={this.handleSubmitMessage} />
                                    </Grid>
                                </form>
                            </Box>
                        </Box>


                    </Box>
                </Grid>
            </Grid>
        )
    }
}

export default Playbook;