import React from "react";
import { ButtonBase } from "@material-ui/core";
import { withRouter, History } from "react-router-dom";

import styles from "../app.module.css";



type NavigationButtonProps = {
    tgtUrl: string;
    icon: JSX.Element;
    history: History;
}
class NavigationButton extends React.Component<NavigationButtonProps> {
    render() {
        return <div className={styles.navButtonHolder}>
            <ButtonBase onClick={() => {this.props.history.push(this.props.tgtUrl);}}>
                <div className={styles.navButton}>
                    {this.props.icon}
                </div>
            </ButtonBase>
        </div>;
    }
}

export default withRouter(NavigationButton);