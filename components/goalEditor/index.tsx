import { Button, CircularProgress, FormControl, Input, InputLabel, MenuItem, Select, TextField, Typography } from "@material-ui/core";
import React from "react";
import { DGoal } from "../../util/DGoal";
import DGoalList from "../../util/DGoalList";

import { goalCategoryData, EnumInfo, goalIntervalData, completionTypeData } from "../../util/GoalFormat"

type GoalEditorProps = {
    goal?: DGoal;
    goalList?: DGoalList;
    history: History;
};

import { withRouter, History } from "react-router-dom";

import styles from "./editor.module.css";

type GoalEditorState = {
    goal: DGoal;
    isNew: boolean;
    isWaiting: boolean;
};

class GoalEditor extends React.Component<GoalEditorProps, GoalEditorState> {
    constructor(props) {
        super(props);

        if (props.goal == null && props.goalList == null) {
            throw new Error("A goal or a goal list must be provided to GoalEditor");
        }

        const goal: DGoal = (props.goal == null) ? (new DGoal({ name: "New goal", goalList: this.props.goalList })) : props.goal;

        this.state = ({
            goal,
            isNew: props.goal == null,
            isWaiting: false
        });

        this.exit = this.exit.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
        this.delete = this.delete.bind(this);
    }

    exit() {
        this.state.goal.revert();
        this.props.history.goBack();
    }

    async saveChanges() {
        this.setState({ isWaiting: true });
        await this.state.goal.push();
        this.exit();

        this.setState({ isWaiting: false, isNew: false });
    }

    async delete() {
        this.setState({ isWaiting: true });
        await this.state.goal.delete();
        this.props.history.push("/goals");

        this.setState({ isWaiting: false });
    }

    private constructMenuItemsFromEnum(en: { [n: number]: EnumInfo }) {
        let numsArray = Object.keys(en);
        let valsArray = Object.values(en);

        let menuItems = [];

        let i = 0;
        for (const k in numsArray) {
            menuItems.push((
                <MenuItem value={k} key={k}>{valsArray[i++].friendly_name}</MenuItem>
            ));
        }

        return menuItems;
    }

    render() {

        const saveText = this.state.isNew ? "Create" : "Save";
        const sub = this.state.isNew ? null : (<div className={styles.editorItem}>
            <Typography color="textSecondary" variant="subtitle1">
                Added: {this.state.goal.created_relative}
            </Typography>
        </div>);

        const canSave = !this.state.goal.dirty || this.state.isWaiting;

        let completionTypeEditor = null;
        if(true || this.state.isNew){
            completionTypeEditor = (
                <div className={`${styles.editorItem}`}>
                    <FormControl>
                        <InputLabel id="category-label">Type</InputLabel>
                        <Select disabled={!this.state.isNew} labelId="category-label" value={this.state.goal.completionType} onChange={(event) => {
                            this.state.goal.completionType = Number(event.target.value);
                            this.forceUpdate();
                        }} >
                            {this.constructMenuItemsFromEnum(completionTypeData)}
                        </Select>
                    </FormControl>
                </div>
            );
        }

        return (
            <div className={styles.parDiv}>
                <Typography>
                    {this.state.isNew ?
                        "You are creating a new goal:"
                    :   "You are editing an existing goal:"    
                    }
                </Typography>

                <div className={styles.editorItem}>
                    <TextField label="Name" type="text" value={this.state.goal.name} onChange={(event) => {
                        this.state.goal.name = event.target.value
                        this.forceUpdate();
                    }} />
                </div>
                <div className={styles.editorItem}>
                    <FormControl>
                        <InputLabel id="interval-label">Interval</InputLabel>
                        <Select labelId="interval-label" value={this.state.goal.interval} onChange={(event) => {
                            this.state.goal.interval = Number(event.target.value);
                            this.forceUpdate();
                        }} >
                            {this.constructMenuItemsFromEnum(goalIntervalData)}
                        </Select>
                    </FormControl>
                </div>


                <div className={`${styles.editorItem} ${styles.editorItemWithIcon}`}>
                    <FormControl>
                        <InputLabel id="category-label">Category</InputLabel>
                        <Select labelId="category-label" value={this.state.goal.category} onChange={(event) => {
                            this.state.goal.category = Number(event.target.value);
                            this.forceUpdate();
                        }} >
                            {this.constructMenuItemsFromEnum(goalCategoryData)}
                        </Select>
                    </FormControl>

                    <div className={styles.categoryImageInner}>
                        {goalCategoryData[this.state.goal.category].icon}
                    </div>
                </div>

                { completionTypeEditor }

                <div className={`${styles.actionButtonList}`}>
                    <div className={styles.actionButton}>
                        <Button disabled={canSave} onClick={this.saveChanges} color="primary" variant="contained">{saveText}</Button>
                    </div>
                    
                    <div className={styles.actionButton}>
                        <Button onClick={this.exit} disabled={this.state.isWaiting} variant="outlined" >Cancel</Button>
                    </div>
                    

                    {(!this.state.isNew) && <div className={styles.actionButton}>
                        <Button onClick={this.delete} disabled={this.state.isWaiting} variant="outlined" color="secondary">Delete</Button>
                    </div>}
                </div>
                <div className={styles.editorItem}>
                    <Typography color="textSecondary">
                        {(this.state.goal.dirty && !this.state.isNew && !this.state.isWaiting) && <i>Unsaved changes have been made, please click Save to save.</i>}
                    </Typography>
                    {(this.state.isWaiting) && <CircularProgress />}
                </div>
                {sub}
            </div>
        )
    }
};



export default withRouter(GoalEditor);