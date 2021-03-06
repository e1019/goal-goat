// Similar to a DGoalList, this deals with a specific goal and provides a list of all completion data in a given goal.
// However, it also allows searching by date and getting analytics.
// Each active DGoal has a DCompletionHistory.

import { createCompletionFromThing, createCompletionOfType } from "./CompletionUtil";
import DAbstractCompletion, { compareCompletions } from "./DAbstractCompletion";
import { GoalInterval, goalIntervalData } from "../GoalFormat";
import HashMap, { StringHasher } from "../Map/HashMap";
import DBooleanCompletion from "./DBooleanCompletion";
import SortedList from "../Sort/SortedList";
import DDatasetBase from "../DDatasetBase";
import { DGoal } from "../DGoal";

const FILE_SUFFIX = ".ch.ttl";

type CompletionAnalytics = {
    mean: number;
    standard_deviation: number;
    current_streak: number;
    current_no_streak: number;
    longest_streak: number;
    percentage: number;
    num_elements: number;
};

type CompletionCache = {
    normalList: DAbstractCompletion[];
    sorted: SortedList<DAbstractCompletion>;

    analytics: CompletionAnalytics;

    urlToCompletion: HashMap<string, DAbstractCompletion>;
};

class DCompletionHistory extends DDatasetBase {
    private _parentGoal: DGoal;
    public get parentGoal() { return this._parentGoal; }

    protected cache: CompletionCache;


    public get analytics(): CompletionAnalytics {
        if(this.cache && this.cache.analytics) return this.cache.analytics;

        const sortedCompletion = this.getSortedCompletions();
        

        const currAnalytics: CompletionAnalytics = {
            mean: 0,
            standard_deviation: 0,
            current_streak: 0,
            current_no_streak: 0,
            longest_streak: 0,
            percentage: 0,
            num_elements: 0
        };
        
        if(sortedCompletion == null) return currAnalytics;
        const completionAscending = sortedCompletion.list.reverse();

        { // calculate mean and standard deviation
            let numElements = 0;
            for(const completion of completionAscending){
                currAnalytics.num_elements += 1;
                const num = Number(completion.getAsString());
                if(isNaN(num)) continue;

                currAnalytics.mean += num;
                numElements++;
            }
            currAnalytics.mean /= numElements;

            for(const completion of completionAscending){
                const num = Number(completion.getAsString());
                if(isNaN(num)) continue;

                currAnalytics.standard_deviation += Math.pow(num - currAnalytics.mean, 2);
            }
            currAnalytics.standard_deviation = Math.sqrt(currAnalytics.standard_deviation / numElements);
        }


        { // calculate streaks, percentage
            let currentStreak = 0;
            let numElements = 0;
            let numYes = 0;
            for(const completion of completionAscending){
                if(completion instanceof DBooleanCompletion){
                    
                    
                    numElements++;

                    const val = completion.getAsString() === "Yes";
                    if(val) currentStreak++; else currentStreak = 0;
                    if(!val) currAnalytics.current_no_streak++; else currAnalytics.current_no_streak = 0;
                    if(val) numYes++;

                    currAnalytics.longest_streak = Math.max(currAnalytics.longest_streak, currentStreak);
                }
            }
            currAnalytics.current_streak = currentStreak;

            currAnalytics.percentage = (numYes)/(numElements);
        }

        this.cache.analytics = currAnalytics;
        return currAnalytics;
    }

    constructor(goal: DGoal, dataset_id: string) {
        const parentList = goal.associatedGoalList;
        
        const containerUri = parentList.containerUri;
        const indexUri = `${containerUri}${dataset_id}${FILE_SUFFIX}`;

        super(indexUri, containerUri);
        this._parentGoal = goal;

        DDatasetBase.cloneSession(parentList, this);
        this.cache = null;
    }

    public async delete(){
        await this.deleteSelf();   
    }

    public async insertCompletion(completion: DAbstractCompletion) {
        if(completion.getAsString().length < 1) return;
        await this.insertThing(completion.pThing);
        completion.new = false;
    }

    public async removeCompletion(completion: DAbstractCompletion) {
        await this.removeThing(completion.pThing);
    }

