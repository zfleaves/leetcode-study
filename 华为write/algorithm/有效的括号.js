/*
 * @Date: 2024-06-26 18:13:51
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2024-06-26 18:17:10
 * @FilePath: \leetcode-study\write\algorithm\有效的括号.js
 */
function isMatch(str) {
    const n = str.length
    if (n % 2 !== 0) return false

    const map = new Map([
        ['}', '{'],
        [']', '['],
        [')', '(']
    ])
    const stack = []
    for (let ch of str) {
        if (map.has(ch)) {
            const len = stack.length
            if (!len || stack[len - 1] !== map.get(ch)) {
                return false
            }
            stack.pop()
        } else {
            stack.push(ch)
        }
    }
}