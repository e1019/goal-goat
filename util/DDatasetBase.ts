
import {
    addDatetime,
    addStringNoLocale,
    addUrl,
    asUrl,
    createSolidDataset,
    createThing,
    deleteSolidDataset,
    getDatetime,
    getSolidDataset,
    getSourceUrl,
    getStringNoLocale,
    getThing,
    getThingAll,
    getUrl,
    isThing,
    removeThing,
    saveSolidDatasetAt,
    setThing,
    setUrl,
    SolidDataset,
    Thing,
    Url,
    WithChangeLog
} from "@inrupt/solid-client";

import { Session } from "@inrupt/solid-client-authn-browser";
import { DGoal, HabitNS } from "./DGoal";
import { getPodUri, NS, getOrCreateDataset } from "./SolidUtil";
import Callable from "./Callable";
import Mutex from "./Mutex";

type ThingID = string | Url;

// static caching
type Cache = any;

abstract class DDatasetBase {
    private _indexUri: string;
    private _containerUri: string;
    private _session: Session = null;

    public get indexUri() { return this._indexUri; }
    public get containerUri() { return this._containerUri; }

    private dataset: SolidDataset = null;
    public get ready() {
        return this.dataset != null;
    }
    private opts = {};

    private syncMutex: Mutex = new Mutex();
    private onSyncCallbacks: Callable[] = [];

    protected cache: Cache;

    private callSyncCallbacks() {
        this.onSyncCallbacks.forEach((c) => {
            c.call();
        });
        this.cache = null;
    }

    public addListener(listener: Callable){
        this.onSyncCallbacks.push(listener);
    }

    public deleteListener(listener: Callable){
        const idx = this.onSyncCallbacks.indexOf(listener);
        if(idx >= 0) delete this.onSyncCallbacks[idx];
    }

    protected async deleteSelf(){
        await deleteSolidDataset(this._indexUri, this.opts);
        this.dataset = null;
    }

    private async fetchDataset() {
        return await getOrCreateDataset(this._indexUri, this.opts);
    }

    private async initializeDataset() {
        this.dataset = await this.fetchDataset();
        this.callSyncCallbacks();
    }

    private async synchronizeDataset(changes: SolidDataset & WithChangeLog) {
        const unlock = await this.syncMutex.lock();
        try {
            this.dataset = await saveSolidDatasetAt(this._indexUri, changes, this.opts);
        } finally {
            unlock();
            this.dataset = await this.fetchDataset();
        }
    }

    private setSession(session: Session){
        if(this._session) throw new Error("Attempted to set a session of a DDatasetBase that already has a session");

        this._session = session;
        this.opts = { fetch: session.fetch };
        this.initializeDataset();
    }
    

    
    constructor(indexUri: string, containerUri: string, session?: Session) {
        this._indexUri = indexUri;
        this._containerUri = containerUri;

        if(session){
            this.setSession(session);
        }
    }

    protected getThing(id: ThingID): Thing {
        if(!this.dataset) return null;
        return getThing(this.dataset, id);
    }

    protected getAllThings(): Thing[] {
        if(!this.dataset){
            console.log("Dataset is nonexistent");
            return null;
        }

        return getThingAll(this.dataset);
    }

    protected async insertThing(thing: Thing) {
        if(!this.dataset) throw new Error("Dataset is not yet ready");
        const changes = setThing(this.dataset, thing);

        await this.synchronizeDataset(changes);
        this.callSyncCallbacks();
    }


    protected async removeThing(id: ThingID);
    protected async removeThing(thing: Thing);
    protected async removeThing(val: any) {
        if(!this.dataset) throw new Error("Dataset is not yet ready");
        
        const thing = (isThing(val)) ? val : this.getThing(val);
        if(!thing){
            throw new Error("removeThing with null thing");
        }

        const changes = removeThing(this.dataset, thing);
        
        await this.synchronizeDataset(changes);
        this.callSyncCallbacks();
    }

    public static cloneSession(from: DDatasetBase, to: DDatasetBase){
        to.setSession(from._session);
    }
}


export default DDatasetBase;