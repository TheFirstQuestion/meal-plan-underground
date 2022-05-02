import React from 'react';
import { Typography, Divider, Link } from '@material-ui/core';
import './userDetail.css';
import axios from 'axios';

/**
 * Define UserDetail, a React componment of CS142 project #5
 */
class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        userInfo: "",
        topPhotos: null,
    };
    this.prevUserId = "";
    this.componentDidUpdate();
  }

  componentDidUpdate() {
        // Check if we've re-rendered (do nothing) or changed URL
        if (this.prevUserId !== this.props.match.params.userId) {
            axios("/user/" + this.props.match.params.userId).then((val) => {
                this.prevUserId = this.state.userInfo._id;
                this.props.setContext("User Info for @" + val.data.first_name + val.data.last_name);
                this.setState({userInfo: val.data});
            });
            axios("/getTop/" + this.props.match.params.userId).then((val) => {
                this.setState({topPhotos: val.data});
            });
        }
  }

  render() {
    return (
      <div className="user-detail-wrapper">
          <Typography variant="h2">
            {this.state.userInfo.first_name} {this.state.userInfo.last_name}, {this.state.userInfo.occupation}
          </Typography>
          <Divider />

          <Typography variant="h5">
            Can be found somewhere near: {this.state.userInfo.location}
          </Typography>

          <Typography variant="body1" className="user-detail-description">
            {this.state.userInfo.description}
          </Typography>
          <Divider />
          <Typography variant="body1">
          <Link href={"#/photos/" + this.state.userInfo._id}>
            See all photos from {this.state.userInfo.first_name} {this.state.userInfo.last_name}
          </Link>
          </Typography>
          <div sm={4} className="user-wrapper">
          {
              this.state.topPhotos ?(
              <>
              <Link href={"#/photos/" + this.state.userInfo._id}>
                  <img
                      src={"/images/" + this.state.topPhotos.recent.file_name}
                      loading="lazy"
                      className="user-photo"
                  />
                  <Typography>{this.state.topPhotos.recent.date_time}</Typography>
              </Link>
              <Link href={"#/photos/" + this.state.userInfo._id}>
                  <img
                      src={"/images/" + this.state.topPhotos.mostComments.file_name}
                      loading="lazy"
                      className="user-photo"
                  />
                  <Typography>{this.state.topPhotos.mostComments.comments.length} Comments</Typography>
              </Link>
              </>
            ): <></>
          }

          </div>
      </div>
    );
  }
}

export default UserDetail;
