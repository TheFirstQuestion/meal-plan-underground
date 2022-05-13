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

import './index.css';
// TODO: make state variable for donor/receiver

const people = ['Leilenah', 'Steven', 'Hillary', 'Ellie'];
const useStyles = makeStyles({
    avatar: {
      backgroundColor: grey[50],
      color: grey[800],
    },
});

  function SimpleDialog(props) {
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
        {/* (TODO: get from state variable for donors/receivers) */}
        <DialogTitle className='cs278-map-dialogTitle' id="simple-dialog-title">{hall}: {num} donors</DialogTitle>
        <List className='cs278-map-list'>
          {people.map((person) => (
            <ListItem key={person}>
              <ListItemAvatar>
                <Avatar className={classes.avatar}>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={person}/>
              <Button variant="contained" style={{backgroundColor: '#508347', color: 'white', textTransform: 'none'}} onClick={() => handleListItemClick(person)}>match</Button>
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

SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedValue: PropTypes.string.isRequired,
    hall: PropTypes.string.isRequired,
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
    const [hall, setHall] = useState('');
    const [numPeople, setNumPeople] = useState(0);
    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(people[1]);
    
    useEffect(() => {
        props.setContext("map");
    }, []);

    const handleClickOpen = (newHall, newPeople) => {
        setHall(newHall);
        setNumPeople(newPeople);
        setOpen(true);
    }

    const handleClose = (value) => {
        console.log(value);
        setOpen(false);
        setSelectedValue(value);
    };

    return (
        <div className='cs278-map-container'>
            <div className='cs278-map-leftDiv'>
                <div className='cs278-map-ricker' onClick={() => handleClickOpen('Ricker', 0)}>
                    <Typography variant="h6">Ricker</Typography>
                    <NumberCircles num={0} small={true}/>
                </div>
                <div className='cs278-map-lakeside' onClick={() => handleClickOpen('Lakeside', 3)}>
                    <Typography variant="h6">Lakeside</Typography>
                    <NumberCircles num={3} small={false}/>
                </div>
                <div className='cs278-map-flomo' onClick={() => handleClickOpen('Flomo', 1)}>
                    <Typography variant="h6">FloMo</Typography>
                    <NumberCircles num={1} small={false}/>
                </div>
            </div>
            <div className='cs278-map-rightDiv'>
                <div className='cs278-map-evgr' onClick={() => handleClickOpen('EVGR', 3)}>
                    <Typography variant="h6">EVGR</Typography>
                    <NumberCircles num={3} small={true}/>
                </div>
                <div className='cs278-map-brannerCasper'>
                    <div className='cs278-map-brannerStern' onClick={() => handleClickOpen('Branner', 1)}>
                        <Typography variant="h6">Branner</Typography>
                        <NumberCircles num={1} small={false}/>
                    </div>
                    <div className='cs278-map-casperWilbur' onClick={() => handleClickOpen('Casper', 0)}>
                        <Typography variant="h6">Casper</Typography>
                        <NumberCircles num={0} small={false}/>
                    </div>
                </div>
                <div className='cs278-map-arrillaga' onClick={() => handleClickOpen('Arrillaga', 4)}>
                    <Typography variant="h6">Arrillaga</Typography>
                    <NumberCircles num={4} small={false}/>
                </div>
                <div className='cs278-map-sternWilbur'>
                    <div className='cs278-map-brannerStern' onClick={() => handleClickOpen('Stern', 2)}>
                        <Typography variant="h6">Stern</Typography>
                        <NumberCircles num={2} small={false}/>
                    </div>
                    <div className='cs278-map-casperWilbur' onClick={() => handleClickOpen('Wilbur', 4)}>
                        <Typography variant="h6">Wilbur</Typography>
                        <NumberCircles num={4} small={false}/>
                    </div>
                </div>
                <SimpleDialog selectedValue={selectedValue} open={open} onClose={handleClose} hall={hall} num={numPeople}/>
            </div>
            {/* <div>TODO: Map view goes here</div>
            <div>NOTE: Check-in popup and match list popup are accessed through this page</div> */}
        </div>
    );
};
