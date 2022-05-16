import React, { useEffect } from 'react';
import { Button } from '@material-ui/core';
import './index.css';

import axios from 'axios';

export default function AuthRedirect({...props}) {

    function pickDonor() {
        getDiningHalls();
        axios.get("/login/donor").then((response) => {
            props.setUser(response.data);
        }).catch((err) => {
            console.log(err);
        });
    }

    function pickRecipient() {
        getDiningHalls();
        axios.get("/login/recipient").then((response) => {
            props.setUser(response.data);
        }).catch((err) => {
            console.log(err);
        });
    }

    function getDiningHalls() {
        axios.get("/list/dining_halls").then((response) => {
            props.setDiningHalls(response.data);
        }).catch((err) => {
            console.log(err);
        });
    }

    useEffect(() => {
        props.setContext("Meal Plan Underground");
    }, []);

    return (
        <div className="demo-container">
            <div className='logo-container'>
                <img src="../../../static/images/logo.png" />
            </div>
            <Button
                variant="outlined"
                disableElevation
                onClick={pickRecipient}
                style={{margin: '6%'}}
            >
                recipient demo
            </Button>
            <Button
                variant="outlined"
                disableElevation
                onClick={pickDonor}
                style={{margin: '6%'}}
            >
                donor demo
            </Button>
        </div>
    );
}
