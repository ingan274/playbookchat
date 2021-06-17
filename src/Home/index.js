import "./style.css";
import React, { Component } from "react";
import { Grid, Box } from '@material-ui/core';

import YouNew from "../Components/You-New";
import YouReplyThread from "../Components/You-Reply-Thread";
import YouReply from "../Components/You-Reply-1";
import OtherNew from "../Components/MCC-Other-New";
import OtherReply from "../Components/MCC-Other-Reply-1";
import OtherReplyThread from "../Components/MCC-Other-Reply-Thread";

// Accessting Firebase
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// Firebase hooks
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from 'react-firebase-hooks/firestore';

// Initializing Firebase
firebase.initializeApp({
    apiKey: "AIzaSyCFswMrV1CrOaxRLlZsaYPms2_A20Gsg10",
    authDomain: "mhci-2021.firebaseapp.com",
    projectId: "mhci-2021",
    storageBucket: "mhci-2021.appspot.com",
    messagingSenderId: "547847547076",
    appId: "1:547847547076:web:f1cd660e38c7ac23a58191",
    measurementId: "G-XSLPZ6GJTE"
});

const firestore = firebase.firestore();

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

    chatRoom = () => {
        const messagesRef = firestore.collection("Messages");
        // listening to updates
        const query = messagesRef.orderBy('createdAt')

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