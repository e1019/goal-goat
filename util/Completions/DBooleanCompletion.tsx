import { getBoolean, getDatetime, setBoolean, setInteger, Thing } from "@inrupt/solid-client";
import DCompletionHistory from "./DCompletionHistory";
import { CompletionType, GoalInterval } from "../GoalFormat";
import { CompletionNS } from "./CompletionUtil";
import DAbstractCompletion, {EditorLayout} from "./DAbstractCompletion";
import { Button, Link, Typography } from "@material-ui/core";
import React from "react";
import Callable from "../Callable";
import relativeDate from 'tiny-relative-date';

import styles from "./completioneditingstyles.module.css"

class DBooleanCompletion extends DAbstractCompletion {
    public getType() {
        return CompletionType.BOOLEAN;
    }

    public getAsString() {
        const val = getBoolean(this.thing, CompletionNS.VALUE);
        if(val == null) return ""
        return val ? "Yes" : "No";
    }

    public setValueFromString(s: string) {
        switch (s.toLowerCase()) {
            case "yes":
            case "true":
                this.thing = setBoolean(this.thing, CompletionNS.VALUE, true);
                return true;

            case "no":
            case "false":
                this.thing = setBoolean(this.thing, CompletionNS.VALUE, false);
                return true;

            default:
                return false;
        }
    }

    public static fromThing(t: Thing) {
        return new DBooleanCompletion(
            getDatetime(t, CompletionNS.DATE),
            null,
            t
        );
    }

    public getEditor(onUpdate: Callable, interval: GoalInterval): EditorLayout {
        const genClickFunc = (txt) => {
            return () => {
                this.setValueFromString(txt);
                onUpdate.call();
            }
        }

        const genButton = (txt) => {
            const eq = this.getAsString() === txt;
            return <div className={styles.button}><Button 
                variant={eq ? "contained" : "outlined"}
                onClick={genClickFunc(txt)}
                disabled={eq}
            >{txt}</Button></div>;
        }

        const editorElement = (
            <div className={styles.buttonContainer}>
                {genButton("Yes")}
                {genButton("No")}
            </div>
        );

        return {titleText: "Did you complete this goal", editorElement}
    }
};

export default DBooleanCompletion;