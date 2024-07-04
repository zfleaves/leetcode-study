/*
 * @Date: 2024-06-05 13:34:28
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2024-06-05 14:38:52
 * @FilePath: \leetcode-study\handwriting method\myPromise.js
 */
class MyPromise {
    static PENDING = 'pending'
    static FULFILLED = 'fulfilled'
    static REJECTED = 'rejected'

    constructor(executor) {
        this.status = MyPromise.PENDING
        this.value = null
        this.callbacks = []
        try {
            executor(this.reslove.bind(this), this.reject.bind(this))
        } catch (error) {
            this.status = MyPromise.REJECTED
            this.reject(error)
        }
    }

    reslove(value) {
        if (this.status = MyPromise.PENDING) {
            this.status = MyPromise.FULFILLED
            this.value = value
            this.callbacks.map((callback) => {
                callback(onFulfilled(value))
            })
        }
    }

    reject(value) {
        if (this.status = MyPromise.PENDING) {
            this.status = MyPromise.REJECTED
            this.value = value
            this.callbacks.map((callback) => {
                callback(onRejected(value))
            })
        }
    }

    then(onFulfilled, onRejected) {
        if (typeof onFulfilled !== 'function') {
            onFulfilled = () => {}
        }
        if (typeof onRejected !== "function") {
            // 如果传入的不是一个函数，默认创建空函数
            onRejected = () => this.value; // 支持穿透
        }

        let promise = new MyPromise((reslove, reject) => {
            if (this.status === MyPromise.FULFILLED) {
                setTimeout(() => {
                    // then处理成功的函数onFulfilled中出现异常，交由当前then处理失败的函数onRejected函数进行处理。这个后面会做优化
                    if (promise === onFulfilled(ths.value)) {
                        throw new TypeError("Chaining cycle detected");
                    }
                    try {
                        if (promise instanceof MyPromise) {
                            // 判断是否返回Promise对象
                            result.then(reslove, reject);
                        } else {
                            resolve(result); // 改变状态并将值交由下一个then接收
                        }
                    } catch (error) {
                        reject(e); // 向下传递异常
                    }
                })
            }
            if (this.status === MyPromise.REJECTED) {
                setTimeout(() => {
                    if (promise === onRejected(ths.value)) {
                        throw new TypeError("Chaining cycle detected");
                    }
                    try {
                        if (promise instanceof MyPromise) {
                            // 判断是否返回Promise对象
                            result.then(reslove, reject);
                        } else {
                            resolve(result); // 改变状态并将值交由下一个then接收
                        }
                    } catch (error) {
                        reject(e); // 向下传递异常
                    }
                })
            }
            if (this.status === MyPromise.PENDING) {
                this.callbacks.push({
                    onFulfilled: (value) => {
                        try {
                            let result = onFulfilled(value);
                            if (result instanceof MyPromise) {
                                resolve.then(reslove, reject);
                            } else {
                                resolve(result);
                            }
                        } catch (error) {
                            reject(error); // 传递给下一个then
                        }
                    },
                    onRejected: (value) => {
                        try {
                          let result = onRejected(value);
                          if (result instanceof MyPromise) {
                            resolve.then(reslove, reject);
                          } else {
                            resolve(result);
                          }
                        } catch (error) {
                          reject(error); // 传递给下一个then
                        }
                    }
                })
            }
        })
    }
    
    pares(promise, value, )
}