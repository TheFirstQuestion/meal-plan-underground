import React, { useEffect, useState } from 'react';
import CheckInPopup from '../../popups/CheckInPopup';
import MatchListPopup from '../../popups/MatchListPopup';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import ShuffleIcon from '@material-ui/icons/Shuffle';
import Typography from '@material-ui/core/Typography';
import { grey } from '@material-ui/core/colors';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';
import './index.css';

const people = ['Leilenah', 'Steven', 'Hillary', 'Ellie'];
const useStyles = makeStyles({
    avatar: {
      backgroundColor: grey[50],
      color: grey[800],
    },
});

function CheckInDialog(props) {
    const classes = useStyles();
    const { onClose, selectedValue, open } = props;

    const handleClose = () => {
      onClose(selectedValue);
    };

    const handleListItemClick = (value) => {
      onClose(value);
    };

    return (
      <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
        <DialogTitle className='cs278-map-dialogTitle' id="simple-dialog-title">Check-In</DialogTitle>
        <Typography style={{textAlign: 'center'}} className='cs278-map-questionTyp'>Which dining hall are you at?</Typography>
        <List className='cs278-map-list'>
          {props.DINING_HALLS.map((hall) => (
            <ListItem
                button
                onClick={() => handleListItemClick(hall)}
                key={hall.name}
            >
              <ListItemText
                className='cs278-map-hallText'
                primary={hall.name}
              />
            </ListItem>
          ))}
        </List>
      </Dialog>
    );
}

CheckInDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedValue: PropTypes.object,
};

function MatchDialog(props) {
    const classes = useStyles();
    const { onClose, selectedValue, open, hall, num } = props;

    const handleClose = () => {
      onClose(selectedValue);
    };

    const handleListItemClick = (value) => {
        onClose(value);
    };

    return (
      <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
        <DialogTitle className='cs278-map-dialogTitle' id="simple-dialog-title">{hall.name}: {num} {props.user.isDonor ? "recipients" : "donors"}</DialogTitle>
        <List className='cs278-map-list'>
          {people.map((person) => (
            <ListItem key={person}>
              <ListItemAvatar>
                <Avatar className={classes.avatar}>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={person}/>
              <Button component={RouterLink} to={"/icebreaker/:" + person} variant="contained" style={{backgroundColor: '#508347', color: 'white', textTransform: 'none'}} onClick={() => handleListItemClick(person)}>match</Button>
            </ListItem>
          ))}

          <ListItem>
            <ListItemAvatar>
              <Avatar className={classes.avatar}>
                <ShuffleIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="surprise me!" />
            <Button variant="contained" style={{backgroundColor: '#508347', color: 'white', textTransform: 'none'}} onClick={() => handleListItemClick('Surprise')}>match</Button>
          </ListItem>
        </List>
      </Dialog>
    );
}

MatchDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedValue: PropTypes.string.isRequired,
    hall: PropTypes.object,
    num: PropTypes.number.isRequired,
    user: PropTypes.object.isRequired,
    people: PropTypes.array,
};

