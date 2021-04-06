// This class provides a sorted list. The sorted contents can either be accessed, or a binary search could be done.

import QuickSort from "./QuickSort";
import AbstractSort, { Comparison } from "./AbstractSort";


const SORTING_ALGORITHM = QuickSort;


// return A - B
type SearchComparison<T = {}, N = {}> = (a: T, b: N) => number;

class SortedList<T = {}> {
    private _list: T[];

    public get list(){ return [...this._list]; } // prevent writing to this._list

    public get length(): number {
        return this._list.length;
    }

    public get empty(): boolean {
        return this.length == 0;
    }

    public get(idx: number){
        if(idx < 0 || idx >= this.length) throw new Error(`Index ${idx} is out of bounds [0 .. ${this.length})`);
        return this._list[idx];
    }

    constructor(unsortedList: T[], comparison: Comparison<T>){
        const sorter: AbstractSort<T> = new SORTING_ALGORITHM<T>(comparison);
        this._list = sorter.sort([...unsortedList]);
    }

    // Binary search
    public searchIdx<N = {}>(x: N, searchComparison: SearchComparison<T, N>): number {
        if(this.empty) return null;

        let low = 0;
        let high = this.length - 1;

        while(low <= high){
            const m = low + ~~((high - low) / 2);
            
            const diff = -searchComparison(this.get(m), x);

            if(diff == 0) return m;
            if(diff < 0) low = m + 1; else high = m - 1;
        }

        return null;
    }

    public search<N = {}>(x: N, searchComparison: SearchComparison<T, N>): T {
        if(this.empty) return null;

        const idx = this.searchIdx(x, searchComparison);
        if(idx != null) return this.get(idx); else return null;
    }
}

export default SortedList;





