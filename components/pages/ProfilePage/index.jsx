import React, { useEffect } from 'react';
import { Typography } from '@material-ui/core';
import './index.css';

export default function ProfilePage({...props}) {
    useEffect(() => {
        props.setContext("profile");
    }, []);

    console.log(props);

    return (
        <div>
            <Typography>{props.user.first_name}</Typography>
        </div>
    );
}