function NumberCircles({num, small}) {
    let circle;
    if (small) {
        circle = (
            <div className='cs278-map-reCircles'>
                <Typography variant="h6">{num}</Typography>
            </div>
        );
    } else {
        circle = (
            <div className='cs278-map-otherCircles'>
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
    const [selectedMatch, setSelectedMatch] = useState('');
    const [hallOpen, setHallOpen] = useState(true);
    const [selectedHall, setSelectedHall] = useState(null);

    // get the people at eat dining hall and store
    props.DINING_HALLS.forEach((item, i) => {
        axios.get("/list/users/" + item._id).then((response) => {
            item.people = response.data;
            item.numPeople = response.data.length;
        }).catch((err) => {
            console.log(err);
        });
    });

    useEffect(() => {
        props.setContext("map");
    }, []);


    const handleMatchOpen = (newHall, newPeople) => {
        console.log(newHall)
        const dh = props.DINING_HALLS.filter(h => h.name === newHall)[0];
        console.log(dh);
        setHall(dh);
        setNumPeople(dh.numPeople);
        setMatchOpen(true);
    }

    const handleMatchClose = (value) => {
        setMatchOpen(false);
        if (value === "") {
            return;
        }
        // console.log(value);
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
            setSelectedHall(hall);
            setHall(hall);
            setMatchOpen(true);
            handleMatchOpen(hall.name);
        }
        setHallOpen(false);
        
    };

    return (
        <div className='cs278-map-container'>
            <Button className='cs278-map-button' variant="outlined" onClick={handleHallOpen}>Check-In</Button>
            <CheckInDialog
                selectedValue={selectedHall}
                open={hallOpen}
                onClose={handleHallClose}
                DINING_HALLS={props.DINING_HALLS}
            />
            <div className='cs278-map-halls'>
                <div className='cs278-map-leftDiv'>
                    <div className='cs278-map-ricker' onClick={() => handleMatchOpen('Ricker')}>
                        <Typography variant="h6">Ricker</Typography>
                        <NumberCircles num={props.DINING_HALLS.filter(h => h.name === "Ricker")[0].numPeople} small={true}/>
                    </div>
                    <div className='cs278-map-lakeside' onClick={() => handleMatchOpen('Lakeside')}>
                        <Typography variant="h6">Lakeside</Typography>
                        <NumberCircles num={props.DINING_HALLS.filter(h => h.name === "Lakeside")[0].numPeople} small={false}/>
                    </div>
                    <div className='cs278-map-flomo' onClick={() => handleMatchOpen('FloMo')}>
                        <Typography variant="h6">FloMo</Typography>
                        <NumberCircles num={props.DINING_HALLS.filter(h => h.name === "FloMo")[0].numPeople} small={false}/>
                    </div>
                </div>
                <div className='cs278-map-rightDiv'>
                    <div className='cs278-map-evgr' onClick={() => handleMatchOpen('EVGR')}>
                        <Typography variant="h6">EVGR</Typography>
                        <NumberCircles num={props.DINING_HALLS.filter(h => h.name === "EVGR")[0].numPeople} small={true}/>
                    </div>
                    <div className='cs278-map-brannerCasper'>
                        <div className='cs278-map-brannerStern' onClick={() => handleMatchOpen('Branner')}>
                            <Typography variant="h6">Branner</Typography>
                            <NumberCircles num={props.DINING_HALLS.filter(h => h.name === "Branner")[0].numPeople} small={false}/>
                        </div>
                        <div className='cs278-map-casperWilbur' onClick={() => handleMatchOpen('Casper')}>
                            <Typography variant="h6">Casper</Typography>
                            <NumberCircles num={props.DINING_HALLS.filter(h => h.name === "Casper")[0].numPeople} small={false}/>
                        </div>
                    </div>
                    <div className='cs278-map-arrillaga' onClick={() => handleMatchOpen('Arrillaga')}>
                        <Typography variant="h6">Arrillaga</Typography>
                        <NumberCircles num={props.DINING_HALLS.filter(h => h.name === "Arrillaga")[0].numPeople} small={false}/>
                    </div>
                    <div className='cs278-map-sternWilbur'>
                        <div className='cs278-map-brannerStern' onClick={() => handleMatchOpen('Stern')}>
                            <Typography variant="h6">Stern</Typography>
                            <NumberCircles num={props.DINING_HALLS.filter(h => h.name === "Stern")[0].numPeople} small={false}/>
                        </div>
                        <div className='cs278-map-casperWilbur' onClick={() => handleMatchOpen('Wilbur')}>
                            <Typography variant="h6">Wilbur</Typography>
                            <NumberCircles num={props.DINING_HALLS.filter(h => h.name === "Wilbur")[0].numPeople} small={false}/>
                        </div>
                    </div>
                    {
                        hall ? (
                            <MatchDialog selectedValue={selectedMatch} open={matchOpen} onClose={handleMatchClose} hall={hall} num={numPeople} user={props.user}/>
                        ):
                            <></>
                    }
                </div>
            </div>
        </div>
    );
};
