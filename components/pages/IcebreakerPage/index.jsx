import React from 'react';
import './index.css';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import PersonIcon from '@material-ui/icons/Person';
import RestaurantRoundedIcon from '@material-ui/icons/RestaurantRounded';
import { makeStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import Divider from '@material-ui/core/Divider';


// TODO: header has no name?
const icebreakers = ['Describe your ideal day.', "What's your favorite way to waste time?", 
    'Hottest take / Unpopular opinion?', 'What would your life theme song be?', 
    'Weirdest food combo you like?', 'Late Night vs. TAP?'];

const useStyles = makeStyles({
    avatar: {
        backgroundColor: grey[200],
        color: grey[800],
        width: '6rem',
        height: '6rem',
        marginBottom: '0.7rem',
    },
    restaurant: {
        backgroundColor: grey[50],
        color: grey[900],
        width: '5rem',
        height: '5rem',
        marginRight: '1rem',
        marginLeft: '1rem',
        marginBottom: '2.2rem',
    },
});

function IcebreakerPage() {
    const handleListItemClick = (value) => {
        console.log(value);
    };

    const classes = useStyles();
    return (
        <div className='cs278-icebreaker-container'>
            <div className='cs278-icebreaker-topDiv'>
                <Typography className='cs278-icebreaker-title' variant="h6">It's a (Meal) Match Made in Heaven!</Typography>
                <div className='cs278-icebreaker-graphics'>
                    <div className='cs278-icebreaker-avatarDiv'>
                        <Avatar sx={{ width: '6rem', height: '6rem',}} className={classes.avatar}>
                            <PersonIcon className='cs278-icebreaker-icon'/>
                        </Avatar>
                        <Typography>Person A</Typography>
                    </div>
                    <div className='cs278-icebreaker-avatarDiv'>
                        <Avatar className={classes.restaurant} style={{ border: '1px solid black' }}>
                            <RestaurantRoundedIcon className='cs278-icebreaker-restoIcon'/>
                        </Avatar>
                    </div>
                    <div className='cs278-icebreaker-avatarDiv'>
                        <Avatar className={classes.avatar}>
                            <PersonIcon className='cs278-icebreaker-icon'/>
                        </Avatar>
                        <Typography>You</Typography>
                    </div>
                </div>
                
            </div>
            <Divider variant="middle" style={{width:'86%', backgroundColor: 'black', marginBottom: "8%"}}/>
            <Typography style={{textAlign: 'center'}} className='cs278-icebreaker-ibText' variant="h6">Let's Break the Ice</Typography>
            <Typography style={{textAlign: 'center'}} className='cs278-icebreaker-ibText' variant="h6">Before Your First Meal :D</Typography>
            <List className='cs278-icebreaker-list'>
                {icebreakers.map((ib) => (
                    <ListItem style={{backgroundColor: "#DDDCDC", marginTop: "2%", height: '2.5rem'}} button onClick={() => handleListItemClick(ib)} key={ib}>
                        <ListItemText className='cs278-icebreaker-ibText' primary={ib}/>
                    </ListItem>
                ))}
            </List>
        </div>
    )
}

export default IcebreakerPage;
