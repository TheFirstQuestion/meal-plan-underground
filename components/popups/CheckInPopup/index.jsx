import React from 'react';
import './index.css';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';

function CheckInPopup(props) {
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
                key={hall.name + "-item"}
            >
              <ListItemText
                className='cs278-map-hallText'
                primary={hall.name}
                key={hall.name + "-text"}
              />
            </ListItem>
          ))}
        </List>
      </Dialog>
    );
}

CheckInPopup.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedValue: PropTypes.object,
};

export default CheckInPopup;
