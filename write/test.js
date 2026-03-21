/*
 * @Date: 2026-01-29 17:16:12
 * @LastEditors: zengfa 1051403128@qq.com
 * @LastEditTime: 2026-02-10 16:32:18
 * @FilePath: \leetcode-study\write\test.js
 */
const str = 'abcd';

function myReverse(str) {
    const n = str.length;
    if (n <= 1) return str;
    const arr = str.split('');
    const mid = Math.floor(n / 2);
    for (let i = 0; i < mid; i++) {
        const temp = arr[n - 1 - i];
        arr[n - 1 - i] = arr[i];
        arr[i] = temp;
    }
    return arr.join('');
    // const s = str.split('');
    // for (let l = 0, r = s.length - 1; l < r; l++, r--) {
    //     [s[l], s[r]] = [s[r], s[l]]
    // }
    // return s.join('');
}

console.log('res-', myReverse(str));

var obj = {
    say() { console.log(this.name); },
    name: 'Will',
};
const fn = obj.say;
fn();
const fn1 = obj;
fn1.say();

const temperatures = [73, 74, 75, 71, 69, 72, 76, 73]
var dailyTemperatures = function (temperatures) {
    const len = temperatures.length;
    const ans = new Array(len).fill(0);
    const stack = [];
    for (let i = len - 1; i >= 0; i--) {
        const t = temperatures[i];
        while (stack.length && t >= temperatures[stack[stack.length - 1]]) {
            stack.pop();
        }
        if (stack.length) {
            ans[i] = stack[stack.length - 1] - i;
        }
        stack.push(i);
    }
    return ans
};
console.log(dailyTemperatures(temperatures), 'dailyTemperatures')