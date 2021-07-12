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
            name: "MCC",
            role: "Ground",
            imageURL: "https://www.gazettenet.com/getattachment/c2db69d5-0338-444c-a4a7-2b58027e66cd/b6-nasa-logo-biz-072219-ph1",
            location: "earth"
        }

        const crew1 = {
            id: "crew1",
            name: "Kell",
            role: "Astro 1",
            imageURL: "https://scitechdaily.com/images/NASA-Astronaut-Kjell-Lindgren.jpg",
            location: "mars"
        }

        const crew2 = {
            id: "crew2",
            name: "Jessica",
            role: "Astro 2",
            imageURL: "https://www.browndailyherald.com/wp-content/uploads/2019/04/Ryan_Jessica-Meir_CO_NASA.jpg",
            location: "mars"
        }

        const crew3 = {
            id: "crew3",
            name: "Chris",
            role: "Astro 3",
            imageURL: "https://www.nasa.gov/sites/default/files/thumbnails/image/1alt_jsc2018e095073_alt.png",
            location: "mars"
        }

        const crew4 = {
            id: "crew4",
            name: "Alvin",
            role: "Astro 4",
            imageURL: "https://www.space-boosters.co.uk/ekmps/shops/spaceboosters/images/nasa-astronaut-alvin-drew-8-x10-full-colour-portrait-1727-p.jpg",
            location: "mars"
        }

        const crew5 = {
            id: "crew5",
            name: "Kate",
            role: "Astronaut 5",
            imageURL: "https://scitechdaily.com/images/NASA-Astronaut-Kate-Rubins.jpg",
            location: "mars"
        }

        this.state = {
            profiles: [mcc, crew1, crew2, crew3, crew4, crew5],
        };

        localStorage.setItem("Profiles", JSON.stringify(this.state.profiles));

    }

    // Creating Profile Buttons
    profileButtons = () => {
        return (
            <Grid item container direction="row" spacing={2} justify="center" alignItems="center">
                {this.state.profiles.map((item, index) => {

                    return (
                        <Link to="/playbookmcccrew" className="userLink" key={index.toString()} >
                            <Grid
                                className="userSelectDiv"
                                container item
                                direction="column"
                                justify="center"
                                alignItems="center">
                                <Box item="true" className="userContainer" id={index.toString()} m={3} p={3} onClick={this.setUserSelected} style={{ background: `url(${item.imageURL})`, backgroundSize: "cover" }}></Box>
                                <Box item="true" className="nameText">{item.name}</Box>
                                <Box item="true" className="roleText">{item.role}</Box>
                            </Grid>
                        </Link>
                    )

                })}
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