    public getCompletions(): DAbstractCompletion[] {
        if(!this.ready) return null;

        if(this.cache == null || this.cache.normalList == null){
            const things =  this.getAllThings();
            const validThings = things.filter((v) => DAbstractCompletion.isThingValid(v));
            const list = validThings.map((v) => createCompletionFromThing(v));

            this.cache = {
                normalList: list,
                sorted: null,
                analytics: this.cache && this.cache.analytics,
                urlToCompletion: this.cache && this.cache.urlToCompletion
            };

            return list;
        }

        return this.cache.normalList;
    }

    public getSortedCompletions(): SortedList<DAbstractCompletion> {
        if(!this.ready) return null;

        if(this.cache == null || this.cache.sorted == null){
            const sortedList = new SortedList<DAbstractCompletion>(this.getCompletions(), compareCompletions);
            this.cache = {
                normalList: this.cache.normalList,
                sorted: sortedList,
                analytics: this.cache && this.cache.analytics,
                urlToCompletion: this.cache && this.cache.urlToCompletion
            };

            return sortedList;
        }
        
        return this.cache.sorted;
    }

    private findCompletionInList(url: string): DAbstractCompletion {
        const completionList = this.getCompletions();

        for(const v of completionList){
            if(v.url == url){
                return v;
            }
        }

        return null;
    }

    public getCompletion(url: string) : DAbstractCompletion {
        if(!this.ready) return null;
        
        if(this.cache == null || this.cache.urlToCompletion == null){
            this.getCompletions(); // ensure cache and normalList are at least initialized
            this.cache.urlToCompletion = new HashMap<string, DAbstractCompletion>(StringHasher);
        }

        const val = this.cache.urlToCompletion.get(url);
        
        if(val) return val;

        const comp = this.findCompletionInList(url);
        if(!comp) return null;
            
        this.cache.urlToCompletion.insert(url, comp);
        return comp;
    }

    private getClosestCompletion(date: Date) : DAbstractCompletion {
        if(!this.ready) return null;

        const data = goalIntervalData[this._parentGoal.interval];
        const newDate = data.roundDateToInterval(date);


        const result = this.getSortedCompletions().search<Date>(
            newDate,
            (a: DAbstractCompletion, b: Date): number => {
                return data.roundDateToInterval(a.date).getTime() - b.getTime();
            }
        );

        return result;
    }

    public getDateCompletion(date: Date) : DAbstractCompletion {
        if(!this.ready) return null;
        
        const completion = this.getClosestCompletion(date);
        
        if(!completion){
            const newComp = createCompletionOfType(this._parentGoal.completionType, date);
            return newComp;
        }

        return completion;
    }

    public getCompletionTimeRemaining(){
        if(!this.ready) return null;

        const date = new Date();
        const data = goalIntervalData[this._parentGoal.interval];
        const newDate = data.roundDateToInterval(date);

        const result = this.getClosestCompletion(date);

        if(result) return null;

        const incrementedDate = data.incrementDate(newDate, 1);
        const timeRemaining = incrementedDate.getTime() - date.getTime();

        const secs = timeRemaining/1000;

        const minutes = Math.round(secs/60) % 60;
        const hours = Math.round(secs/60/60) % 60;
        const days = Math.round(secs/60/60/24);

        const pluralize = (s: string, num: number): string => {
            return (s) + ((num == 1) ? "" : "s");
        };

        if(days > 0) return `${days} ${pluralize("day", days)} remaining`;
        if(hours > 0) return `${hours} ${pluralize("hour", hours)} remaining`;
        if(minutes > 0) return `${minutes} ${pluralize("minute", minutes)} remaining`;
    }

    public static relativeDateForInterval(date: Date, interval: GoalInterval){
        const data = goalIntervalData[interval];
        const compDate = data.roundDateToInterval(date);
        const currDate = data.roundDateToInterval(new Date());

        const diff = (currDate.getTime() - compDate.getTime()) / data.intervalTime;

        return data.convertToHumanReadable(Math.round(diff), compDate);
    }
};

export default DCompletionHistory;