import React, { useEffect } from 'react';
import CheckInPopup from '../../popups/CheckInPopup';
import MatchListPopup from '../../popups/MatchListPopup';
import './index.css';

export default function MapPage({...props}) {
    useEffect(() => {
        props.setContext("map");
    }, []);

    return (
        <div>
            <div>TODO: Map view goes here</div>
            <div>NOTE: Check-in popup and match list popup are accessed through this page</div>
        </div>
    );
};
