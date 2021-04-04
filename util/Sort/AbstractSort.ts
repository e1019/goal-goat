
// A funtion which returns the value of A - B
type Comparison<T = {}> = (a: T, b: T) => number;

abstract class AbstractSort<T = {}> {
    private readonly comparison: Comparison<T>;
    constructor(comparison: Comparison<T>){
        this.comparison = comparison;
    }

    public compare(a: T, b: T): boolean{
        return this.comparison(a, b) > 0;
    }

    public abstract sort(completions: T[]): T[];
};

export default AbstractSort;
export type {Comparison};




