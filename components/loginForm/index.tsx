import { LoginButton } from "@inrupt/solid-ui-react";
import { Button, TextField, FormGroup, Container, Paper, Typography } from "@material-ui/core";
import React from "react";

import styles from "../app.module.css";
import Motivate from "../motivate";

type LoginFormParams = {

};

type LoginFormState = {
    identityProvider: string;
    currentUrl: string;
};

class LoginForm extends React.Component<LoginFormParams, LoginFormState> {
    constructor(params) {
        super(params);

        this.state = {
            identityProvider: "https://inrupt.net",
            currentUrl: "https://localhost:3000"
        }
    }

    componentDidMount(){
        this.setState({
            currentUrl: window.location.href
        });
    }

    setIdp(to: string){
        this.setState({
            identityProvider: to
        });
    }

    render() {
        return <div className={styles.app}>
            <div className={styles.mainDiv}>
                <div className={styles.routeContents}>
                    <div className={styles.padded}>
                        <Typography variant="h6">GoalGoat</Typography>
                    </div>
                    <div className={styles.padded}>
                        <Typography>
                            Welcome to GoalGoat! A habit/goal tracking app. Please log in or register with your Solid provider below.
                    </Typography>
                    </div>
                    <div className={styles.padded}>
                        <FormGroup>
                            <TextField
                                label="Identity Provider"
                                placeholder="Identity Provider"
                                type="url"
                                value={this.state.identityProvider}
                                onChange={(e) => this.setIdp(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <LoginButton oidcIssuer={this.state.identityProvider} redirectUrl={this.state.currentUrl}>
                                            <Button variant="contained" color="primary">
                                                Log&nbsp;in
                                        </Button>
                                        </LoginButton>
                                    ),
                                }}
                            />
                        </FormGroup>
                    </div>
                </div>

                <div className={styles.routeContents}>
                    <Motivate />
                </div>
            </div>
        </div>

    }
};

export default LoginForm;