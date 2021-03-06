// This class extends DAbstractCompletion and provides an integer completion type

import React from "react";

import { getDatetime, getInteger, setInteger, Thing } from "@inrupt/solid-client";
import { TextField } from "@material-ui/core";

import DAbstractCompletion, {EditorLayout} from "./DAbstractCompletion";
import { CompletionNS } from "./CompletionUtil";
import { CompletionType } from "../GoalFormat";
import Callable from "../Callable";

import styles from "./completioneditingstyles.module.css";

class DIntegerCompletion extends DAbstractCompletion {
    public getType() {
        return CompletionType.INTEGER;
    }

    public getAsString() {
        const val = getInteger(this.thing, CompletionNS.VALUE);
        if(val == null) return "";
        return String(val);
    }

    public setValueFromString(s: string) {
        const num = Number(s);
        if(isNaN(num)) return false;

        this.thing = setInteger(this.thing, CompletionNS.VALUE, ~~(num));
        return true;
    }

    public static fromThing(t: Thing) {
        return new DIntegerCompletion(
            getDatetime(t, CompletionNS.DATE),
            null,
            t
        );
    }

    public getEditor(onUpdate: Callable): EditorLayout {
        const editorElement = (
            <div className={styles.buttonContainer}>
                <TextField type="number" onChange={(ev) => {
                    if(!this.setValueFromString(ev.target.value)) return;
                    onUpdate.call();
                }} value={this.getAsString()} />
            </div>
        );

        return {titleText: "How did you complete this goal", editorElement};
    }
};

export default DIntegerCompletion;