import React, { useEffect, useState, useCallback } from 'react';
import { Typography, Button, Link, Divider } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

import './index.css';

const useStyles = makeStyles({
    avatar: {
        height: "8rem",
        width: "8rem",
        marginRight: "3%",
        display: 'inline-block',
    },
});

function ListItemLink(props) {
    return <ListItem button component="a" {...props} />;
}

export default function ProfilePage({...props}) {
    const classes = useStyles();
    const photoPath = props.user.photo_path ? props.user.photo_path : "default.png";
    const [isDonor, setIsDonor] = useState(props.user.isDonor);

    const handleIsDonor = (willDonate) => {
        axios.post("/set/is_donor", {
            isDonor: willDonate
        })
        .then((response) => {
            setIsDonor(willDonate);
            props.setUser(response.data);
        })
        .catch((err) => {
            console.error(err);
        });
    };

    const handleReceiveClick = () => {
        handleIsDonor(false);
    }

    const handleDonateClick = () => {
        handleIsDonor(true);
    };

    useEffect(() => {
        props.setContext("Profile");
    }, []);

    return (
        <div id="profile-page-wrapper">
            <div className="row">
                <Avatar
                    className={classes.avatar}
                    alt={props.user.first_name + " " + props.user.last_name}
                    src={"../../static/images/profile-photos/" + photoPath}
                />
                <div className="nameHeader">
                    <Typography variant="h1">{props.user.first_name}</Typography>
                    <br />
                    <Typography variant="h1">{props.user.last_name}</Typography>
                </div>
            </div>

            <div className="row">
                <Typography variant="subtitle2">I want to...</Typography>
                {
                    isDonor ? (
                        <>
                        <Button variant="outlined" id="button-inactive" onClick={handleReceiveClick} disableElevation>receive</Button>
                        <Button variant="contained" id="button-active" onClick={handleDonateClick} disableElevation>donate</Button>
                        </>
                    ):
                        <>
                        <Button variant="contained" id="button-active" onClick={handleReceiveClick} disableElevation>receive</Button>
                        <Button variant="outlined" id="button-inactive" onClick={handleDonateClick} disableElevation>donate</Button>
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

            <Divider />
            <div>
                <Typography variant="subtitle2">Quick Links:</Typography>
                <List component="nav" aria-label="quick links">
                    <ListItem>
                        <Link
                            variant="body1"
                            href="https://rde.stanford.edu/dining/dining-locations-hours"
                            target="_blank"
                            rel="noopener noreferrer"
                        >Dining Hall Locations and Hours</Link>
                    </ListItem>
                    <ListItem>
                        <Link
                            variant="body1"
                            href="https://rdeapp.stanford.edu/MyMealPlan/Account"
                            target="_blank"
                            rel="noopener noreferrer"
                        >Your Meal Plan Balance</Link>
                    </ListItem>
                    <ListItem>
                        <Link
                            variant="body1"
                            href="https://rdeapps.stanford.edu/DiningHallMenu/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >Dining Hall Menus</Link>
                    </ListItem>
                </List>
            </div>
            {/*<div className="row">
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
            </div>*/}
        </div>
    );
}
