/*
 * @Date: 2026-01-29 17:16:12
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2026-01-29 21:33:46
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
        arr[n - 1 - i]  = arr[i];
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