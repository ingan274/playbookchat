import React, { Component } from "react";
import "./style.css";
import { Box } from '@material-ui/core';
import CheckRoundedIcon from '@material-ui/icons/CheckRounded';


class YouReply extends Component {

    render = () => {
        let colorSent = {
            position: "absolute",
            color: this.props.sent,
            width: "17px",
            height: "17px",
            left: "-5px"

        }

        let colorERT = {
            marginBottom: "-5px",
            color: this.props.ert,
            width: "17px",
            height: "17px",
        }

        return (
            <Box component="span" className="messageStatusDiv" style={{position: "relative"}}>
                <CheckRoundedIcon className="checkSent" style={colorSent} />
                <CheckRoundedIcon className="checkERT" style={colorERT} />
            </Box>

        )
    }
}

export default YouReply;