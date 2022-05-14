import React from 'react';
import { Typography, Button } from '@material-ui/core';

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


    return (
    <>
        <Typography variant="h1">Pick demo user</Typography>
        <br />
        <Button
            variant="outlined"
            disableElevation
            onClick={pickRecipient}
        >
            recipient
        </Button>
        <br />
        <Button
            variant="outlined"
            disableElevation
            onClick={pickDonor}
        >
            donor
        </Button>
    </>
    );
}
