import React from "react";

import { CircularProgress, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

import DDatasetBase from "../../util/DDatasetBase";
import DGoalList from "../../util/DGoalList";
import Callable from "../../util/Callable";
import { DGoal } from "../../util/DGoal";

import GoalView, { GoalViewMode } from "../goalView";

import styles from "../list.module.css";


type GoalListViewProps = {
    goalList: DGoalList;
    mode: GoalViewMode;
    timed: boolean;
};

type GoalListViewState = {
    callableGoalsUpdate: Callable;
    listeningTo: DDatasetBase[];
    goals: DGoal[];
};

class GoalListView extends React.Component<GoalListViewProps, GoalListViewState> {
    constructor(props){
        super(props);

        this.state = {
            callableGoalsUpdate: new Callable(this, this.onGoalsUpdated),
            listeningTo: [props.goalList],
            goals: null
        };

        props.goalList.addListener(this.state.callableGoalsUpdate);
    }

    componentWillUnmount(){
        for(const d of this.state.listeningTo){
            d.deleteListener(this.state.callableGoalsUpdate);
        }
    }

    componentDidMount(){
        this.onGoalsUpdated();
    }

    onGoalsUpdated(){
        const goals = this.props.goalList.getGoals();
        if(goals == null) return;

        for(const goal of goals){
            if(this.state.listeningTo.indexOf(goal.completionHistory) == -1){
                this.state.listeningTo.push(goal.completionHistory);
                goal.completionHistory.addListener(this.state.callableGoalsUpdate);
            }
        }
        this.setState({goals});
    }


    private renderGoal(goal, txt?){
        return <GoalView
            className={styles.listItem} mode={this.props.mode}
            key={goal.url} goal={goal}
            extraText={txt}
        />;
    }

    render(){
        if(!this.props.goalList.ready || this.state.goals == null){
            return <CircularProgress />;
        }
        
        if(this.state.goals.length == 0){
            return (
                <div>
                    <Typography>
                        You have no goals. Would you like to <Link to="/add">create one?</Link>
                    </Typography>
                </div>
            );
        }

        let goalsArray = [];
        if(this.props.timed){
            for(const goal of this.state.goals){
                const txt = goal.completionHistory.getCompletionTimeRemaining();
                if(txt){
                    goalsArray.push(this.renderGoal(goal, txt));
                }
                if(!goal.completionHistory.ready) return <CircularProgress />;
            }

            if(goalsArray.length == 0){
                return (<Typography>
                    Looks like you've caught up with everything! You have no goals left to complete.
                </Typography>);
            }
        }else{
            goalsArray = this.state.goals.map((goal) => this.renderGoal(goal));
        }

        return (
            <div className={styles.list}>{goalsArray}</div>
        );
    }
}

export default GoalListView;