class MyPromise {
  static PENDING = "pengding";
  static FULFILLED = "fulfilled";
  static REJECTED = "rejected";

  constructor(executor) {
    this.state = MyPromise.PENDING;
    this.value = null; // 初始值
    this.callbacks = []; // 如果是一个异步操作，则放入该数组中
    try {
      executor(this.reslove.bind(this), this.reject.bind(this));
    } catch (error) {
      this.status = MyPromise.REJECTED; // 异常发生改变状态
      this.reject(error);
    }
  }

  reslove(value) {
    if (this.state === MyPromise.PENDING) {
      this.state = MyPromise.FULFILLED;
      this.value = value;
      this.callbacks.map((callback) => {
        callback(onFulfilled(value));
      });
    }
  }

  reject(reason) {
    if (this.state === MyPromise.PENDING) {
      this.state = MyPromise.REJECTED;
      this.value = reason;
      this.callbacks.map((callback) => {
        callback(onRejected(reason));
      });
    }
  }

  then(onFulfilled, onRejected) {
    if (typeof onFulfilled !== "function") {
      // 如果传入的不是一个函数，默认创建空函数
      onFulfilled = () => this.value; // 支持穿透
    }
    if (typeof onRejected !== "function") {
      // 如果传入的不是一个函数，默认创建空函数
      onRejected = () => this.value; // 支持穿透
    }
    let promise = new MyPromise((reslove, reject) => {
      if (this.status == MyPromise.FUFILLED) {
        setTimeout(() => {
          // then处理成功的函数onFulfilled中出现异常，交由当前then处理失败的函数onRejected函数进行处理。这个后面会做优化
          this.parse(promise, onFulfilled(this.value), reslove, reject);
        });
      }
      if (this.status == MyPromise.REJECTED) {
        setTimeout(() => {
          this.parse(promise, onRejected(this.value), reslove, reject);
        });
      }
      if (this.status == MyPromise.PENDING) {
        // 如果当前Promise是等待处理状态，则将处理成功的函数与处理失败的函数压入异步数组。
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
          },
        });
      }
    });
    return promise;
  }
  parse(result, resolve, reject) {
    if (promise == result) {
      throw new TypeError("Chaining cycle detected");
    }
    try {
      if (result instanceof MyPromise) {
        // 判断是否返回Promise对象
        result.then(resolve, reject);
      } else {
        resolve(result); // 改变状态并将值交由下一个then接收
      }
    } catch (e) {
      reject(e); // 向下传递异常
    }
  }

  static reslove(value) {
    return new MyPromise((resolve, reject) => {
      if (value instanceof MyPromise) {
        value.then(resolve, reject);
      } else {
        resolve(value);
      }
    });
  }
  static reject(value) {
    return new MyPromise((resolve, reject) => {
      reject(value);
    });
  }

  static all(promises) {
    if (!promises instanceof Array) throw 'promises must be an array'
    return new MyPromise((resolve, reject) => {
      const values = []; // 记录当前有多少promise状态是成功
      promises.forEach((promise) => {
        promise.then(
          (value) => {
            values.push(value);
            if (values.length == promise.length) {
              resolve(values); // 如果都成功，当前all返回的promise则状态为fulfilled。
            }
          },
          (reason) => {
            reject(reason);
          }
        );
      });
    });
  }

  static allSettled(promises) {
    if (!promises instanceof Array) throw 'promises must be an array'
    return new MyPromise((reslove, reject) => {
        const values = [];
        promises.forEach(promise => {
            promise.then(
                value => {
                    values.push({ status: PROMISE_STATUS_FULFILLED, value: value });
                    if (values.length == promises.length) resolve(values);
                },
                (reason) => {
                    reject(reason);
                }
            )
        })
    })
  }

  static race(promises) {
    return new MyPromise((resolve, reject) => {
      promises.forEach((promise) => {
        promise.then(
          (value) => {
            // 如果循环中的promise状态为fulfilled，则当前的race创建的promise状态也为resolve
            resolve(value);
          },
          (reason) => {
            reject(value); // 同上
          }
        );
      });
    });
  }
}
