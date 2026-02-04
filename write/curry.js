/*
 * @Date: 2026-01-29 22:08:34
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2026-01-29 22:10:46
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