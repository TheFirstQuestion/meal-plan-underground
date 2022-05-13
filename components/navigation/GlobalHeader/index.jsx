import React from 'react';
import { Typography } from '@material-ui/core';
import './index.css';

export default function GlobalHeader(props) {
    return (
        <div id="GlobalHeader">
            <Typography>{props.context}</Typography>
        </div>
    );
}
