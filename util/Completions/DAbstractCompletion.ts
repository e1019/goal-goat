import { asUrl, createThing, getUrl, setDatetime, setInteger, setUrl, Thing } from "@inrupt/solid-client";

import { CompletionType, GoalInterval } from "../GoalFormat";
import { CompletionNS } from "./CompletionUtil";
import Callable from "../Callable";
import { NS } from "../SolidUtil";

type EditorLayout = {
    titleText: string,
    editorElement: JSX.Element
};

abstract class DAbstractCompletion {
    private new_: boolean;
    public get new() { return this.new_; }
    public set new(to: boolean) {
        if(to){
            throw new Error("You may not mark an abstract completion as new!");
        }
        this.new_ = false;
    }

    protected thing: Thing;

    public get pThing() {
        return this.thing;
    }

    public get url(){
        return asUrl(this.thing, "");
    }

    public abstract getType(): CompletionType;

    public readonly date: Date;

    constructor(date: Date, val?: string, thing?: Thing){
        if(thing) {
            this.thing = thing;
            this.new_ = false;
        }else{
            this.thing = createThing();
            this.thing = setDatetime(this.thing, CompletionNS.DATE, date);
            this.thing = setUrl(this.thing, NS.TYPE, CompletionNS.TYPE);
            this.thing = setInteger(this.thing, CompletionNS.CTYPE, this.getType());
            this.new_ = true;
        }
        
        this.date = date;

        if(val) this.setValueFromString(val);
    }

    // Get the value as human-readable string (Yes, No, 59, 5.382, etc)
    public abstract getAsString(): string;

    // Set the value from a string. Return true if it was valid.
    public abstract setValueFromString(val: string): boolean;

    public static isThingValid(thing: Thing): boolean {
        return getUrl(thing, NS.TYPE) === CompletionNS.TYPE;
    }

    public abstract getEditor(onUpdate: Callable): EditorLayout;
};

const compareCompletions = (a: DAbstractCompletion, b: DAbstractCompletion): number => {
    return a.date.getTime() - b.date.getTime();
};

export default DAbstractCompletion;
export { compareCompletions };
export type {EditorLayout};