// This is the navigation bar class that contains the navigation buttons

import React from "react";
import { Add, Home, List, Person, Timeline } from "@material-ui/icons";

import NavigationButton from "./navigationButton";

import styles from "../app.module.css";

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
        );
    }
};

export default Navigation;