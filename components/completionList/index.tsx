import { Button, Card, CardActionArea, CardContent, CircularProgress, Dialog, DialogTitle, Link, Typography } from "@material-ui/core";
import React from "react";
import Callable from "../../util/Callable";
import DAbstractCompletion from "../../util/Completions/DAbstractCompletion";
import DCompletionHistory from "../../util/Completions/DCompletionHistory";
import { DGoal } from "../../util/DGoal";
import DatePickerDialog from "../dialogs/datePicker"

import { withRouter, History } from "react-router-dom";

import GoalDataInner from "../goalView/goalDataInner"

import styles from "../list.module.css"

import relativeDate from "tiny-relative-date"


import { Skeleton } from '@material-ui/lab';

type CompletionListProps = {
    goal: DGoal;
    history: History;
};

type CompletionListState = {
    callable: Callable;
};

class CompletionList extends React.Component<CompletionListProps, CompletionListState> {
    constructor(props) {
        super(props);

        this.state = {
            callable: new Callable(this, this.onChanged)
        };

        this.props.goal.completionHistory.addListener(this.state.callable);
    }


    componentWillUnmount() {
        this.props.goal.completionHistory.deleteListener(this.state.callable);
    }

    public onChanged() {
        this.forceUpdate();
    }


    render() {

        let completionList = [];

        let sortedCompletions = null;

        if(this.props.goal.completionHistory.ready){
            sortedCompletions = this.props.goal.completionHistory.getSortedCompletions();
        }

        if (sortedCompletions) {
            completionList = sortedCompletions.list.map((v) => {
                return <div className={styles.listItem} key={v.url}>
                    <Card>
                        <CardActionArea onClick={() => {
                            this.props.history.push("/completion/" + this.props.goal.url64 + "/" + String(v.date.getTime()))
                        }}>
                            <CardContent>
                                <Typography>
                                    {v.getAsString()}
                                </Typography>

                                <Typography color="textSecondary" variant="subtitle2">
                                    {DCompletionHistory.relativeDateForInterval(v.date, this.props.goal.interval)}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>

                </div>
            });
        }else{
            for(let i=0; i<3; i++){
                completionList.push(
                    <div className={styles.listItem} key={i}>
                        <Skeleton variant="rect" animation="wave" height={77} />
                    </div>
                )
            }
        }
        
        return (
            <div>
                <Typography>
                    You are looking at the completions of:
                </Typography>
                <div className={styles.goalContainer}>
                    <GoalDataInner goal={this.props.goal} />
                </div>


                {completionList.length == 0 && <Typography>
                    You've not made any completions yet.
                </Typography>}
                <div className={styles.list}>
                    {completionList}
                </div>
                <div className={styles.actionButtonList}>
                    <div className={styles.actionButton}>
                        <Button variant="contained" color="primary" onClick={() => {
                            this.props.history.push("/completion/" + this.props.goal.url64 + "/" + String((new Date()).getTime()))
                        }}>Add</Button>
                    </div>

                    <div className={styles.actionButton}>
                        <Button variant="outlined" color="primary" onClick={() => {
                            this.props.history.push("/edit/" + this.props.goal.url64)
                        }}>Edit</Button>
                    </div>
                </div>
            </div>
        )
    }
};

export default withRouter(CompletionList);