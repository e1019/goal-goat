import { 
    asUrl,
    createThing,

    setInteger,
    getInteger,
    
    setUrl,
    getUrl,
    
    getDatetime,
    setDatetime,
    
    setStringNoLocale,
    getStringNoLocale,
    
    Thing
} from "@inrupt/solid-client";

import crypto from "crypto";
import base64url from "base64url";
import relativeDate from "tiny-relative-date";

import { CompletionType, GoalCategory, GoalInterval, HabitNS } from "./GoalFormat";
import { NS, deleteAllInts } from "./SolidUtil";
import DGoalList from "./DGoalList";

import DCompletionHistory from "./Completions/DCompletionHistory";


type DGoalContents = {
    name: string,
    created?: Date,
    interval?: GoalInterval,
    category?: GoalCategory,
    completionType?: CompletionType,

    thing?: Thing,
    goalList?: DGoalList
};

class DGoal {
    private goalList: DGoalList;
    public associateTo(newGoalList: DGoalList){
        if(this.goalList == null){
            this.goalList = newGoalList;
        }else{
            throw new Error("Attempt to associate an already associated habit");
        }
    }

    public get associatedGoalList(){
        return this.goalList;
    }


    private contaminate(){
        this._dirty = (this.originalThing != this.associatedThing);
    }

    private _dirty = false;

    public get dirty(){
        return this._dirty;
    }

    private isNew: boolean;


    private _name: string;
    private _interval: GoalInterval;
    private _category: GoalCategory;
    private _completionType: CompletionType;

    private _completionDatasetName = "";
    private _completionHistory: DCompletionHistory;
    public get completionHistory(){
        return this._completionHistory;
    }

    //#region Getters and Setters
    public get name(){
        return this._name;
    }
    public set name(to: string){
        this._name = to;
        this.associatedThing = setStringNoLocale(this.associatedThing, HabitNS.NAME, to);

        this.contaminate();
    }

    public get created(){
        return getDatetime(this.associatedThing, HabitNS.CREATED);
    }

    public set created(to: Date){
        if(this.isNew || this.created == null){
            this.associatedThing = setDatetime(this.associatedThing, HabitNS.CREATED, to);
            this.contaminate();
        }
    }

    // human-readable
    public get created_relative(): string {
        return relativeDate(this.created);
    }


    public get interval(){
        return this._interval;
    }
    public set interval(to: GoalInterval){
        this._interval = to;
        this.associatedThing = setInteger(
            deleteAllInts(this.associatedThing, HabitNS.INTERVAL), HabitNS.INTERVAL, to);

        this.contaminate();
    }

    public get category(){
        return this._category;
    }
    public set category(to: GoalCategory){
        this._category = to;
        this.associatedThing = setInteger(
            deleteAllInts(this.associatedThing, HabitNS.CATEGORY), HabitNS.CATEGORY, to);

        this.contaminate();
    }

    public get completionType(){
        return this._completionType;
    }
    public set completionType(to: CompletionType){
        this._completionType = to;
        this.associatedThing = setInteger(
            deleteAllInts(this.associatedThing, HabitNS.COMPLETIONTYPE), HabitNS.COMPLETIONTYPE, to);

        this.contaminate();
    }

    //#endregion

    // Url to Thing
    public get url(){
        return asUrl(this.originalThing, "");
    }
    public get url64(){
        return base64url.encode(this.url);
    }

    private originalThing: Thing;
    private associatedThing: Thing;

    public get thing(){
        return this.associatedThing;
    }

    constructor(contents: DGoalContents){
        this.isNew = false;

        contents = DGoal.defaultizeGoalContents(contents);

        this.associatedThing = contents.thing;
        if(!this.associatedThing){
            // Generate a new thing
            this.associatedThing = createThing();
            this.associatedThing = setUrl(this.associatedThing, NS.TYPE, HabitNS.TYPE);
            this.isNew = true;
        }

        this.name = contents.name;
        this.created = contents.created;
        this.goalList = contents.goalList;
        this.interval = contents.interval;
        this.category = contents.category;
        this.completionType = contents.completionType;

        this.originalThing = this.associatedThing;

        this._dirty = this.isNew;

        if(!this.isNew){
            this._completionDatasetName = crypto.createHash("sha256").update(this.url).digest("hex");
            this._completionHistory = new DCompletionHistory(this, this._completionDatasetName);
        }
    }

    public async delete(){
        await this._completionHistory.delete();
        delete this._completionHistory;

        await this.goalList.deleteGoal(this);
    }

    public async push(){
        if(this.dirty){
            await this.goalList.insertGoal(this);
            this.originalThing = this.associatedThing;
        }
        this._dirty = false;
    }

    public revert(){
        this.associatedThing = this.originalThing;
        this._dirty = false;
    }

    public static isThingValid(thing: Thing): boolean {
        return getUrl(thing, NS.TYPE) === HabitNS.TYPE;
    }

    public static defaultizeGoalContents(contents: DGoalContents){
        contents.created = contents.created ?? new Date();
        contents.interval = contents.interval ?? GoalInterval.DAY;
        contents.category = contents.category ?? GoalCategory.GENERAL;
        contents.completionType = contents.completionType ?? CompletionType.BOOLEAN;

        return contents;
    }

    public static fromThing(thing: Thing, goalList: DGoalList){
        return new DGoal(
            {
                name: getStringNoLocale(thing, HabitNS.NAME),
                created: getDatetime(thing, HabitNS.CREATED),

                interval: getInteger(thing, HabitNS.INTERVAL),
                category: getInteger(thing, HabitNS.CATEGORY),

                completionType: getInteger(thing, HabitNS.COMPLETIONTYPE),

                thing: thing,
                goalList: goalList
            }
        );
    }
}

export { DGoal, HabitNS };