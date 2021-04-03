import { Button, CircularProgress, Dialog, DialogTitle, Link, Typography } from "@material-ui/core";
import React from "react";
import Callable from "../../util/Callable";
import DAbstractCompletion from "../../util/Completions/DAbstractCompletion";
import DCompletionHistory from "../../util/Completions/DCompletionHistory";
import { DGoal } from "../../util/DGoal";
import DatePickerDialog from "../dialogs/datePicker"

import { withRouter, History } from "react-router-dom";

import GoalDataInner from "../goalView/goalDataInner"

import styles from "./completionEditor.module.css"
import GoalView, { GoalViewMode } from "../goalView";

type CompletionEditorProps = {
    goal: DGoal;
    date: Date;
    history: History;
};

type CompletionEditorState = {
    completion: DAbstractCompletion;
    callable: Callable;
    loading: boolean;
    pickingDate: boolean;
    date: Date;
    update: Callable;
};

class CompletionEditor extends React.Component<CompletionEditorProps, CompletionEditorState> {
    constructor(props) {
        super(props);
        this.state = {
            completion: null,
            callable: new Callable(this, this.onChanged),
            loading: false,
            pickingDate: false,
            date: props.date,
            update: new Callable(this, this.onRerender)
        };

        this.props.goal.completionHistory.addListener(this.state.callable);
        this.delete = this.delete.bind(this);
    }

    componentDidMount(){
        this.onChanged();
    }


    componentWillUnmount() {
        this.props.goal.completionHistory.deleteListener(this.state.callable);
    }

    public onChanged(date: Date = this.state.date) {
        this.setState({
            completion: this.props.goal.completionHistory.getDateCompletion(date)
        });
    }

    public onRerender() {
        this.forceUpdate();
    }

    private exit(){
        this.props.history.goBack();
    }

    private async onApply() {
        this.setState({ loading: true });
        await this.props.goal.completionHistory.insertCompletion(this.state.completion);
        this.exit();
        this.setState({ loading: false });
    }

    private async delete(){
        this.setState({ loading: true });
        await this.props.goal.completionHistory.removeCompletion(this.state.completion);
        this.exit();
        this.setState({ loading: false });
    }

    render() {
        if (this.state.completion == null || this.state.loading) {
            return <CircularProgress />
        }

        const element = this.state.completion.getEditor(this.state.update, this.props.goal.interval);
        return (
            <div>
                <Typography>
                    {element.titleText + " "}
                    <Link onClick={() => { this.setState({ pickingDate: true }) }}>
                        {DCompletionHistory.relativeDateForInterval(this.state.date, this.props.goal.interval)}
                    </Link>
                    ?
                </Typography>
                
                
                <div className={styles.goalContainer} >
                    <GoalDataInner goal={this.props.goal} />
                </div>

                <DatePickerDialog open={this.state.pickingDate} initialDate={this.state.date} onClose={(date) => {
                    this.setState({date: date, pickingDate: false});
                    this.onChanged(date);
                }} onlyPast={true} />
                
                
                {element.editorElement}
                    
                <div className={styles.innerArea}>
                    <Button disabled={this.state.completion.getAsString().length <= 0} variant="contained" color="primary" onClick={() => { this.onApply() }}>Apply</Button>
                </div>


                    <Typography color="textSecondary" variant="subtitle1">
                    {
                        this.state.completion.new ?
                                <i>You are creating a new completion.</i>
                        : <i>You are modifying an existing completion, which you may <Link onClick={this.delete}>delete</Link>.</i>

                    }

                        {" "}
                        <Link onClick={() => {
                            this.props.history.push(GoalView.getRedirectUrl(GoalViewMode.RedirectToEdit, this.props.goal))
                        }} >{"View all completions"}</Link>.

                    </Typography>
            </div>
        )
    }
};

export default withRouter(CompletionEditor);