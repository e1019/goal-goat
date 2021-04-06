// This class extends DAbstractCompletion and provides a floating-point completion type

import React from "react";

import { getDatetime, getStringNoLocale, setStringNoLocale, Thing } from "@inrupt/solid-client";
import { TextField } from "@material-ui/core";

import DAbstractCompletion, {EditorLayout} from "./DAbstractCompletion";
import { CompletionNS } from "./CompletionUtil";
import { CompletionType } from "../GoalFormat";
import Callable from "../Callable";

import styles from "./completioneditingstyles.module.css";

class DFloatCompletion extends DAbstractCompletion {
    public getType() {
        return CompletionType.FLOAT;
    }

    public getAsString() {
        const val = getStringNoLocale(this.thing, CompletionNS.VALUE);
        if(val == null) return "";
        return val;
    }

    public setValueFromString(s: string) {
        const num = Number(s);
        if(isNaN(num)) return false;

        this.thing = setStringNoLocale(this.thing, CompletionNS.VALUE, String(num));
        return true;
    }

    public static fromThing(t: Thing) {
        return new DFloatCompletion(
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

export default DFloatCompletion;