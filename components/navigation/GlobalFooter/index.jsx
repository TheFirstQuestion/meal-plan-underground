import React from 'react';
import { Link } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { Link as RouterLink } from 'react-router-dom';
import RoomRoundedIcon from '@material-ui/icons/RoomRounded';
import ChatRoundedIcon from '@material-ui/icons/ChatRounded';
import PersonRoundedIcon from '@material-ui/icons/PersonRounded';
import './index.css';


// via https://v4.mui.com/guides/composition/#LinkRouter.js
export default function GlobalFooter(props) {
        
    return (
        <div id="GlobalFooter">
            <IconButton
                aria-label="to map"
                component={RouterLink}
                to="/map"
                className="footerButton"
            >
                <RoomRoundedIcon
                    className="footerIcon"
                    fontSize="large"
                />
            </IconButton>
            <IconButton
                aria-label="to pairings list"
                component={RouterLink}
                to="/pairings"
                className="footerButton"
            >
                <ChatRoundedIcon
                    className="footerIcon"
                    fontSize="large"
                />
            </IconButton>
            <IconButton
                aria-label="to profile page"
                component={RouterLink}
                to="/profile"
                className="footerButton"
            >
                <PersonRoundedIcon
                    className="footerIcon"
                    fontSize="large"
                />
            </IconButton>
        </div>
    );
}
