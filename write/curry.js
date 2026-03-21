/*
 * @Date: 2026-01-29 22:08:34
 * @LastEditors: zengfa 1051403128@qq.com
 * @LastEditTime: 2026-03-19 13:47:08
 * @FilePath: \leetcode-study\write\curry.js
 */
function curry(fn) {
    return function curryFn(...args) {
        if (args.length < fn.length) {
            return function () {
                return curryFn(...args.concat([...arguments]));
            }
        }
        return fn(...args);
    }
}

const fn = (x, y, z, a) => x + y + z + a;
const myfn = curry(fn);
console.log(myfn(1)(2)(3)(1));




function curry1(fn) {
    return function curryFn(...args) {
        if (fn.length < args.length) {
            return function () {
                return curryFn(...args.concat([...arguments]));
            }
        }
        fn(args);
    }
}

// 函数缓存
function memoize(func, context) {
    let cache = Object.create(null);
    context = context || this;
    return (...key) => {
        if (!cache[key]) {
            cache[key] = func.apply(context, key);
        }
        return cache[key];
    }
}