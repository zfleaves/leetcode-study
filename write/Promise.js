class MyPromise {
    constructor(executor) {
        this.state = 'pending';
        this.value = undefined;
        this.reason = undefined;
        this.onResolveCallbacks = [];
        this.onRejectCallbacks = [];

        const resolve = (value) => {
            if (this.state === 'pending') {
                this.state = 'fulfilled';
                this.reason = value;
                this.onResolveCallbacks.forEach(cb => cb(value));
            }
        }

        const reject = (reason) => {
            if (this.state === 'pending') {
                this.state = 'reject';
                this.reason = reason;
                this.onRejectCallbacks.forEach(cb => cb(reason));
            }
        }

        executor(resolve, reject);
    }

    static resolve(value) {
        if (value instanceof MyPromise) {
            return value;
        }
        return new MyPromise(() => resolve(value));
    }

    static reject(reason) {
        if (reason instanceof MyPromise) {
            return reason;
        }
        return new MyPromise(() => reject(reason))
    }

    then(onFulfilled, onRejected) {
        if (this.state === 'fulfilled') {
            try {
                const result = onFulfilled ? onFulfilled(this.value) : this.value;
                if (result instanceof MyPromise) {
                    result.then(resolve, reject)
                } else {
                    resolve(result);
                }
            } catch (error) {
                reject(error);
            }
        } else if (this.state === 'reject') {
            try {
                const result = onRejected ? onRejected(this.reason) : this.reason;
                if (result instanceof MyPromise) {
                    result.then(resolve, reject)
                } else {
                    reject(result);
                }
            } catch (error) {
                reject(error);
            }
        } else {
            if (onFulfilled) {
                this.onResolveCallbacks.push(() => {
                    try {
                        const result = onFulfilled(this.value);
                        if (result instanceof MyPromise) {
                            result.then(resolve, reject)
                        } else {
                            resolve(result);
                        }
                    } catch (error) {
                        reject(error);
                    }
                })
            }
            if (onRejected) {
                this.onRejectCallbacks.push(() => {
                    const result = onFulfilled(this.reason);
                    if (result instanceof MyPromise) {
                        result.then(resolve, reject)
                    } else {
                        reject(result);
                    }
                })
            }
        }
    }

    catch(onRejected) {
        return this.then(null, onRejected);
    }

    all(promises) {
        return new MyPromise((resolve, reject) => {
            let count = 0
            let result = []
            const processData = (value, index) => {
                count++;
                result[index] = value;
                if (count === promises.length) {
                    resolve(result);
                }
            }
            promises.forEach((promise, index) => {
                MyPromise(promise).then(
                    value => processData(value, index),
                    reason => reject(reason)
                )
            })
        })
    }

    race(promises) {
        return new MyPromise((resolve, reject) => {
            promises.forEach((promise) => {
                MyPromise(promise).then(
                    value => resolve(value),
                    reason => reject(reason)
                )
            })
        })
    }

    allSettled(promises) {
        return new MyPromise((resolve, reject) => {
            let count = 0
            let result = []
            const processData = (value, index) => {
                count++;
                result[index] = {
                    value,
                    state
                }
                if (count === promises.length) {
                    resolve(result);
                }
            }
            promises.forEach((promise, index) => {
                MyPromise(promise).then(
                    value => processData(value, index, 'fulfilled'),
                    reason => processData(reason, index, 'reject')
                )
            })
        })
    }
}