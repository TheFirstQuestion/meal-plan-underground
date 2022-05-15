import React, { useEffect } from 'react';
import { Typography, Button } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';

import './index.css';

const useStyles = makeStyles({
    avatar: {
        height: "8rem",
        width: "8rem",
        marginRight: "3%",
        display: 'inline-block',
    },
});

export default function ProfilePage({...props}) {
    const classes = useStyles();
    useEffect(() => {
        props.setContext("profile");
    }, []);

    return (
        <div id="profile-page-wrapper">
            <div className="row">
                <Avatar className={classes.avatar} alt={props.user.first_name + " " + props.user.last_name} src={"../../static/images/profile-photos/" + props.user.photo_path} />
                <div className="nameHeader">
                    <Typography variant="h1">{props.user.first_name}</Typography>
                    <br />
                    <Typography variant="h1">{props.user.last_name}</Typography>
                </div>
            </div>

            <div className="row">
                <Typography variant="subtitle2">I want to...</Typography>
                {
                    props.user.isDonor ? (
                        <>
                        <Button variant="outlined" id="button-inactive" disableElevation>receive</Button>
                        <Button variant="contained" id="button-active" disableElevation>donate</Button>
                        </>
                    ):
                        <>
                        <Button variant="contained" id="button-active" disableElevation>receive</Button>
                        <Button variant="outlined" id="button-inactive" disableElevation>donate</Button>
                        </>
                }
            </div>
            <div>
                <Typography variant="subtitle2">Major:</Typography>
                <Typography>{props.user.major}</Typography>
            </div>
            <div>
                <Typography variant="subtitle2">Bio:</Typography>
                <Typography>{props.user.biography}</Typography>
            </div>
            <div className="row">
                <div className="numberBlock">
                    <Typography variant="h2">{props.user.swipes_remaining}</Typography>
                    <Typography variant="subtitle1">Weekly Swipes Remaining</Typography>
                </div>
                <div className="numberBlock">
                    <Typography variant="h2">1</Typography>
                    <Typography variant="subtitle1">Guest Swipes Remaining</Typography>
                </div>
            </div>
            <div className="row">
                <div className="numberBlock">
                    <Typography variant="h2">2</Typography>
                    <Typography variant="subtitle1">Lifetime Swipes Donated</Typography>
                </div>
                <div className="numberBlock">
                    <Typography variant="h2">53</Typography>
                    <Typography variant="subtitle1">Lifetime Swipes Received</Typography>
                </div>
            </div>
        </div>
    );
}
