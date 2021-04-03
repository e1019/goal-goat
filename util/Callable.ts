class Callable {
    public readonly object: Object;
    public readonly func: () => void;

    constructor(object: Object, func: () => void){
        this.object = object;
        this.func = func;
    }

    public call(...args){
        return this.func.call(this.object, ...args);
    }
}

export default Callable;