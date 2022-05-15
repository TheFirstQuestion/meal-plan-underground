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

import './index.css';

const people = ['Leilenah', 'Steven', 'Hillary', 'Ellie'];
const useStyles = makeStyles({
    avatar: {
      backgroundColor: grey[100],
      color: grey[800],
      width: '3.5rem',
      height: '3.5rem',
      marginRight: '1rem',
    },
});
export default function PairingsPage({...props}) {
    useEffect(() => {
        props.setContext("pairings");
    }, []);

    const handleListItemClick = (value) => {
        console.log(value);
    };
    const classes = useStyles();
    return (
        <div className='cs278-pairings-container'>
            <List className='cs278-pairings-list'>
            {people.map((person) => (
                <div key={person}>
                    <ListItem style={{height: '4.6rem'}} button onClick={() => handleListItemClick(person)} >
                        <ListItemAvatar>
                            <Avatar className={classes.avatar}>
                                <PersonIcon className='cs278-pairings-icon' />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={person}/>
                    </ListItem>
                    <Divider style={{width:'100%', backgroundColor: 'black'}}/>
                </div>
                
            ))}
            </List>
        </div>
    );
}
