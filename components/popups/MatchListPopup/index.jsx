import React from 'react';
import './index.css';
import axios from 'axios';
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
import IcebreakerPage from '../../pages/IcebreakerPage';

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const useStyles = makeStyles({
    avatar: {
      backgroundColor: grey[50],
      color: grey[800],
    },
});

function MatchListPopup({...props}) {
    const classes = useStyles();
    const { onClose, selectedValue, open, hall, num } = props;

    const handleClose = () => {
      onClose(selectedValue);
    };

    const handleListItemClick = (value) => {
      axios.post("/create/pairing", {
        donor: props.user,
        recipient: value,
        dining_hall: hall,
        swipe_completed: false,
        date_time: new Date(),
      })
      .then(() => {
        onClose(value);
        props.setMatched(value);
      })
      .catch((err) => {
        console.error(err);
      });
    };

    const dh = props.DINING_HALLS.filter(h => h.name === hall.name)[0];
    const people = dh.people;
    // ** there seems to be no people property of the dining halls so people is undefined

    const randomPerson = people ? people[getRandomInt(0, people.length - 1)] : {};


    return (
      <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
        <DialogTitle className='cs278-map-dialogTitle' id="simple-dialog-title">{hall.name}: {num} {props.user.isDonor ? "Recipients" : "Donors"}</DialogTitle>
        <List className='cs278-map-list'>
          { people ?
              people.map((person) => (

            <ListItem key={person._id}>
                <ListItemAvatar>
                    <Avatar
                        className={classes.avatar}
                        alt={person.first_name + " " + person.last_name}
                        src={"../../static/images/profile-photos/" + (props.user.photo_path ? props.user.photo_path : "default.png")}
                    />
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
        )) : <></>
      }
          { people ? (people.length > 1 ?
            (
            <ListItem>
              <ListItemAvatar>
                <Avatar className={classes.avatar}>
                  <ShuffleIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Surprise Me!" />
              <HashRouter>
                  <Button
                    onClick={() => handleListItemClick(randomPerson)}
                    href={'#/icebreaker/:' + randomPerson._id}
                    variant="contained"
                    style={{
                      backgroundColor: '#508347',
                      color: 'white',
                      textTransform: 'none'
                    }}>
                      match
                    </Button>
                  <Route
                    path={"/icebreaker/:person" + randomPerson._id}
                    render={props => <IcebreakerPage {...props}/>}
                  />
              </HashRouter>
          </ListItem>
          ) : <></>) : <></>
          }
        </List>
      </Dialog>
    );
}

MatchListPopup.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedValue: PropTypes.object,
    hall: PropTypes.object,
    user: PropTypes.object.isRequired,
    people: PropTypes.array,
};

export default MatchListPopup;
