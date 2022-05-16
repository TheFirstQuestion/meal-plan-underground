import React from 'react';
import './index.css';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
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
import { HashRouter, Route } from "react-router-dom";

const useStyles = makeStyles({
    avatar: {
      backgroundColor: grey[50],
      color: grey[800],
    },
});

// TODO: remove this helper when demo phase is over
function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function MatchListPopup({...props}) {
    const classes = useStyles();
    const { onClose, selectedValue, open, hall, num } = props;

    const handleClose = () => {
      onClose(selectedValue);
    };

    const handleListItemClick = (value) => {
        onClose(value);
        props.setMatched(value);
    };

    const dh = props.DINING_HALLS.filter(h => h.name === hall.name)[0];

    // TODO: remove the shuffling and randomness when demo phase is over
    const people = () => {
      const shuffledPeople = shuffle(dh.people);
      const randomPeople = [];
      for(let i = 0; i < num; i++) {
        randomPeople.push(shuffledPeople[i]);
      }
      return randomPeople;
    };
    
    const randomPerson = people()[0];

    return (
      <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
        <DialogTitle className='cs278-map-dialogTitle' id="simple-dialog-title">{hall.name}: {num} {props.user.isDonor ? "recipients" : "donors"}</DialogTitle>
        <List className='cs278-map-list'>
          {people().map((person) => (
            <ListItem key={person._id}>
                <ListItemAvatar>
                    <Avatar className={classes.avatar}>
                        <PersonIcon />
                    </Avatar>
                </ListItemAvatar>
                <div className='cs278-map-userInfo'>
                    <Typography style={{fontWeight:'bold'}} variant='body1'>{person.first_name}</Typography>
                    <Typography variant='body1'>{person.major}</Typography>
                    <Typography variant='body1'>{person.biography}</Typography>
                </div>
                <HashRouter>
                    <Button onClick={() => handleListItemClick(person)} href={'#/icebreaker'} variant="contained" style={{backgroundColor: '#508347', color: 'white', textTransform: 'none'}} >match</Button>
                    <Route path={"/icebreaker"} render={props => <IcebreakerPage {...props}/> }/>
                </HashRouter>
                {/* <Button component={RouterLink} to={"/icebreaker/:" + person} variant="contained" style={{backgroundColor: '#508347', color: 'white', textTransform: 'none'}} onClick={() => handleListItemClick(person)}>match</Button> */}
            </ListItem>
          ))}

          <ListItem>
            <ListItemAvatar>
              <Avatar className={classes.avatar}>
                <ShuffleIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="surprise me!" />
            <HashRouter>
                <Button onClick={() => handleListItemClick(randomPerson)} href={'#/icebreaker/:' + randomPerson._id} variant="contained" style={{backgroundColor: '#508347', color: 'white', textTransform: 'none'}} >match</Button>
                <Route path={"/icebreaker/:person" + randomPerson._id} render={props => <IcebreakerPage {...props}/>}/>
            </HashRouter>
          </ListItem>
        </List>
      </Dialog>
    );
}

MatchListPopup.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedValue: PropTypes.object,
    hall: PropTypes.object,
    num: PropTypes.number.isRequired,
    user: PropTypes.object.isRequired,
    people: PropTypes.array,
};

export default MatchListPopup;
