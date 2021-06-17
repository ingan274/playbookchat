import "./style.css";
import React, { Component } from "react";
import { Grid, Box } from '@material-ui/core';
import {
    Link,
} from "react-router-dom";

class Playbook extends Component {
    constructor(props) {
        super(props);

        const mcc = {
            id: "mcc",
            name: "Capcom",
            role: "Mission Control Center",
            imageURL: "",
            location: "earth"
        }

        const crew1 = {
            id: "crew1",
            name: "Rick",
            role: "Astronaut 1",
            imageURL: "",
            location: "mars"
        }

        const crew2 = {
            id: "crew2",
            name: "Jenna",
            role: "Astronaut 2",
            imageURL: "",
            location: "mars"
        }

        const crew3 = {
            id: "crew3",
            name: "Sam",
            role: "Astronaut 3",
            imageURL: "",
            location: "mars"
        }

        const crew4 = {
            id: "crew4",
            name: "Louis",
            role: "Astronaut 4",
            imageURL: "",
            location: "mars"
        }

        const crew5 = {
            id: "crew5",
            name: "Louis",
            role: "Astronaut 5",
            imageURL: "",
            location: "mars"
        }

        this.state = {
            profiles: [mcc, crew1, crew2, crew3, crew4, crew5],
        };

    }

    // Creating Profile Buttons
    profileButtons = () => {
        return (
            <Grid item container direction="row" spacing={2} justify="center" alignItems="center">
                {this.state.profiles.map((item, index) => (
                    <Link to="/playbook" className="userLink" key={index.toString()} >
                        <Grid
                            className="userSelectDiv"
                            container item
                            direction="column"
                            justify="center"
                            alignItems="center">
                            <Box item="true" className="userContainer" id={index.toString()} m={3} p={3} onClick={this.setUserSelected}></Box>
                            <Box item="true" className="nameText">{item.name}</Box>
                            <Box item="true" className="roleText">{item.role}</Box>
                        </Grid>
                    </Link>
                ))}
            </Grid>
        )
    }

    // Adding favorited items and cart items to Local Storage
    setUserSelected = (event) => {
        let id = event.target.attributes.id.value;
        let localStorageUser = JSON.stringify(this.state.profiles[id]);
        // console.log("id", id)
        // console.log(localStorageUser);

        // Saving Local Storage: Only Role (NO NAME)
        localStorage.setItem("User", localStorageUser);

    };



    render = () => {
        return (
            this.profileButtons()
        )
    }
}

export default Playbook;