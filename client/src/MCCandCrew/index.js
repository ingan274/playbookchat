import "./style.css";
import React, { Component } from "react";
import { Grid, Box } from '@material-ui/core';
import dateTime from "../API-Calls/chatDelay"
import API from "../API-Calls";
import New from "../Components/New";
import NewCrew from "../Components/NewCrew";
import AttachFileRoundedIcon from '@material-ui/icons/AttachFileRounded';
import SendRoundedIcon from '@material-ui/icons/SendRounded';
import moment from "moment";

let imageData;

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
            crewchat: [],
            mccchat: [],
            mccsubject: "",
            crewsubject: "",
            mccmessageBody: "",
            crewmessageBody: "",
            nextDeliveryTime: "",
            currentTime: "",
            currentDate: "",
            deliveryBSON: "",
            currentBSON: "",

            crewuploadedImage: "",
            mccuploadedImage: "",
        }
    }

    // getting data functions
    componentDidMount = async () => {
        this.getMessages();

        let delay = dateTime.delay;
        // Get Messages every 1 seconds
        setInterval(() => {
            this.getMessages();
        }, 1000);

        // Scroll Down
        let cycle = 1
        let scrollDown = setInterval(() => {

            if (cycle === 0) {
                clearInterval(scrollDown)
            }
            this.scrollBottom();
            cycle--
        }, 1000);


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
                mccchat: res.data
            })
        })

        API.getCrew(this.state.userId).then((res) => {
            this.setState({
                crewchat: res.data
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

    handleSubmitMessageMCC = event => {
        event.preventDefault();
        let newMesssage;
        if (this.state.mccmessageBody && this.state.mccuploadedImage === "") {
            let locationBool;
            if (this.state.userLocation === "mars") {
                locationBool = true;
            } else {
                locationBool = false;
            }
            newMesssage = {
                groupChat: "mcc-crew-chat",
                message: {
                    subject: this.state.mccsubject,
                    messageBody: this.state.mccmessageBody
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
                mccsubject: "",
                mccmessageBody: ""
            })
            this.getMessages();
        } else if (this.state.mccuploadedImage !== "") {
            let locationBool;
            if (this.state.userLocation === "mars") {
                locationBool = true;
            } else {
                locationBool = false;
            }

            newMesssage = new FormData();

            // This turns all booleans into strings!!
            newMesssage.append("groupChat", "mcc-crew-chat")
            newMesssage.append("messageBody", this.state.mccmessageBody)
            newMesssage.append("messageSubject", this.state.mccsubject,)
            newMesssage.append("urgent", false)
            newMesssage.append("priority", false)
            newMesssage.append("sender", this.state.userId)
            newMesssage.append("location", locationBool)
            newMesssage.append("sentTime", this.state.currentBSON)
            newMesssage.append("deliveryTime", this.state.deliveryBSON)
            newMesssage.append("imageData", imageData)
            newMesssage.append("imageName", "image" + Date.now())

            API.newMCCCrewPhoto(newMesssage);
            this.setState({
                mccsubject: "",
                mccmessageBody: "",
                mccuploadedImage: ""
            })
            this.getMessages();

        }
    }

    handleSubmitMessageCrew = event => {
        event.preventDefault();
        let newMesssage;
        if (this.state.crewmessageBody && this.state.crewuploadedImage === "") {

            newMesssage = {
                message: {
                    subject: this.state.crewsubject,
                    messageBody: this.state.crewmessageBody
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
        } else if (this.state.crewuploadedImage !== "") {

            newMesssage = new FormData();

            // This turns all booleans into strings!!
            newMesssage.append("messageBody", this.state.crewmessageBody)
            newMesssage.append("messageSubject", this.state.crewsubject)
            newMesssage.append("sender", this.state.userId)
            newMesssage.append("deliveryTime", this.state.currentBSON)
            newMesssage.append("imageData", imageData)
            newMesssage.append("imageName", "image" + Date.now())

            API.newCrewPhoto(newMesssage);
            this.setState({
                crewsubject: "",
                crewmessageBody: "",
                crewuploadedImage: ""
            })
            this.getMessages();

        }
    }

    scrollBottom = () => {
        // Scroll to the bottom
        window.scrollTo(0, document.body.scrollHeight);
    }

    // Renderings
    renderMessagesMCC = () => {
        if (this.state.mccchat.length > 0) {
            return (
                <Box className="ChatBox chatMessDiv" item="true">
                    {this.state.mccchat.map((item, index) => {
                        if (item.attachment) {
                            // console.log(item.message.messageBody)
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
                                    userImageURL={this.getUserInfo(item.sender).imageURL}
                                    timeSent={this.getTime(item.timeSent)}
                                    timeDelivered={this.getTime(item.timeDelivered)}
                                    eta={item.timeDelivered}
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
                                    userId={item.sender}
                                    userImageURL={this.getUserInfo(item.sender).imageURL}
                                    timeSent={this.getTime(item.timeSent)}
                                    timeDelivered={this.getTime(item.timeDelivered)}
                                    eta={item.timeDelivered}
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

    renderMessagesCrew = () => {
        if (this.state.crewchat.length > 0) {
            return (
                <Box className="ChatBoxIV chatMessDiv" item="true">
                    {this.state.crewchat.map((item, index) => {
                        // console.log(item)
                        if (item.attachment) {
                            // console.log(`${hostname}/${item.attachment.imageData}`)
                            return (
                                <NewCrew
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
                                <NewCrew
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
                <Box className="ChatBoxIV chatMessDiv" item="true">
                    <Box className="noMessages">No Messages so far. Compose a message below.</Box>
                </Box>
            )
        }
    }

    // upload and preview images
    uploadImagemcc = (event) => {
        // stores a readable instance of 
        // the image being uploaded using multer
        this.setState({
            mccuploadedImage: URL.createObjectURL(event.target.files[0])
        });
        imageData = event.target.files[0]
    }

    uploadImagecrew = (event) => {
        // stores a readable instance of 
        // the image being uploaded using multer
        this.setState({
            crewuploadedImage: URL.createObjectURL(event.target.files[0])
        });
        imageData = event.target.files[0]
    }

    render = () => {
        let previewImageStylemcc;
        let previewImageStylecrew;
        if (this.state.mccuploadedImage === "") {
            previewImageStylemcc = { display: 'none' }
        } else {
            previewImageStylemcc = { display: 'block' }
        }

        if (this.state.crewuploadedImage === "") {
            previewImageStylecrew = { display: 'none' }
        } else {
            previewImageStylecrew = { display: 'block' }
        }


        return (
            <Grid
                container
                direction="column"
                justify="flex-start"
                alignItems="center"
            >
                <Grid item container direction="row" className="timeHeader" alignItems="center" justify="center">
                    <Box className="currentDT" p={2}>Date: {this.state.currentDate} <Box className="centerSpaceTime" component="span" mr={5}> </Box> Current Time: {this.state.currentTime}</Box>
                </Grid>
                <Grid
                    item container
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
                >

                    <Box
                        item="true"
                        className="crewChat splitScreen">
                        <Grid item container direction="row" alignItems="center" justify="center">
                            <Box className="chatTopLabel" >Crew Conversation</Box>
                        </Grid>

                        <Box>
                            {this.renderMessagesCrew()}

                            <Box className="ChatBoxIV chatBoxInput">
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
                                                onChange={this.uploadImagecrew}
                                            />
                                        </Box>

                                        <Box item="true" className="previewImage" style={previewImageStylecrew}>
                                            <img src={this.state.crewuploadedImage} alt="upload" className="previewImageAsset" />
                                        </Box>
                                        <Box item="true" className="form-control">

                                            {/* <input
                                                type="text"
                                                className="inputArea"
                                                name="crewsubject"
                                                value={this.state.crewsubject}
                                                onChange={this.handleInputChange}
                                                placeholder="Subject"

                                            /> */}
                                            <input
                                                type="text"
                                                className="inputArea"
                                                name="crewmessageBody"
                                                value={this.state.crewmessageBody}
                                                onChange={this.handleInputChange}
                                                placeholder="Text Message"
                                            />
                                        </Box>
                                        <SendRoundedIcon style={{ width: "20px", height: "20px", padding: "0px 5px", color: "grey" }} onClick={this.handleSubmitMessageCrew} />
                                    </Grid>
                                </form>
                            </Box>
                        </Box>
                    </Box>

                    <Box
                        item="true"
                        className="mccChat splitScreen">
                        <Grid item container direction="row" alignItems="center" justify="center">
                            <Box className="chatTopLabel" >MCC + Crew Conversation</Box>
                        </Grid>
                        <Box>
                            {this.renderMessagesMCC()}

                            <Box className="ChatBoxIV chatBoxInput">
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
                                                onChange={this.uploadImagemcc}
                                            />
                                        </Box>

                                        <Box item="true" className="previewImage" style={previewImageStylemcc}>
                                            <img src={this.state.mccuploadedImage} alt="upload" className="previewImageAsset" />
                                        </Box>
                                        <Box item="true" className="form-control">

                                            <input
                                                type="text"
                                                className="inputArea"
                                                name="mccsubject"
                                                value={this.state.mccsubject}
                                                onChange={this.handleInputChange}
                                                placeholder="Subject or Image URL"

                                            />
                                            <input
                                                type="text"
                                                className="inputArea"
                                                name="mccmessageBody"
                                                value={this.state.mccmessageBody}
                                                onChange={this.handleInputChange}
                                                placeholder={`Text Message: Estimated Time of Arrival - ${this.state.nextDeliveryTime}`}
                                            />
                                        </Box>
                                        <SendRoundedIcon style={{ width: "20px", height: "20px", padding: "0px 5px", color: "grey" }} onClick={this.handleSubmitMessageMCC} />
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