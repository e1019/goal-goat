import React from "react";

import { Button, TextField, FormGroup, Typography, CircularProgress } from "@material-ui/core";
import { LoginButton } from "@inrupt/solid-ui-react";

import Motivate from "../motivate";

import styles from "../app.module.css";

type LoginFormParams = {
    loading: boolean;
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
        };
    }

    componentDidMount() {
        this.setState({
            currentUrl: window.location.href
        });
    }

    setIdp(to: string) {
        this.setState({
            identityProvider: to
        });
    }

    renderMainBody() {
        return (
            <div>
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
                <div className={styles.padded}>
                    <Typography color="textSecondary" variant="subtitle2">
                    If you don't have a Solid provider, simply click Log In and you'll be redirected to a page where you can click register. Come back to this page once you're done, and click Log In again.
                    </Typography>
                </div>
            </div>
        );
    }

    render() {
        return <div className={styles.app}>
            <div className={styles.mainDiv}>
                <div className={styles.routeContents}>
                    <div className={styles.padded}>
                        <Typography variant="h6">GoalGoat</Typography>
                    </div>

                    {this.props.loading ? <CircularProgress /> : this.renderMainBody()}
                </div>

                <div className={styles.routeContents}>
                    <Motivate />
                </div>
            </div>
        </div>;
    }
};

export default LoginForm;