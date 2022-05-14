import React from 'react';
import axios from 'axios';

export default function AuthRedirect({...props}) {
    // Log in as the default donor
    axios.get("/login/donor").then((response) => {
        props.setUser(response.data);
    }).catch((err) => {
        console.log(err);
    });

    return <div>TODO: Stanford auth redirect logic goes here</div>;
}
