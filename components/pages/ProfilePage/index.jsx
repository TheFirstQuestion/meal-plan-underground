import React, { useEffect } from 'react';
import './index.css';

export default function ProfilePage({...props}) {
    useEffect(() => {
        props.setContext("profile");
    }, []);

    return (
        <div>
            <div>TODO: Profile view goes here</div>
            <div>NOTE: there is a separate page for editing a profile</div>
        </div>
    );
}
