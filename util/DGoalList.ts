import { Session } from "@inrupt/solid-client-authn-browser";
import { DGoal } from "./DGoal";
import { getPodUri } from "./SolidUtil";
import DDatasetBase from "./DDatasetBase";
import Callable from "./Callable";
import HashMap, { StringHasher } from "./Map/HashMap";

const INDEX_FILE = "index.ttl";

type GoalCache = {
    normalList: DGoal[];
    urlToGoal: HashMap<string, DGoal>;
}

class DGoalList extends DDatasetBase {
    protected cache: GoalCache;

    constructor(containerUri: string, session: Session) {
        super(`${containerUri}${INDEX_FILE}`, containerUri, session);
        this.cache = null;;
    }


    public async deleteGoal(goal: DGoal){
        await this.removeThing(goal.thing);
    }

    public async insertGoal(goal: DGoal){
        await this.insertThing(goal.thing);
    }

    public getGoals() : DGoal[]{
        if(!this.ready) return null;
        
        if(this.cache == null || this.cache.normalList == null){
            const things = this.getAllThings();

            const goalsArray = things.filter((thing) => DGoal.isThingValid(thing));
            const goalData = goalsArray.map((thing) => DGoal.fromThing(thing, this));
    
            this.cache = {
                normalList: goalData,
                urlToGoal: this.cache && this.cache.urlToGoal
            };

            return goalData;
        }

        return this.cache.normalList;
    }

    private findGoalInList(url: string): DGoal {
        const goalsList = this.getGoals();

        for(const v of goalsList){
            if(v.url == url){
                return v;
            }
        }

        return null;
    }

    public getGoal(url: string) : DGoal {
        if(!this.ready) return null;
        
        if(this.cache == null || this.cache.urlToGoal == null){
            this.getGoals(); // ensure cache and normalList are at least initialized
            this.cache.urlToGoal = new HashMap<string, DGoal>(StringHasher);
        }

        const val = this.cache.urlToGoal.get(url);
        if(val){
            console.log("Cached map",url);
            return val;
        }else{
            const goal = this.findGoalInList(url);
            if(!goal) return null;
            
            console.log("Insert to cache",url)
            this.cache.urlToGoal.insert(url, goal);
            return goal;
        }
    }


    // Factory method to generate DGoalList from a Session
    static async fromSession(session: Session): Promise<DGoalList> {
        const pod: string = await getPodUri(session);
        const containerUri: string = `${pod}goals/`;

        return new DGoalList(containerUri, session);
    }
}


export default DGoalList;