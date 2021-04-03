import AbstractSort from "./AbstractSort";

class QuickSort<T = {}> extends AbstractSort<T> {
    private array: T[];

    private partition(start: number, end: number){
        let pivot = this.array[end];
        let i = start - 1;

        for(let j = start; j <= end - 1; j++){
            if(this.compare(this.array[j], pivot)){
                i++;
                [this.array[i], this.array[j]] = [this.array[j], this.array[i]];
            }
        }

        [this.array[i + 1], this.array[end]] = [this.array[end], this.array[i + 1]];

        return(i + 1);
    }

    private quickSort(start: number, end: number){
        if(start < end){
            const partitionIndex = this.partition(start, end);

            this.quickSort(start, partitionIndex - 1);
            this.quickSort(partitionIndex + 1, end);
        }
    }

    public sort(completions: T[]): T[] {
        this.array = completions;
        this.quickSort(0, completions.length - 1);

        return this.array;
    }
};

export default QuickSort;


