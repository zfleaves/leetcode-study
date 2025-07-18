// 柯里化函数
// 简单柯里化
const curry = function (fn) {
    return function (x) {
        return function (y) {
            return x + y
        }
    }
}
const fn = (x, y) => x + y
const myfn = curry(fn)
const result = myfn(1)(2)
// console.log('myfn: ', myfn);
// console.log('result: ', result);

// 多参数柯里化

const curryMultipleArgs = function (fn, ...argsSoFar) {
    if (argsSoFar.length >= fn.length) {
        console.log('argsSoFar: ', argsSoFar);
        return fn(...argsSoFar)
    }
    return function (...remainingArgs) {
        return curryMultipleArgs(fn, ...argsSoFar, ...remainingArgs)
    }
}
const add = (a, b, c) => a + b + c
const curriedAdd = curryMultipleArgs(add)
const resultMultp = curriedAdd(1)(2)(3);
console.log('resultMultp: ', resultMultp);