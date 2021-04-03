import Node from "./Node";

type Hasher<K = {}> = (key: K) => number;


// djb2, from http://www.cse.yorku.ca/~oz/hash.html
const StringHasher: Hasher<string> = (key: string): number => {
    let hash = 5381;

    for(let i=0; i<key.length; i++){
        const codePoint = key.codePointAt(i);
        hash = ((hash << 5) + hash) + codePoint;
    }

    return hash;
};

class HashEntry<K = {}, V = {}> extends Node {
    public readonly key: K;
    public readonly value: V;

    constructor(key: K, value: V){
        super();
        this.key = key;
        this.value = value;
    }
}

class HashMap<K = {}, V = {}> {
    private readonly size: number;
    private hasher: Hasher<K>;
    private internalMap: HashEntry<K, V>[];

    private hash(key: K){
        return ~~(this.hasher(key)) % this.size;
    }

    constructor(hashFunction: Hasher<K>, size: number = 64){
        this.hasher = hashFunction;
        this.size = size;

        this.internalMap = [];
        this.internalMap.length = size;
    }

    public get(key: K): V {
        const hash: number = this.hash(key);
        let val: HashEntry<K, V> = this.internalMap[hash];
        
        while(val){
            if(val.key == key) return val.value;
            val = val.nextNode as HashEntry<K, V>;
        }

        return null;
    }

    public insert(key: K, value: V){
        const hashEntry = new HashEntry(key, value);
        const hash: number = this.hash(key);
        
        const val = this.internalMap[hash];

        if(!val){
            this.internalMap[hash] = hashEntry;
            return;
        }

        const tail = val.getTail();
        tail.insert(hashEntry);
    }
};

export default HashMap;
export { StringHasher };