/*
 * @Date: 2026-03-15 17:20:57
 * @LastEditors: zengfa 1051403128@qq.com
 * @LastEditTime: 2026-03-15 17:32:05
 * @FilePath: \leetcode-study\write\LeetCode100\76.js
 */
// 输入：s = "ADOBECODEBANC", t = "ABC"
// 输出："BANC"
// 解释：最小覆盖子串 "BANC" 包含来自字符串 t 的 'A'、'B' 和 'C'。
/**
 * @param {string} s
 * @param {string} t
 * @return {string}
 */
var minWindow = function (s, t) {
    const need = new Map();
    // 统计t 字符串各个次数
    for (let c of t) {
        need.set(c, (need.get(c) ?? 0) + 1);
    }
    let start = 0;
    let slow = 0;
    let vaild = 0;
    let window = new Map();
    let minLen = Infinity;
    for (let i = 0; i < s.length; i++) {
        const c = s[i];
        if (need.has(c)) {
            window.set(c, (window.get(c) ?? 0) + 1);
            if (need.get(c) === window.get(c)) {
                vaild++;
            }
        }
        while (need.size ===  vaild) {
            // console.log(s.slice(slow, i + 1))
            if (i - slow + 1 < minLen) {
                minLen = i - slow + 1;
                start = slow;
            }
            const d = s[slow];
            if (need.has(d)) {
                if (need.get(d) === window.get(d)) {
                    vaild--;
                }
                window.set(d, window.get(d) - 1);
            }
            slow++;
        }
    }   
    return minLen === Infinity ? '' : s.slice(start, start + minLen);
}
const s = "ADOBECODEBANC", t = "ABC";
console.log(minWindow(s, t));