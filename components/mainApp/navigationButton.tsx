import React from "react";
import {
    BrowserRouter,
    Switch,
    Route,
    Link,
    Provider
} from "react-router-dom";
import DGoalList from "../../util/DGoalList";
import GoalListView from "../goalListView";
import { Session } from "@inrupt/solid-ui-react/dist";

import base64url from "base64url";
import GoalEditor from "../goalEditor";
import { Button, ButtonBase, CircularProgress, makeStyles, Typography } from "@material-ui/core";

import { withRouter, History } from "react-router-dom";
import CompletionEditor from "../completionEditor"
import { Add, Home, List, Person, Timeline } from "@material-ui/icons";


import styles from "../app.module.css";


type NavigationButtonProps = {
    tgtUrl: string;
    icon: JSX.Element;
    history: History;
}
class NavigationButton extends React.Component<NavigationButtonProps> {
    render() {
        return <div className={styles.navButtonHolder}>
            <ButtonBase onClick={() => {this.props.history.push(this.props.tgtUrl)}}>
                <div className={styles.navButton}>
                    {this.props.icon}
                </div>
            </ButtonBase>
        </div>;
    }
}

export default withRouter(NavigationButton);