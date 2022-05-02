import React from 'react';
import { Typography, Grid, Button } from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import './favorites.css';
import axios from 'axios';


/**
 * Define Favorites, a React componment of CS142 project #8
 */
class Favorites extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        photos: [],
        modalPhoto: null,
        modalOpen: false,
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

    this.getData();
  }

  getData() {
      axios("/getFavorites/" + this.props.match.params.userId).then((val) => {
          this.setState({ photos: val.data });
          this.props.setContext("Your Favorite Photos");
      });
  }

    static unfavorite(event) {
        // Stop DOM from generating a POST
        event.preventDefault();
        event.stopPropagation();
        // Hold on to this to avoid error from using event again later
        const tar = event.target;

        const whichPhoto = tar.parentNode.id;
        axios.get("/clickFavorite/" + whichPhoto)
            .then((response) => {
                if (response.status !== 200) {
                    console.log("Error: " + response.status + " " + response.statusText);
                }
                // Update here, rather than by refreshing all data, for speed reasons
                tar.parentNode.parentNode.classList.add('d-none');
            }).catch((err) => {
                console.log(err);
        });
    }

    openModal(photo) {
        this.setState({
            modalPhoto: photo,
            modalOpen: true,
        });
    }

    closeModal() {
        this.setState({
            modalOpen: false,
        });
    }


    render() {
        return (
            <Grid container>
                {this.state.photos.map((photo) => (
                    <Grid item key={photo._id} sm={4} className="user-photos-wrapper">
                        <img
                            src={"/images/" + photo.file_name}
                            loading="lazy"
                            className="user-photo"
                            onClick={() => this.openModal(photo)}
                        />
                        <Button variant="contained" color="primary" size="small" id={photo._id} onClick={Favorites.unfavorite}>Unfavorite</Button>
                    </Grid>
                ))}
                {
                    this.state.modalPhoto ? (
                    <Dialog open={this.state.modalOpen} onClose={this.closeModal}>
                        <DialogTitle>Photo Details</DialogTitle>
                        <img
                            src={"/images/" + this.state.modalPhoto.file_name}
                            loading="lazy"
                        />
                        <Typography variant="h6">Date: {this.state.modalPhoto.date_time.toString()}</Typography>
                    </Dialog>
                    ): <></>
                }
            </Grid>
        );
    }
}

export default Favorites;
