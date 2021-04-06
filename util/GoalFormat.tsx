// This file defines the data format of a goal.

import React from "react";

import { Fastfood, Favorite, RecordVoiceOver, School, SportsFootball, Straighten, Work } from "@material-ui/icons";

import { format } from "date-fns";
import "datejs";

const HabitNS = {
    TYPE: "https://example.com/habit#type",

    NAME: "https://example.com/habit#name",
    CREATED: "https://example.com/habit#created",

    INTERVAL: "https://example.com/habit#interval",
    CATEGORY: "https://example.com/habit#category", 
    COMPLETIONTYPE: "https://example.com/habit#completion_type",

    COMPLETIONDATASET: "https://example.com/habit#dataset_name"
};

type EnumInfo = {
    friendly_name: string;
};

type EnumMetadata<T extends number, U> = {
    [K in T]: U;
};

enum GoalInterval {
    DAY = 0,
    WEEK,
    MONTH
};

type GoalIntervalInfo = EnumInfo & {
    intervalTime: number; // should equal the minimum time in ms that the interval can last
    roundDateToInterval: (date: Date) => Date; // rounds a date to the interval
    incrementDate: (date: Date, diff: number) => Date;
    
    // converts a number of days/weeks/months to something like "today" (diff=0), "3 days ago" (diff=3), "yesterday", (diff=1)
    // `diff` is the number of `intervalTime`s between `date` and the comparison date
    // if `diff` is large, it would be more human-readable to say "November 1995" rather than "112 months ago", but this is at the discretion of the function
    convertToHumanReadable: (diff: number, date: Date) => string; 
};

const MS2DAY = 1000 * 3600 * 24;
const goalIntervalData: EnumMetadata<GoalInterval, GoalIntervalInfo> = {
    [GoalInterval.DAY]: {
        friendly_name: "Daily",
        intervalTime: MS2DAY * 1,
        roundDateToInterval: (date: Date) => { return new Date(date.getFullYear(), date.getMonth(), date.getDate());  },
        incrementDate: (date: Date, diff: number) => {
            return date.addDays(diff);
        },
        convertToHumanReadable: (diff: number, date: Date) => {
            if(diff == 0) return "today";
            if(diff == 1) return "yesterday";
            if(diff < 7) return String(diff) + " days ago";

            return format(date, "MMMM d, y");
        }
    },

    [GoalInterval.WEEK]: {
        friendly_name: "Weekly",
        intervalTime: MS2DAY * 7,
        roundDateToInterval: (date: Date) => { return new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay());  },
        incrementDate: (date: Date, diff: number) => {
            return date.addWeeks(diff);
        },
        convertToHumanReadable: (diff: number, date: Date) => {
            if(diff == 0) return "this week";
            if(diff == 1) return "last week";
            if(diff < 7) return String(diff) + " weeks ago";

            const firstDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay());
            const lastDay = (new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay())).addDays(6);

            let firstDayFormat = `${firstDay.getDate()}`;
            let lastDayFormat = `${lastDay.getDate()}`;

            const currYear = (new Date()).getFullYear();


            if(firstDay.getMonth() != lastDay.getMonth()){
                lastDayFormat = format(lastDay, "MMMM ") + lastDayFormat;
            }

            firstDayFormat = format(firstDay, "MMMM ") + firstDayFormat;


            if(firstDay.getFullYear() != lastDay.getFullYear()){
                firstDayFormat = format(firstDay, "y ") + firstDayFormat;
                lastDayFormat = format(lastDay, "y ") + lastDayFormat;
            }else if(currYear != lastDay.getFullYear()){
                lastDayFormat = lastDayFormat + ", " + format(lastDay, "y");
            }

            return "the week of " + firstDayFormat + " - " + lastDayFormat;
        }
    },

    [GoalInterval.MONTH]: {
        friendly_name: "Monthly",
        intervalTime: MS2DAY * 28,
        roundDateToInterval: (date: Date) => { return new Date(date.getFullYear(), date.getMonth(), 1);  },
        incrementDate: (date: Date, diff: number) => {
            return date.addMonths(diff);
        },
        convertToHumanReadable: (diff: number, date: Date) => {
            if(diff == 0) return "this month";
            if(diff == 1) return "last month";
            if(diff < 4) return String(diff) + " months ago";

            return format(date, "MMMM y");
        }
    }
};


enum GoalCategory {
    HEALTH = 0,
    DIET,
    SPORTS,
    STUDY,
    CAREER,
    HOBBY,
    GENERAL
};

type GoalCategoryInfo = EnumInfo & {
    icon: JSX.Element;
};


const goalCategoryData: EnumMetadata<GoalCategory, GoalCategoryInfo> = {
    [GoalCategory.HEALTH]: {friendly_name: "Health", icon: (<Favorite />)},
    [GoalCategory.DIET]: {friendly_name: "Diet", icon: (<Fastfood />)},
    [GoalCategory.SPORTS]: {friendly_name: "Sports", icon: (<SportsFootball />)},
    [GoalCategory.STUDY]: {friendly_name: "Study", icon: (<School />)},
    [GoalCategory.CAREER]: {friendly_name: "Career", icon: (<Work />)},
    [GoalCategory.HOBBY]: {friendly_name: "Hobby", icon: (<Straighten />)},
    [GoalCategory.GENERAL]: {friendly_name: "General", icon: (<RecordVoiceOver />)}
}



enum CompletionType {
    BOOLEAN,
    INTEGER,
    FLOAT
};

type CompletionTypeInfo = EnumInfo & {};

const completionTypeData: EnumMetadata<CompletionType, CompletionTypeInfo> = {
    [CompletionType.BOOLEAN]: {friendly_name: "Yes/No"},
    [CompletionType.INTEGER]: {friendly_name: "Numerical"},
    [CompletionType.FLOAT]: {friendly_name: "Decimal"}
};


export {
    HabitNS, GoalInterval, GoalCategory, goalIntervalData, goalCategoryData, CompletionType, completionTypeData
};

export type { GoalIntervalInfo, EnumInfo, CompletionTypeInfo };
