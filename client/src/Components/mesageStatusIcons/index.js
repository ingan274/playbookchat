import React, { Component } from "react";
import "./style.css";
import { Box } from '@material-ui/core';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';


class YouReply extends Component {

    renderERT = () => {
        let colorERT = {
            position: "absolute",
            color: this.props.ert,
            width: "17px",
            height: "17px",
            top: "5px",
            right: "1px"
        }

        if (this.props.expresp) {
            return (<ArrowRightAltIcon className="checkERT" style={colorERT} />)
        }
    }

    render = () => {
        let colorSent = {
            color: this.props.sent,
            width: "17px",
            height: "17px",
            transform: "rotate(180deg)",
            margin: "3px 2px -3px 0px"

        }


        return (
            <Box component="span" className="messageStatusDiv" style={{ position: "relative" }}>
                <ArrowRightAltIcon className="checkSent" style={colorSent} />
                {this.renderERT()}
            </Box>

        )
    }
}

export default YouReply;