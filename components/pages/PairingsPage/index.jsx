import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import PersonIcon from '@material-ui/icons/Person';
import { grey } from '@material-ui/core/colors';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import './index.css';

const useStyles = makeStyles({
    avatar: {
      backgroundColor: grey[100],
      color: grey[800],
      width: '3.8rem',
      height: '3.8rem',
      marginRight: '1rem',
    },
});
export default function PairingsPage({...props}) {
    useEffect(() => {
        props.setContext("Pairings");
    }, []);

    const handleListItemClick = (value) => {
        window.location = `mailto:yourmail@gmail.com?subject=previous meal plan underground match!`
    };
    const classes = useStyles();
    const dh = props.DINING_HALLS.filter(h => h.name === 'Wilbur')[0];
    const people = dh.people;
    return (
        <div className='cs278-pairings-container'>
            <List className='cs278-pairings-list'>
            {people.map((person) => (
                <div key={person._id}>
                    <ListItem style={{height: '4.6rem'}} button onClick={() => handleListItemClick(person)} >
                        <ListItemAvatar>
                            <Avatar className={classes.avatar}>
                                <PersonIcon className='cs278-pairings-icon' />
                            </Avatar>
                        </ListItemAvatar>
                        <div className='cs278-pairings-userInfo'>
                            <Typography style={{fontWeight:'bold'}} variant='body1'>{person.first_name}</Typography>
                            <Typography variant='body1'>{person.major}</Typography>
                            <Typography variant='body1'>{person.biography}</Typography>
                        </div>
                    </ListItem>
                    <Divider style={{width:'100%', backgroundColor: 'black', marginTop:"4%", marginBottom: "4%"}}/>
                </div>
                
            ))}
            </List>
        </div>
    );
}
