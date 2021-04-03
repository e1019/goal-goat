import { getInteger, Thing } from "@inrupt/solid-client";

import { CompletionType } from "../GoalFormat";

import DAbstractCompletion from "./DAbstractCompletion";

import DBooleanCompletion from "./DBooleanCompletion";
import DFloatCompletion from "./DFloatCompletion";
import DIntegerCompletion from "./DIntegerCompletion";

const CompletionNS = {
    TYPE: "https://example.com/completion#type",
    CTYPE: "https://example.com/completion#ctype",
    VALUE: "https://example.com/completion#value",
    DATE: "https://example.com/completion#date"
};

function getClassFromType(type: CompletionType){
    switch(type){
        case CompletionType.BOOLEAN:
            return DBooleanCompletion;

        case CompletionType.INTEGER:
            return DIntegerCompletion;

        case CompletionType.FLOAT:
            return DFloatCompletion;
        
        default:
            return null;
    }
}

function createCompletionFromThing(thing: Thing): DAbstractCompletion {
    const c_type: CompletionType = getInteger(thing, CompletionNS.CTYPE);
    return getClassFromType(c_type).fromThing(thing);
}

function createCompletionOfType(type: CompletionType, date: Date = new Date()) : DAbstractCompletion{
    const T = getClassFromType(type);
    
    return new T(date);
}

export { createCompletionFromThing, CompletionNS, createCompletionOfType };