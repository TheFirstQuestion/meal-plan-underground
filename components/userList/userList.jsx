import React from 'react';
import { Divider, List, ListItem, ListItemText, Typography, Link }
from '@material-ui/core';
import './userList.css';
import axios from 'axios';


/**
 * Define UserList, a React componment of CS142 project #5
 */
class UserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: undefined,
        };
        axios("/user/list").then((val) => {
            this.setState({ users: val.data });
        });

    }

    render() {
        return (
          <div className="userList">
            <Typography variant="h5">
              User List:
            </Typography>

            <List component="nav">
                {this.state.users ?
                    this.state.users.map((user) => (
                    <div key={user._id}>
                        <Link href={"#/users/" + user._id}>
                            <ListItem>
                              <ListItemText primary={user.first_name + " " + user.last_name} />
                            </ListItem>
                        </Link>
                        <Divider />
                    </div>
                    )) : ""
                }
            </List>
            <Typography variant="body1">
              Click on a user&apos;s name to view the details of that user.
            </Typography>
            <Divider />
            <Typography variant="h6">
                <Link href={"#/favorites/" + this.props.LOGGED_IN_USER._id}>
                    Your Favorite Photos
                </Link>
            </Typography>
          </div>
        );
    }
}

export default UserList;
