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

import NavigationButton from "./navigationButton"

class Navigation extends React.Component {
    render() {
        return (
            <div className={styles.topNavBar}>
                <NavigationButton tgtUrl="/goals" icon={<List />} />
                <NavigationButton tgtUrl="/analytics" icon={<Timeline />} />
                <NavigationButton tgtUrl="/" icon={<Home />} />
                <NavigationButton tgtUrl="/user" icon={<Person />} />
                <NavigationButton tgtUrl="/add" icon={<Add />} />
            </div>
        )
    }
};

type MainAppProps = {
    session: Session;
    history: History;
}

type MainAppState = {
    goalList?: DGoalList;
    loading: boolean;
};


import { CombinedDataProvider, LogoutButton, Text } from "@inrupt/solid-ui-react";
import { FOAF } from "@inrupt/lit-generated-vocab-common";
import { createCompletionOfType } from "../../util/Completions/CompletionUtil";
import Callable from "../../util/Callable";
import { GoalViewMode } from "../goalView";
import DAbstractCompletion from "../../util/Completions/DAbstractCompletion";
import CompletionList from "../completionList";
import AnalyticsView from "../analyticsView";
import Motivate from "../motivate";



class MainApp extends React.Component<MainAppProps, MainAppState> {
    constructor(props) {
        super(props);
        this.state = {
            goalList: null,
            loading: false
        };
        this.initState();
    }

    private async initState() {
        const goalList = await DGoalList.fromSession(this.props.session);
        this.setState({
            goalList: goalList
        });
    }

    renderCompletion(goal_id, date) {
        const goal = this.state.goalList.getGoal(base64url.decode(goal_id));
        if (!goal) {
            return <Typography>
                The goal couldn't be found. Would you like to <Link to="/">go home?</Link>
            </Typography>
        }

        if (date === "list") {
            return <CompletionList goal={goal} />
        }

        const dateObj = new Date(Number(date));

        return <CompletionEditor goal={goal} date={dateObj} />
    }

    renderEdit(id) {
        const goal = this.state.goalList.getGoal(base64url.decode(id));
        if (!goal) {
            return <Typography>
                The goal couldn't be found. Would you like to <Link to="/">go home?  </Link>
            </Typography>
        }
        return <div>
            <GoalEditor goal={goal} />
        </div>
    }

    render() {
        let body;
        const { webId } = this.props.session.info;

        if (this.state.goalList == null || this.state.loading) {
            body = (
                <CircularProgress />
            )
        } else {
            // TODO: max height fix
            body = (
                <div>
                    <Switch>
                        <Route path="/goals" exact>

                            <GoalListView mode={GoalViewMode.RedirectToEdit} goalList={this.state.goalList} timed={false} />
                        </Route>

                        <Route path="/analytics">
                            <AnalyticsView goalList={this.state.goalList} />
                        </Route>

                        <Route path="/user" exact>
                            <div>
                                <div className={styles.padded}>
                                    <Button variant="contained" color="primary"
                                        onClick={() => {
                                            this.props.history.push("/");
                                            location.reload();
                                        }}>
                                        Log&nbsp;out
                                    </Button>
                                </div>

                                <div className={styles.padded}>
                                    <a href="https://podbrowser.inrupt.com/">
                                        <Button variant="contained" color="primary">
                                            Manage data
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        </Route>

                        <Route path="/add" exact>
                            <GoalEditor goalList={this.state.goalList} />
                        </Route>

                        <Route path="/completion/:goal/:completion" exact render={({ match }) => this.renderCompletion(match.params.goal, match.params.completion)} />

                        <Route path="/edit/:id" render={({ match }) => this.renderEdit(match.params.id)} />

                        <Route path="/" exact>
                            <Typography variant="h5" className={styles.padded}>
                                {"Hello, "}
                                <CombinedDataProvider datasetUrl={webId} thingUrl={webId}>
                                    <Text property={FOAF.name.iri.value} />
                                </CombinedDataProvider>!

                                    Here's your list of goals for today.
                                </Typography>
                            <GoalListView mode={GoalViewMode.RedirectToAddCompletion} goalList={this.state.goalList} timed={true} />
                        </Route>

                        <Route>
                            <p>No match</p>
                        </Route>

                    </Switch>
                </div>
            );
        }


        return (
            <div className={styles.app}>
                <div className={styles.mainDiv}>
                    <Navigation />
                    <div className={styles.routeContents}>
                        {body}
                    </div>
                    <Route path="/" exact>
                        <div className={styles.routeContents}>
                            <Motivate />
                        </div>
                    </Route>
                </div>
            </div>
        )
    }
};

export default withRouter(MainApp);