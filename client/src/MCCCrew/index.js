import "./style.css";
import React, { Component } from "react";
import { Grid, Box, Button, IconButton, TextField, InputAdornment, FormControlLabel, Switch } from '@material-ui/core';
import { PhotoCamera, SendRounded, TextFields } from '@material-ui/icons';
import LinkIcon from '@material-ui/icons/Link';
import dateTime from "../API-Calls/chatDelay"
import API from "../API-Calls";
import New from "../Components/New";
import moment from "moment";
import {
    Link
} from "react-router-dom";

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
            chat: [],
            subject: "",
            messageBody: "",
            priority: false,
            nextDeliveryTime: "",
            currentTime: "",
            currentDate: "",
            deliveryBSON: "",
            currentBSON: "",

            uploadedImage: "",
            subjectLine: true,
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

    showCrewChat = () => {
        if (this.state.userId !== "mcc") {
            return (
                <Link to="/playbookcrew">
                    <Box className="buttons">Crew</Box>
                </Link>
            )
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
            let locationBool;
            if (this.state.userLocation === "mars") {
                locationBool = true;
            } else {
                locationBool = false;
            }
            newMesssage = {
                groupChat: "mcc-crew-chat",
                message: {
                    subject: this.state.subject,
                    messageBody: this.state.messageBody
                },
                urgent: false,
                priority: this.state.priority,
                priorityPressed: this.state.priority,
                sender: this.state.userId,
                location: locationBool,
                sentTime: this.state.currentBSON,
                deliveryTime: this.state.deliveryBSON,
            }

            API.newMCCCrew(newMesssage);

            this.setState({
                subject: "",
                messageBody: ""
            })
            this.getMessages();
        } else if (this.state.uploadedImage !== "") {
            let locationBool;
            if (this.state.userLocation === "mars") {
                locationBool = true;
            } else {
                locationBool = false;
            }

            newMesssage = new FormData();

            // This turns all booleans into strings!!
            newMesssage.append("groupChat", "mcc-crew-chat")
            newMesssage.append("messageBody", this.state.messageBody)
            newMesssage.append("messageSubject", this.state.subject,)
            newMesssage.append("urgent", false)
            newMesssage.append("priority", this.state.priority)
            newMesssage.append("priorityPressed", this.state.priority)
            newMesssage.append("sender", this.state.userId)
            newMesssage.append("location", locationBool)
            newMesssage.append("sentTime", this.state.currentBSON)
            newMesssage.append("deliveryTime", this.state.deliveryBSON)
            newMesssage.append("imageData", imageData)
            newMesssage.append("imageName", "image" + Date.now())

            API.newMCCCrewPhoto(newMesssage);
            this.setState({
                subject: "",
                messageBody: "",
                uploadedImage: ""
            })
            this.getMessages();

        } else if (this.state.subjectLine === false) {

            let locationBool;
            if (this.state.userLocation === "mars") {
                locationBool = true;
            } else {
                locationBool = false;
            }

            newMesssage = new FormData();
            // console.log(this.state.subject)
            let path = new URL(this.state.subject).pathname
            path = path.substring(1)
            // console.log(path)
            if (this.state.messageBody.length > 0) {
                newMesssage.append("messageBody", this.state.mccmessageBody)
            } else {
                newMesssage.append("messageBody", "")
            }


            // This turns all booleans into strings!!
            newMesssage.append("groupChat", "mcc-crew-chat")
            newMesssage.append("messageSubject", "")
            newMesssage.append("subjectLine", this.state.subjectLine)
            newMesssage.append("imagePath", path)
            newMesssage.append("urgent", false)
            newMesssage.append("priority", false)
            newMesssage.append("sender", this.state.userId)
            newMesssage.append("location", locationBool)
            newMesssage.append("sentTime", this.state.currentBSON)
            newMesssage.append("deliveryTime", this.state.deliveryBSON)


            console.log(path)
            API.newMCCCrewPhoto(newMesssage);
            this.setState({
                mccsubject: "",
                mccmessageBody: "",
            })
            this.getMessages();
        }


    }

    subjectImageStateChange = (button) => {
        if (button === "subject") {
            this.setState({
                subjectLine: true,
            })
        } else {
            this.setState({
                subjectLine: false
            })
        }
    }

    subjectTypeRendering = () => {
        if (this.state.subjectLine) {
            return (
                <TextField className="inputArea subjectURLInput"
                    autoFocus
                    variant="filled"
                    name="subject"
                    value={this.state.subject}
                    id="filled-basic"
                    onChange={this.handleInputChange}
                    onKeyDown={this.keyPress}
                    onKeyPress={(ev) => {
                        // console.log(`Pressed keyCode ${ev.key}`);
                        if (ev.key === 'Enter') {
                            ev.preventDefault();
                            this.handleSubmitMessage()
                        }
                    }}

                    InputProps={{
                        startAdornment: (
                            <InputAdornment className="inputIcon" position="start">
                                <TextFields />
                            </InputAdornment>
                        ),
                    }}

                />
            )
        } else {
            return (

                <TextField className="inputArea subjectURLInput"
                    autoFocus
                    variant="filled"
                    size="small"
                    name="subject"
                    value={this.state.subject}
                    id="filled-basic"
                    onChange={this.handleInputChange}
                    onKeyDown={this.keyPress}
                    onKeyPress={(ev) => {
                        // console.log(`Pressed keyCode ${ev.key}`);
                        if (ev.key === 'Enter') {
                            ev.preventDefault();
                            this.handleSubmitMessage()
                        }
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment className="inputIcon" position="start">
                                <LinkIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            )
        }
    }

    scrollBottom = () => {
        // Scroll to the bottom
        window.scrollTo(0, document.body.scrollHeight);
    }

    keyPress = (ev) => {
        if (ev.keyCode == 13) {
            ev.preventDefault();
            this.handleSubmitMessage()
        }
    }

    markObsolete = (messageid, event) => {
        let messageID = messageid
        // console.log(messageID)
        const userUpdated = this.state.userName;
        const timeUpdated = this.state.currentTime;

        let udpateObject = {
            messageID: messageID,
            userUpdated: userUpdated,
            timeUpdated: timeUpdated
        }

        API.markObsolete(udpateObject)
    }

    handlePriorityUpdateAdd = (messageid, event) => {
        API.handlePriority("add", {messageID: messageid})
    }


    handlePriorityUpdateRemove = (messageid, event) => {
        API.handlePriority("remove", {messageID: messageid})
    }


    handlePriority = (event) => {
        const { name, checked } = event.target;
        this.setState({
            [name]: checked
        })
    };

    // Renderings
    renderMessages = () => {

        if (this.state.chat.length > 0) {
            return (
                <Box className="ChatBox chatMessDiv" item="true">
                    {this.state.chat.map((item, index) => {
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
                                    markObsolete={(ev) => this.markObsolete(item._id, ev)}
                                    obsoletePress={item.obsoletePressed}
                                    obsolete={item.obsolete.isObsolete}
                                    obsoleteUser={item.obsolete.userChange}
                                    obsoleteTime={item.obsolete.timeChange}
                                    priority={item.priority}
                                    priorityPress={item.priorityPressed}
                                    priorityAdd={(ev) => this.handlePriorityUpdateAdd(item._id, ev)}
                                    priorityRemove={(ev) => this.handlePriorityUpdateRemove(item._id, ev)}
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
                                    markObsolete={(ev) => this.markObsolete(item._id, ev)}
                                    obsolete={item.obsolete.isObsolete}
                                    obsoletePress={item.obsoletePressed}
                                    obsoleteUser={item.obsolete.userChange}
                                    obsoleteTime={item.obsolete.timeChange}
                                    priority={item.priority}
                                    priorityPress={item.priorityPressed}
                                    priorityAdd={(ev) => this.handlePriorityUpdateAdd(item._id, ev)}
                                    priorityRemove={(ev) => this.handlePriorityUpdateRemove(item._id, ev)}
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

    // upload and preview images
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

        let subjectBtnColor;
        let imageBtnColor;

        if (this.state.subjectLine) {
            imageBtnColor = ""
            subjectBtnColor = "primary"
        } else {
            imageBtnColor = "primary"
            subjectBtnColor = ""
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
                        className="timeline splitScreen">
                        Timeline Here
                    </Box>
                    <Box
                        item="true"
                        className="clDiv splitScreen">
                        <Box className="chatPanelL">
                            <Box className="buttons">ML</Box>
                            <Link to="/playbookmcccrew">
                                <Box className="buttons current">MCC & Crew</Box>
                            </Link>
                            {this.showCrewChat()}
                        </Box>
                        <Box>
                            {this.renderMessages()}

                            <Box className="ChatBox chatBoxInput mccinputarea">

                                <form encType="multipart/form-data">
                                    <Grid
                                        container item
                                        direction="row"
                                        justify="space-around"
                                        alignItems="center">
                                        <Box item="true">
                                            <input accept="image/*" className="attachment" id="imageUploadMCC" type="file" onChange={this.uploadImage} />
                                            <label htmlFor="imageUploadMCC">
                                                <IconButton aria-label="upload picture" component="span">
                                                    <PhotoCamera />
                                                </IconButton>
                                            </label>

                                            <Box item="true" className="previewImage" style={previewImageStyle}>
                                                <img src={this.state.uploadedImage} alt="upload" className="previewImageAsset" />
                                            </Box>
                                        </Box>
                                        <Box item="true" className="form-control">
                                            <Grid container direction="row" alignItems="center" justify="space-between" className="radiobuttonSubmission">
                                                <Box>
                                                    <Button m={1} size="small" onClick={() => this.setState({ subjectLine: true })} color={subjectBtnColor}>Subject Line</Button>
                                                    <Button m={1} size="small" onClick={() => this.setState({ subjectLine: false })} color={imageBtnColor}>Image Link</Button>
                                                </Box>
                                                <Box mb={1} item="true">
                                                    <FormControlLabel
                                                        control={
                                                            <Switch
                                                                size="small"
                                                                checked={this.state.priority}
                                                                onChange={this.handlePriority}
                                                                name="priority"
                                                                color="primary"
                                                            />
                                                        }
                                                        label="Priority Message"

                                                    />
                                                </Box>
                                            </Grid>
                                            {this.subjectTypeRendering()}
                                            <TextField className="inputArea"
                                                variant="filled"
                                                size="small"
                                                name="messageBody"
                                                value={this.state.messageBody}
                                                label={`Message (ETA - ${this.state.nextDeliveryTime})`}
                                                onChange={this.handleInputChange}
                                                onKeyPress={(ev) => {
                                                    if (ev.key === 'Enter') {
                                                        ev.preventDefault();
                                                        this.handleSubmitMessage()
                                                    }
                                                }}
                                                multiline
                                                inputProps={{
                                                    style: {
                                                        fontSize: '12px',
                                                    },
                                                }}
                                                inputLabelProps={{
                                                    style: {
                                                        fontSize: '12px',
                                                    },
                                                }}
                                                onKeyDown={this.keyPress}
                                            />

                                        </Box>

                                        <IconButton type="submit" aria-label="Send" component="span" onClick={this.handleSubmitMessage} >
                                            <SendRounded />
                                        </IconButton>
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