import React, { useEffect, useState, useCallback } from 'react';
import CheckInPopup from '../../popups/CheckInPopup';
import MatchListPopup from '../../popups/MatchListPopup';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import './index.css';

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
    const [matchOpen, setMatchOpen] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [hallOpen, setHallOpen] = useState(true);
    const [selectedHall, setSelectedHall] = useState(null);
    const isDonor = props.user.isDonor;

    useEffect(() => {
        // get the people at eat dining hall and store
        props.DINING_HALLS.forEach((item, i) => {
            // condition on it having loaded with values (TODO: fix this)
            // via https://stackoverflow.com/a/32108184
            if (!(item && Object.keys(item).length === 0 && Object.getPrototypeOf(item) === Object.prototype)) {
                axios.get("/list/users/" + item._id + `/${isDonor}`).then((response) => {
                    item.people = response.data;
                    item.numPeople = response.data.length;
                }).catch((err) => {
                    item.people = [];
                    item.numPeople = null;
                    console.log(err);
                });
            }
        });
    }, [props.DINING_HALLS, isDonor])

    const handleMatchOpen = (newHall, newPeople) => {
        const dh = props.DINING_HALLS.filter(h => h.name === newHall)[0];
        setHall(dh);
        setNumPeople(dh?.numPeople);
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
                        <NumberCircles num={props.DINING_HALLS.filter(h => h.name === "Ricker")[0]?.numPeople} small={true} isDonor={isDonor}/>
                    </div>
                    <div className='cs278-map-lakeside' onClick={() => handleMatchOpen('Lakeside')}>
                        <Typography variant="h6">Lakeside</Typography>
                        <NumberCircles num={props.DINING_HALLS.filter(h => h.name === "Lakeside")[0]?.numPeople} small={false} isDonor={isDonor}/>
                    </div>
                    <div className='cs278-map-flomo' onClick={() => handleMatchOpen('FloMo')}>
                        <Typography variant="h6">FloMo</Typography>
                        <NumberCircles num={props.DINING_HALLS.filter(h => h.name === "FloMo")[0]?.numPeople} small={false} isDonor={isDonor}/>
                    </div>
                </div>
                <div className='cs278-map-rightDiv'>
                    <div className='cs278-map-evgr' onClick={() => handleMatchOpen('EVGR')}>
                        <Typography variant="h6">EVGR</Typography>
                        <NumberCircles num={props.DINING_HALLS.filter(h => h.name === "EVGR")[0]?.numPeople} small={true} isDonor={isDonor}/>
                    </div>
                    <div className='cs278-map-brannerCasper'>
                        <div className='cs278-map-brannerStern' onClick={() => handleMatchOpen('Branner')}>
                            <Typography variant="h6">Branner</Typography>
                            <NumberCircles num={props.DINING_HALLS.filter(h => h.name === "Branner")[0]?.numPeople} small={false} isDonor={isDonor}/>
                        </div>
                        <div className='cs278-map-casperWilbur' onClick={() => handleMatchOpen('Casper')}>
                            <Typography variant="h6">Casper</Typography>
                            <NumberCircles num={props.DINING_HALLS.filter(h => h.name === "Casper")[0]?.numPeople} small={false} isDonor={isDonor}/>
                        </div>
                    </div>
                    <div className='cs278-map-arrillaga' onClick={() => handleMatchOpen('Arrillaga')}>
                        <Typography variant="h6">Arrillaga</Typography>
                        <NumberCircles num={props.DINING_HALLS.filter(h => h.name === "Arrillaga")[0]?.numPeople} small={false} isDonor={isDonor}/>
                    </div>
                    <div className='cs278-map-sternWilbur'>
                        <div className='cs278-map-brannerStern' onClick={() => handleMatchOpen('Stern')}>
                            <Typography variant="h6">Stern</Typography>
                            <NumberCircles num={props.DINING_HALLS.filter(h => h.name === "Stern")[0]?.numPeople} small={false} isDonor={isDonor}/>
                        </div>
                        <div className='cs278-map-casperWilbur' onClick={() => handleMatchOpen('Wilbur')}>
                            <Typography variant="h6">Wilbur</Typography>
                            <NumberCircles num={props.DINING_HALLS.filter(h => h.name === "Wilbur")[0]?.numPeople} small={false} isDonor={isDonor}/>
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
