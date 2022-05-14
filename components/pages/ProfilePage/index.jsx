import React, { useEffect } from 'react';
import { Typography, Button } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import './index.css';

export default function ProfilePage({...props}) {
    useEffect(() => {
        props.setContext("profile");
    }, []);

    // props.user will be drop-in replacement
    // const user = {
    //     "_id": "627edc173b76e37fce019491",
    //     "first_name": "Alexis",
    //     "last_name": "Lowber",
    //     "photo_path": "alexis.png",
    //     "swipes_remaining": 10,
    //     "isDonor": false,
    //     "biography": "she's the best TA",
    //     "major": "CS probably",
    // };

    return (
        <div id="profile-page-wrapper">
            <div className="row">
                <Avatar alt={props.user.first_name + " " + props.user.last_name} src={"../../static/images/profile-photos/" + props.user.photo_path} />
                <Typography variant="h1">{props.user.first_name}{"\n"}{props.user.last_name}</Typography>
            </div>
            <div className="row">
                <Typography variant="subtitle2">I want to...</Typography>
                <Button variant="contained" id="button-receive" disableElevation>receive</Button>
                <Button variant="outlined" id="button-donate" disableElevation>donate</Button>
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
