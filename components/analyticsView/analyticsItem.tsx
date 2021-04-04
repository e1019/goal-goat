import React from "react";

import { CircularProgress, Typography } from "@material-ui/core";

import DCompletionHistory from "../../util/Completions/DCompletionHistory";
import GoalView, { GoalViewMode } from "../goalView";
import SortedList from "../../util/Sort/SortedList";

import styles from "../list.module.css";

type AnalyticsItemProps = {
    list: SortedList<DCompletionHistory>;
    itemsToShow: number;
    headerText: string;

    getExtraText: (v: DCompletionHistory) => string;
}

class AnalyticsItem extends React.Component<AnalyticsItemProps> {
    render() {
        if(this.props.list == null) return <CircularProgress />;

        const list = [];
        for(let i=0; i<Math.min(this.props.itemsToShow, this.props.list.length); i++){
            const v = this.props.list.get(i);
            const txt = this.props.getExtraText(v);
            if(!txt) continue;
            list.push(
                <div key={i}>
                    <GoalView goal={v.parentGoal} mode={GoalViewMode.RedirectToEdit}
                        className={styles.listItem} extraText={txt} />
                </div>
            );
        }

        if(list.length == 0) return null;

        return <div className={styles.listItem}>
            <Typography variant="h6">
                {this.props.headerText}
            </Typography>
            {list}
        </div>;
    }
};

export default AnalyticsItem;