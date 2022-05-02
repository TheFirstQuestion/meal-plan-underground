import React from 'react';
import { Typography, Link, Grid, List, ListItem, Button } from '@material-ui/core';
import './userPhotos.css';
import axios from 'axios';


/**
 * Define UserPhotos, a React componment of CS142 project #5
 */
class UserPhotos extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        photos: [],
        userInfo: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.postComment = this.postComment.bind(this);

    this.getData();
  }

  getData() {
      axios("/photosOfUser/" + this.props.match.params.userId).then((val) => {
          this.setState({ photos: val.data });
      });
      axios("/user/" + this.props.match.params.userId).then((val) => {
          this.setState({ userInfo: val.data });
          this.props.setContext("Photos by @" + val.data.first_name + val.data.last_name);
      });
  }

  handleChange(event) {
      if (event.target.name === "new_comment") {
          this.setState({new_comment: event.target.value});
      } else {
          console.log("I wasn't prepared to handle this change");
      }
  }

  postComment(event) {
      // Stop DOM from generating a POST
      event.preventDefault();
      // Don't allow empty comment
      if (this.state.new_comment === "") {
          return;
      }

      const whichPhoto = event.target.parentNode.id;
      axios.post("/commentsOfPhoto/" + whichPhoto, {comment_text: this.state.new_comment})
         .then((response) => {
            if (response.status !== 200) {
                console.log(response.statusText);
            }
          // Refresh data so new comment is shown
          this.getData();
          // Clear the comment box
          this.setState({new_comment: ""});
      }).catch((err) => {
          console.log(err);
      });
  }

    static clickLike(event) {
        // Stop DOM from generating a POST
        event.preventDefault();
        event.stopPropagation();
        // Hold on to this to avoid error from using event again later
        const tar = event.target;

        const whichPhoto = tar.parentNode.id;
        axios.get("/clickLike/" + whichPhoto)
            .then((response) => {
                if (response.status !== 200) {
                    console.log("Error: " + response.status + " " + response.statusText);
                }
                // Update here, rather than by refreshing all data, for speed reasons
                tar.parentNode.previousSibling.innerText = response.data.numLikes + " Likes";
                tar.innerText = response.data.text;
            }).catch((err) => {
                console.log(err);
        });
    }

    static clickFavorite(event) {
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
                tar.innerText = response.data.text;
            }).catch((err) => {
                console.log(err);
        });
    }


    render() {
        return (
            <>
            <form onSubmit={this.handleSubmit}>
                <textarea id="TITLE" name="new_comment" value={this.state.new_comment} onChange={this.handleChange} placeholder="Type your comment here..."></textarea>
            </form>
            <Grid container>
            {this.state.photos.map((photo) => (
                <Grid item key={photo._id} sm={4} className="user-photos-wrapper">
                <img
                    src={"/images/" + photo.file_name}
                    loading="lazy"
                    className="user-photo"
                />
                <div className="user-photo-footer">
                    <div className="user-photo-tag">
                        <Typography>
                        <Link href={"#/users/" + this.state.userInfo._id}>@{this.state.userInfo.first_name}{this.state.userInfo.last_name}</Link>
                        </Typography>
                        <Typography>{photo.date_time.toString()}</Typography>
                        <Typography>{photo.likes.length} Likes</Typography>
                        <Button variant="contained" color="primary" size="small" id={photo._id} onClick={UserPhotos.clickLike}>
                            {photo.likes.includes(this.props.user._id)
                                ? "Dislike"
                                : "Like"
                            }
                        </Button>
                        <Button variant="contained" color="primary" size="small" id={photo._id} onClick={UserPhotos.clickFavorite}>
                            {this.props.user.favorites.includes(photo._id)
                                ? "Unfavorite"
                                : "Favorite"
                            }
                        </Button>
                    </div>
                    <List className="user-photo-comments">
                    {photo.comments ?
                        photo.comments.map((c) => (
                        <ListItem key={c._id}>
                        <Typography>
                            <Link href={"#/users/" + c.user._id}>@{c.user.first_name}{c.user.last_name}</Link> {c.date_time}:<br />
                            {c.comment}
                        </Typography>
                        </ListItem>
                        ))
                        : <Typography>No comments on this photo :/</Typography>
                    }
                    <Button variant="contained" color="primary" size="small" id={photo._id} onClick={this.postComment}>
                        Post Comment Here
                    </Button>
                    </List>
                </div>
                </Grid>
            ))}
            </Grid>
            </>
        );
    }
}

export default UserPhotos;
