import React from 'react';
import { AppBar, Toolbar, Typography, Grid, Button, Link } from '@material-ui/core';
import './TopBar.css';
import axios from 'axios';

/**
* Define TopBar, a React componment of CS142 project #5
*/
class TopBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        axios("/test/info").then((val) => {
            this.setState({ version: val.data.version });
        });
    }

    // via https://stackoverflow.com/a/40109797
    logOut = () => {
        this.props.logout();
    };


    // this function is called when user presses the update button
    handleUploadButtonClicked = (e) => {
        e.preventDefault();
        if (this.uploadInput.files.length > 0) {
            // Create a DOM form and add the file to it under the name uploadedphoto
            const domForm = new FormData();
            // the top is in the starter code but wasn't working -- both to make sure!
            domForm.append('uploadedphoto', this.uploadInput.files[0]);
            domForm.uploadedphoto = this.uploadInput.files[0];
            axios.post('/photos/new', domForm).then((res) => {
                if (res.status !== 200) {
                    console.log(res.statusText);
                }
            }).catch(err => console.log(`POST ERR: ${err}`));
        }
    };

    render() {
        return (
            <AppBar className="cs142-topbar-appBar" position="absolute">
                <Toolbar>
                    <Grid container justify="space-between" alignItems="center">
                        <Typography variant="h5" color="inherit">
                            Steven G. Opferman&apos;s PhotApp (v. {this.state.version})
                        </Typography>

                        <Typography variant="h6" color="inherit">
                            {this.props.context}
                        </Typography>
                        {
                            this.props.user ? (
                            <div className="col">
                                <div className="row right">
                                    <Typography variant="h6" color="inherit" id="hi">
                                        Hi, {this.props.user.first_name}!
                                    </Typography>
                                    <Button variant="contained" size="small" className="btn topButton" onClick={this.logOut}>
                                        Log Out
                                    </Button>
                                </div>
                                <div className="row">
                                    <input type="file" accept="image/*" ref={(domFileRef) => { this.uploadInput = domFileRef; }} />
                                    <Button variant="contained" size="small" className="btn" onClick={this.handleUploadButtonClicked}>
                                        Post Selected Photo
                                    </Button>
                                </div>
                            </div>
                            ):
                            (
                                <Typography variant="h6" color="inherit">
                                    <Link href="#/login">Please Log In</Link>
                                </Typography>
                            )
                        }
                    </Grid>
                </Toolbar>
            </AppBar>
        );
    }
}

export default TopBar;
