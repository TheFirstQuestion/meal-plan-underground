import React, { useEffect } from 'react';
import './index.css';

export default function PairingsPage({...props}) {
    useEffect(() => {
        props.setContext("pairings");
    }, []);

    return (
        <div>TODO: Pairings view goes here</div>
    );
}
