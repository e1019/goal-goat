import React from "react";

import { CircularProgress, Typography } from "@material-ui/core";

import Callable from "../../util/Callable";
import DCompletionHistory from "../../util/Completions/DCompletionHistory";
import DDatasetBase from "../../util/DDatasetBase";
import DGoalList from "../../util/DGoalList";
import { CompletionType } from "../../util/GoalFormat";
import SortedList from "../../util/Sort/SortedList";

import AnalyticsItem from "./analyticsItem";

import styles from "../list.module.css";

type AnalyticsViewParams = {
    goalList: DGoalList;
}

type AnalyticsViewState = {
    changedCallable: Callable;
    listeningTo: DDatasetBase[];

    currStreak: SortedList<DCompletionHistory>;
    longestStreak: SortedList<DCompletionHistory>;
    currNoStreak: SortedList<DCompletionHistory>;
    percentage: SortedList<DCompletionHistory>;

    lowestDeviation: SortedList<DCompletionHistory>;
};

class AnalyticsView extends React.Component<AnalyticsViewParams, AnalyticsViewState> {
    constructor(params){
        super(params);

        this.state = {
            changedCallable: new Callable(this, this.onGoalListChanged),
            listeningTo: [this.props.goalList],

            currStreak: null,
            longestStreak: null,
            currNoStreak: null,
            percentage: null,

            lowestDeviation: null
        };

        this.props.goalList.addListener(this.state.changedCallable);
    }

    componentDidMount(){
        this.onGoalListChanged();
    }

    componentWillUnmount(){
        for(const dataset of this.state.listeningTo){
            dataset.deleteListener(this.state.changedCallable);
        }
        this.setState({
            listeningTo: []
        });
    }

    onGoalListChanged(){
        const booleanTypeCH = [];
        const numeralTypeCH = [];

        const goals = this.props.goalList.getGoals();
        if(goals == null) return;

        for(const goal of goals){
            if(this.state.listeningTo.indexOf(goal.completionHistory) == -1){
                this.state.listeningTo.push(goal.completionHistory);
                goal.completionHistory.addListener(this.state.changedCallable);
            }

            if(!goal.completionHistory.ready) continue;

            switch(goal.completionType){
                case CompletionType.BOOLEAN:
                    booleanTypeCH.push(goal.completionHistory);
                    break;
                
                case CompletionType.FLOAT:
                case CompletionType.INTEGER:
                    numeralTypeCH.push(goal.completionHistory);
                    break;
            }
        }


        const currStreak = new SortedList<DCompletionHistory>(booleanTypeCH, (a, b) => a.analytics.current_streak - b.analytics.current_streak);
        const longestStreak = new SortedList<DCompletionHistory>(booleanTypeCH, (a, b) => a.analytics.longest_streak - b.analytics.longest_streak);
        const currNoStreak = new SortedList<DCompletionHistory>(booleanTypeCH, (a, b) => a.analytics.current_no_streak - b.analytics.current_no_streak);
        const percentage = new SortedList<DCompletionHistory>(booleanTypeCH, (a, b) => a.analytics.percentage - b.analytics.percentage);

        const lowestDeviation = new SortedList<DCompletionHistory>(numeralTypeCH, (a, b) => b.analytics.standard_deviation - a.analytics.standard_deviation);
        
        this.setState({currStreak, longestStreak, percentage, lowestDeviation, currNoStreak});
    }


    render(){
        if(this.state.currStreak == null){
            return <CircularProgress />;
        }

        const numCards = 3;

        return (
            <div>
                <Typography variant="h5">Analytics</Typography>
                <div className={styles.list}>

                    <AnalyticsItem list={this.state.currNoStreak} itemsToShow={numCards} headerText="Current streaks of 'No'"
                        getExtraText={(v) => (v.analytics.current_no_streak > 2) && `current streak of ${v.analytics.current_no_streak}`} />

                    <AnalyticsItem list={this.state.currStreak} itemsToShow={numCards} headerText="Current streaks of 'Yes'"
                        getExtraText={(v) => (v.analytics.current_streak > 2) && `current streak of ${v.analytics.current_streak}`} />

                    <AnalyticsItem list={this.state.longestStreak} itemsToShow={numCards} headerText="Best streaks"
                        getExtraText={(v) => (v.analytics.longest_streak > 2) && `longest streak of ${v.analytics.longest_streak}`} />

                    <AnalyticsItem list={this.state.percentage} itemsToShow={numCards} headerText="Best reliability"
                        getExtraText={(v) => (v.analytics.num_elements > 4) && `${Math.round(v.analytics.percentage * 100)}%`} />

                    <AnalyticsItem list={this.state.lowestDeviation} itemsToShow={numCards} headerText="Lowest Standard deviation"
                        getExtraText={(v) => (v.analytics.num_elements > 4) && `deviation of ${Math.round(v.analytics.standard_deviation)}`} />
                </div>
            </div>
        );
    }
};

export default AnalyticsView;