import { Button, Card, CardActionArea, CardContent, Typography } from "@material-ui/core";
import React from "react";
import { DGoal } from "../../util/DGoal";
import DGoalList from "../../util/DGoalList";

import { withRouter, History } from "react-router-dom";


import GoalDataInner from "./goalDataInner";

enum GoalViewMode {
    RedirectToAddCompletion,
    RedirectToEdit
};

type GoalViewProps = {
    goal: DGoal;
    history: History;
    mode: GoalViewMode;
    extraText?: string;
    className: string;
};

type GoalViewState = {
};

class GoalView extends React.Component<GoalViewProps, GoalViewState> {
    constructor(props) {
        super(props);
    }
    // TODO: 15 hours remaining, etc

    private static getRedirectUrl(mode: GoalViewMode, goal: DGoal): string {
        switch (mode) {
            case GoalViewMode.RedirectToEdit:
                return "/completion/" + goal.url64 + "/" + "list";

            case GoalViewMode.RedirectToAddCompletion:
                return "/completion/" + goal.url64 + "/" + (new Date()).getTime();
        }
    }

    render() {
        return (
            <div className={this.props.className}>
                <Card>
                    <CardActionArea onClick={() => { this.props.history.push(GoalView.getRedirectUrl(this.props.mode, this.props.goal)) }}>
                        <CardContent>
                            <GoalDataInner goal={this.props.goal} extraText={this.props.extraText} />
                        </CardContent>
                    </CardActionArea>
                </Card>
            </div>
        )
    }
};



export default withRouter(GoalView);
export { GoalViewMode };
export type { GoalViewProps }