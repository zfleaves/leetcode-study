/*
 * @Date: 2024-06-26 12:26:11
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2026-01-28 19:28:15
 * @FilePath: \leetcode-study\华为write\promise\promise.js
 */
class MyPromise {
    constructor(executor) {
        this.status = 'pending'
        this.value = null
        this.reason = null

        this.onResolveCallbacks = []
        this.onRejectCallbacks = []

        const resolve = (value) => {
            if (this.status === 'pending') {
                this.status = 'fulfilled'
                this.value = value
                this.onResolveCallbacks.forEach(cb => cb(value))
            }
        }

        const reject = (reason) => {
            if (this.status === 'pending') {
                this.status = 'reject'
                this.reason = reason
                this.onRejectCallbacks.forEach(cb => cb(reason))
            }
        }

        try {
            executor(resolve, reject)
        } catch (error) {
            reject(error)
        }
    }

    static resolve(value) {
        if (value instanceof MyPromise) {
            return value
        }
        return new MyPromise(() => resolve(value))
    }

    static reject(reason) {
        if (reason instanceof MyPromise) {
            return reason
        }
        return new MyPromise(() => reject(reason))
    }

    then(onFulfilled, onRejected) {
        if (this.status === 'fulfilled') {
            try {
                const result = onFulfilled ? onFulfilled(this.value) : this.value
                if (result instanceof MyPromise) {
                    result.then(resolve, reject)
                } else {
                    resolve(result)
                }
            } catch (error) {
                reject(error)
            }
        }
        if (this.status === 'rejected') {
            try {
                const result = onRejected ? onRejected(this.reason) : this.reason
                if (result instanceof MyPromise) {
                    result.then(resolve, reject)
                } else {
                    reject(result)
                }
            } catch (error) {
                reject(error)
            }
        }
        if (this.status === 'pending') {
            if (onFulfilled) {
                this.onResolveCallbacks.push(() => {
                    try {
                        const result = onFulfilled(this.value)
                        if (result instanceof MyPromise) {
                            result.then(resolve, reject)
                        } else {
                            resolve(result)
                        }
                    } catch (error) {
                        reject(error)
                    }
                })
            }
            if (onRejected) {
                this.onRejectCallbacks.push(() => {
                    const result = onRejected(this.reason)
                    if (result instanceof MyPromise) {
                        result.then(resolve, reject)
                    } else {
                        reject(result)
                    }
                })
            }
        }
    }

    catch (onRejected) {
        return this.then(null, onRejected)
    }

    static all(promises) {
        return MyPromise((resolve, reject) => {
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
                MyPromise.resolve(promise).then(
                    value => processData(index, value),
                    reason => reject(reason)
                )
            })
        })
    }

    static race(promises) {
        return MyPromise((resolve, reject) => {
            promises.forEach((promise) => {
                MyPromise.resolve(promise).then(
                    value => resolve(value),
                    reason => reject(reason)
                )
            })
        })
    }

    static allSettled(promises) {
        return MyPromise((resolve, reject) => {
            let count = 0
            let result = []
            const processData = (index, value, state) => {
                count++
                result[index] = {
                    value,
                    state
                }
                if (count === promises.length) {
                    resolve(results);
                }
            }

            promises.forEach((promise, index) => {
                MyPromise.resolve(promise).then(
                    value => processData(index, value, 'fulfilled'),
                    reason => processData(index, reason, 'reject')
                )
            })
        })
    }
}