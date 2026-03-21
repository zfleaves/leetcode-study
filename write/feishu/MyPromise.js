/*
 * @Date: 2026-02-27 11:40:15
 * @LastEditors: zengfa 1051403128@qq.com
 * @LastEditTime: 2026-02-27 11:51:52
 * @FilePath: \leetcode-study\write\feishu\MyPromise.js
 */
const PENDING = 'PENDING';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
    constructor(executor) {
        this.status = PENDING;
        this.value = undefined;
        this.reason = undefined;
        this.onResolveCallbacks = [];
        this.onRejectCallbacks = [];

        const resolve = (value) => {
            if (this.status === PENDING) {
                this.status = FULFILLED;
                this.value = value;
                this.onResolveCallbacks.forEach(cb => cb(value));
            }
        }

        const reject = (reason) => {
            if (this.status === PENDING) {
                this.status = REJECTED;
                this.reason = reason;
                this.onRejectCallbacks.forEach(cb => cb());
            }
        }

        try {
            executor(resolve, reject)
        } catch (error) {
            reject(error);
        }
    }

    static resolve(value) {
        if (value instanceof MyPromise) {
            return value;
        }
        return new MyPromise(resolve => resolve(value));
    }

    static reject(reason) {
        if (reason instanceof MyPromise) {
            return reason;
        }
        return new MyPromise((_, reject) => reject(reason));
    }

    then(onFulfilled, onRejected) {
        return new MyPromise((resolve, reject) => {
            const fulfilledTask = () => {
                const result = onFulfilled ? onFulfilled(this.value) :this.value;
                try {
                    if (result instanceof MyPromise) {
                        result.then(resolve, reject);
                    } else {
                        resolve(result);
                    }
                } catch (error) {
                    reject(error);
                }
            }

            const rejectedTask = () => {
                const result = onRejected ? onRejected(this.reason) : this.reason;
                try {
                    if (result instanceof MyPromise) {
                        result.then(resolve, reject);
                    } else {
                        resolve(result);
                    }
                } catch (error) {
                    reject(error);
                }
            }

            if (this.status === FULFILLED) {
                fulfilledTask();
            } else if (this.status === REJECTED) {
                rejectedTask();
            } else {
                this.onResolveCallbacks.push(fulfilledTask);
                this.onRejectCallbacks.push(rejectedTask);
            }
        })
    }

    catch(onRejected) {
        return this.then(null, onRejected);
    }

    all(promises) {
        return new MyPromise((resolve, reject) => {
            let count = 0;
            let result = [];
            let processData = (value, index) => {
                count++;
                result[index] = value;
                if (count === promises.length) {
                    resolve(result);
                }
            }
            promises.forEach((promise, index) => {
                MyPromise.resolve(promise).then(
                    value => processData(value, index),
                    reason => reject(reason)
                )
            })
        })
    }

    allSettled(promises) {
        return new MyPromise((resolve, reject) => {
            let count = 0;
            let result = [];
            let processData = (value, index, state) => {
                count++;
                result[index] = {
                    value,
                    state
                };
                if (count === promises.length) {
                    resolve(result);
                }
            }
            promises.forEach((promise, index) => {
                MyPromise.resolve(promise).then(
                    value => processData(value, index, FULFILLED),
                    reason => processData(reason, index, REJECTED),
                )
            })
        })
    }

    race(promises) {
        return new MyPromise((resolve, reject) => {
            promises.forEach((promise, index) => {
                MyPromise.resolve(promise).then(
                    value => resolve(value),
                    reason => reject(reason)
                )
            })
        })
    }

    finally(callback) {
        return this.then(
            value => MyPromise.resolve(callback()).then(() => value),
            reason => MyPromise.resolve(callback()).then(() => { throw reason})
        )
    }
}

// 测试
const promise1 = new MyPromise((resolve) => {
    setTimeout(() => resolve('Success'), 1000);
});

promise1
    .then(value => console.log(value)) // 'Success'
    .then(() => 'Next')
    .then(value => console.log(value))
    .finally(() => console.log(11111111))