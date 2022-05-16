import React, { useEffect, useState, useCallback } from 'react';
import CheckInPopup from '../../popups/CheckInPopup';
import MatchListPopup from '../../popups/MatchListPopup';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';

import './index.css';

// TODO: remove this helper when demo phase is over
const getRandomNum = (min = 1, max = 4) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

function NumberCircles({num, small, isDonor}) {
    const color = isDonor ? 'green' : 'blue';
    let circle;
    if (small) {
        circle = (
            <div className={`cs278-map-reCircles ${color}`}>
                <Typography variant="h6">{num}</Typography>
            </div>
        );
    } else {
        circle = (
            <div className={`cs278-map-otherCircles ${color}`}>
                <Typography variant="h6">{num}</Typography>
            </div>
        );
    }
    return (circle);
}

export default function MapPage({...props}) {
    const [hall, setHall] = useState(null);
    // TODO: get number of people from the db
    const [numPeople, setNumPeople] = useState(0);

    // TODO: remove this when the demo phase is over
    const [randNumPeople, setRandNumPeople] = useState({});

    const [matchOpen, setMatchOpen] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [hallOpen, setHallOpen] = useState(true);
    const [selectedHall, setSelectedHall] = useState(null);
    const isDonor = props.user.isDonor;

    // get the people at eat dining hall and store
    props.DINING_HALLS.forEach((item, i) => {
        axios.get("/list/users/" + item._id).then((response) => {
            item.people = response.data;
            item.numPeople = response.data.length;
        }).catch((err) => {
            console.log(err);
        });
    });

    const handleMatchOpen = (newHall, newPeople) => {
        const dh = props.DINING_HALLS.filter(h => h.name === newHall)[0];
        const dhName = dh.name;

        // TODO: remove when demo phase is over
        switch (dhName) {
            case "EVGR":
                setNumPeople(randNumPeople.evgr);
                break;
            case  "Ricker":
                setNumPeople(randNumPeople.ricker);
                break;
            case "Lakeside":
                setNumPeople(randNumPeople.lakeside);
                break;
            case "FloMo":
                setNumPeople(randNumPeople.flomo);
                break;
            case "Branner":
                setNumPeople(randNumPeople.branner);
                break;
            case "Casper":
                setNumPeople(randNumPeople.casper);
                break;
            case "Arrillaga":
                setNumPeople(randNumPeople.arrillaga);
                break;
            case "Stern":
                setNumPeople(randNumPeople.stern);
                break;
            case "Wilbur":
                setNumPeople(randNumPeople.wilbur);
                break;
        }
        setHall(dh);
        setMatchOpen(true);
    }

    const handleMatchClose = (value) => {
        setMatchOpen(false);
        if (value === "") {
            return;
        }
        // TODO: create pairing (set both users to be not at a dining hall)
        setSelectedMatch(value);
    };

    const handleHallOpen = () => {
        setHallOpen(true);
    }

    const handleHallClose = (hall) => {
        if (hall) {
            // Save this info in the db
            axios.post("/set/dining_hall", {name: hall.name}).then((response) => {
                // console.log(response.data);
            }).catch((err) => {
                console.log(err);
            });
            setMatchOpen(true);
            handleMatchOpen(hall.name);
        }
        setSelectedHall(hall);
        setHall(hall);
        setHallOpen(false);
    };

    useEffect(() => {
        props.setContext("Dining Hall Map");
    }, []);

    // TODO: remove random numbering when demo phase is over
    useEffect(() => {
        setRandNumPeople({
            ricker: getRandomNum(),
            lakeside: getRandomNum(),
            flomo: getRandomNum(),
            evgr: getRandomNum(),
            branner: getRandomNum(),
            casper: getRandomNum(),
            arrillaga: getRandomNum(),
            stern: getRandomNum(),
            wilbur: getRandomNum(),
        });
    }, []);


    return (
        <div className='cs278-map-container'>
            <Button className='cs278-map-button' variant="outlined" onClick={handleHallOpen}>Check-In</Button>
            <CheckInPopup
                selectedValue={selectedHall}
                open={hallOpen}
                onClose={handleHallClose}
                DINING_HALLS={props.DINING_HALLS}
            />
            <div className='cs278-map-halls'>
                <div className='cs278-map-leftDiv'>
                    <div className='cs278-map-ricker' onClick={() => handleMatchOpen('Ricker')}>
                        <Typography variant="h6">Ricker</Typography>
                        {/* TODO: Remove random numbering when we have real data */}
                        <NumberCircles num={randNumPeople.ricker} small={true} isDonor={isDonor}/>
                        {/* <NumberCircles num={props.DINING_HALLS.filter(h => h.name === "Ricker")[0].numPeople} small={true}/> */}
                    </div>
                    <div className='cs278-map-lakeside' onClick={() => handleMatchOpen('Lakeside')}>
                        <Typography variant="h6">Lakeside</Typography>
                        {/* TODO: Remove random numbering when we have real data */}
                        <NumberCircles num={randNumPeople.lakeside} small={false} isDonor={isDonor}/>
                        {/* <NumberCircles num={props.DINING_HALLS.filter(h => h.name === "Lakeside")[0].numPeople} small={false}/> */}
                    </div>
                    <div className='cs278-map-flomo' onClick={() => handleMatchOpen('FloMo')}>
                        <Typography variant="h6">FloMo</Typography>
                        {/* TODO: Remove random numbering when we have real data */}
                        <NumberCircles num={randNumPeople.flomo} small={false} isDonor={isDonor}/>
                        {/* <NumberCircles num={props.DINING_HALLS.filter(h => h.name === "FloMo")[0].numPeople} small={false}/> */}
                    </div>
                </div>
                <div className='cs278-map-rightDiv'>
                    <div className='cs278-map-evgr' onClick={() => handleMatchOpen('EVGR')}>
                        <Typography variant="h6">EVGR</Typography>
                        {/* TODO: Remove random numbering when we have real data */}
                        <NumberCircles num={randNumPeople.evgr} small={true} isDonor={isDonor}/>
                        {/* <NumberCircles num={props.DINING_HALLS.filter(h => h.name === "EVGR")[0].numPeople} small={true}/> */}
                    </div>
                    <div className='cs278-map-brannerCasper'>
                        <div className='cs278-map-brannerStern' onClick={() => handleMatchOpen('Branner')}>
                            <Typography variant="h6">Branner</Typography>
                            {/* TODO: Remove random numbering when we have real data */}
                            <NumberCircles num={randNumPeople.branner} small={false} isDonor={isDonor}/>
                            {/* <NumberCircles num={props.DINING_HALLS.filter(h => h.name === "Branner")[0].numPeople} small={false}/> */}
                        </div>
                        <div className='cs278-map-casperWilbur' onClick={() => handleMatchOpen('Casper')}>
                            <Typography variant="h6">Casper</Typography>
                            {/* TODO: Remove random numbering when we have real data */}
                            <NumberCircles num={randNumPeople.casper} small={false} isDonor={isDonor}/>
                            {/* <NumberCircles num={props.DINING_HALLS.filter(h => h.name === "Casper")[0].numPeople} small={false}/> */}
                        </div>
                    </div>
                    <div className='cs278-map-arrillaga' onClick={() => handleMatchOpen('Arrillaga')}>
                        <Typography variant="h6">Arrillaga</Typography>
                        {/* TODO: Remove random numbering when we have real data */}
                        <NumberCircles num={randNumPeople.arrillaga} small={false} isDonor={isDonor}/>
                        {/* <NumberCircles num={props.DINING_HALLS.filter(h => h.name === "Arrillaga")[0].numPeople} small={false}/> */}
                    </div>
                    <div className='cs278-map-sternWilbur'>
                        <div className='cs278-map-brannerStern' onClick={() => handleMatchOpen('Stern')}>
                            <Typography variant="h6">Stern</Typography>
                            {/* TODO: Remove random numbering when we have real data */}
                            <NumberCircles num={randNumPeople.stern} small={false} isDonor={isDonor}/>
                            {/* <NumberCircles num={props.DINING_HALLS.filter(h => h.name === "Stern")[0].numPeople} small={false}/> */}
                        </div>
                        <div className='cs278-map-casperWilbur' onClick={() => handleMatchOpen('Wilbur')}>
                            <Typography variant="h6">Wilbur</Typography>
                            {/* TODO: Remove random numbering when we have real data */}
                            <NumberCircles num={randNumPeople.wilbur} small={false} isDonor={isDonor}/>
                            {/* <NumberCircles num={props.DINING_HALLS.filter(h => h.name === "Wilbur")[0].numPeople} small={false}/> */}
                        </div>
                    </div>
                    {
                        hall ? (
                            <MatchListPopup {...props} selectedValue={selectedMatch} open={matchOpen} onClose={handleMatchClose} hall={hall} num={numPeople} user={props.user}/>
                        ):
                            <></>
                    }
                </div>
            </div>
        </div>
    );
};
