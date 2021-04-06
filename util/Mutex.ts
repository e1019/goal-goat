// Mutex class for safer asynchronous operation
// Adapted from https://spin.atomicobject.com/2018/09/10/javascript-concurrency/

class Mutex {
    private mutex = Promise.resolve();

    lock(): PromiseLike<() => void> {
        let begin: (unlock: () => void) => void = unlock => { };

        this.mutex = this.mutex.then(() => {
            return new Promise(begin);
        });

        return new Promise(res => {
            begin = res;
        });
    }
}

export default Mutex;