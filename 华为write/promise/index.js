/*
 * @Date: 2024-06-25 13:41:47
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2024-07-01 10:01:27
 * @FilePath: \leetcode-study\华为write\promise\index.js
 */
class MyPromise {
    constructor(executor) {
        this.status = 'pending'
        this.value = undefined
        this.reason = undefined

        this.onResolveCallbacks = [] // 存储 then 中的回调函数
        this.onRejectCallbacks = [] // 存储 catch 中的回调函数

        const reslove = (value) => {
            if (this.status === 'pending') {
                this.status = 'fulfilled'
                this.value = value
                this.onResolveCallbacks.forEach(callback => callback(value))
            }
        }

        const reject = (reason) => {
            if (this.status === 'pending') {
                this.status = 'reject'
                this.reason = reason
                this.onRejectCallbacks.forEach(callback => callback(value))
            }
        }

        try {
            executor(reslove, reject)
        } catch (error) {
            reject(error)
        }
    }

    then(onFulfilled, onRejected) {
        if (this.status === 'fulfilled') {
            try {
                const result = onFulfilled ? onFulfilled(this.value) : this.value
                if (result instanceof MyPromise) {
                    return result.then(resolve, reject)
                } else {
                    resolve(result); // 否则直接 resolve
                }
            } catch (error) {
                reject(error)
            }
        } else if (this.status === 'reject') {
            try {
                const result = onRejected ? onRejected(this.reason) : this.reason
                if (result instanceof MyPromise) {
                    return result.then(resolve, reject)
                } else {
                    reject(result); // 否则直接 resolve
                }
            } catch (error) {
                reject(error)
            }
        } else if (this.status === 'pending') {
            if (onFulfilled) {
                this.onResolveCallbacks.push(() => {
                    try {
                        const result = onFulfilled(this.value);
                        if (result instanceof MyPromise) {
                            result.then(resolve, reject);
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
                    try {
                        const result = onRejected ? onRejected(this.reason) : this.reason
                        if (result instanceof MyPromise) {
                            return result.then(resolve, reject)
                        } else {
                            reject(result); // 否则直接 resolve
                        }
                    } catch (error) {
                        reject(error)
                    }
                })
            }
        }
    }

    catch (onRejected) {
        return this.then(null, onRejected)
    }

    static all(promises) {
        return new MyPromise((resolve, reject) => {
            let count = 0
            let result = []
            const processData = (index, value) => {
                count++
                result[index] = value
                if (count === promises.length) {
                    resolve(results);
                }
            }
            promises.forEach((promise, index) => {
                MyPromise.reslove(promise).then(
                    (value) => processData(index, value),
                    (reason) => reject(reason)
                )
            })
        })
    }

    static race(promises) {
        return new MyPromise((resolve, reject) => {
            promises.forEach((promise, index) => {
                MyPromise.reslove(promise).then(
                    (value) => resolve(value),
                    (reason) => reject(reason)
                )
            })
        })
    }

    static allSettled(promises) {
        return new MyPromise((resolve) => {
            let results = [];
            let completedCount = 0;

            const processData = (index, value, state) => {
                results[index] = {
                    status: state,
                    value
                };
                completedCount++;

                if (completedCount === promises.length) {
                    resolve(results);
                }
            };

            promises.forEach((promise, index) => {
                MyPromise.resolve(promise).then(
                    (value) => processData(index, value, 'fulfilled'),
                    (reason) => processData(index, reason, 'rejected')
                );
            });
        });
    }

    static resolve(value) {
        if (value instanceof MyPromise) {
            return value; // 如果是 MyPromise 实例，直接返回
        }
        return new MyPromise(resolve => resolve(value)); // 否则，返回一个新的 Promise
    }

    static reject(reason) {
        if (reason instanceof MyPromise) {
            return reason; // 如果是 MyPromise 实例，直接返回
        }
        return new MyPromise((reject) => reject(reason)); // 直接返回一个 rejected 的 Promise
    }
}