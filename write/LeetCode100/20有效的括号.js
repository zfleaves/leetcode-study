/*
 * @Date: 2026-03-16 16:04:46
 * @LastEditors: zengfa 1051403128@qq.com
 * @LastEditTime: 2026-03-16 16:09:05
 * @FilePath: \leetcode-study\write\LeetCode100\20有效的括号.js
 */
// 给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效。
// 输入：s = "()[]{}"
// 输出：true
/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function (s) {
    const map = new Map([
        [')', '('],
        ['}', '{'],
        [']', '[']
    ])
    const stack = [];
    for (const v of s) {
        if (map.has(v)) {
            if (stack.length === 0 || map.get(v) !== stack.pop()) {
                return false;
            }
        } else {
            stack.push(v);
        }
    }
    return true;
}
const s = "()[]{}";
console.log(isValid(s));