import "./style.css";
import React, { Component } from "react";
import { Grid, Box } from '@material-ui/core';

import YouNew from "../Components/You-New";
import YouReplyThread from "../Components/You-Reply-Thread";
import YouReply from "../Components/You-Reply-1";
import OtherNew from "../Components/MCC-Other-New";
import OtherReply from "../Components/MCC-Other-Reply-1";
import OtherReplyThread from "../Components/MCC-Other-Reply-Thread";

class Playbook extends Component {
    constructor(props) {
        super(props);
        let userObj = localStorage.getItem("User");

        this.state = {
            name: userObj.name,
            role: userObj.role,
            location: userObj.location,
            id: userObj.id
        }
    }

    render = () => {
        return (
            <Box>
                <YouNew />
                <YouReplyThread />
                <YouReply />
                <OtherNew />
                <OtherReply />
                <OtherReplyThread />
            </Box>
        )
    }
}

export default Playbook;