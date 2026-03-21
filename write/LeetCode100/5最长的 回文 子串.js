/*
 * @Date: 2026-03-17 21:02:08
 * @LastEditors: zengfa 1051403128@qq.com
 * @LastEditTime: 2026-03-17 21:09:33
 * @FilePath: \leetcode-study\write\LeetCode100\5.js
 */
// 给你一个字符串 s，找到 s 中最长的 回文 子串。
// 输入：s = "babad"
// 输出："bab"
// 解释："aba" 同样是符合题意的答案
// 输入：s = "cbbd"
// 输出："bb"

/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function (s) {
    const n = s.length;
    let res = '';
    for (let i = 0; i < n; i++) {
        help(i, i);
        help(i, i + 1);
    }
    function help(i, j) {
        while(i >= 0 && j < n && s[i] === s[j]) {
            i--;
            j++;
        }
        // 当退出 while 循环时，i和 j分别位于最后一个不匹配字符的位置：
        // (j-1) - (i+1) + 1 = j - i - 1
        if (j - (i + 1) > res.length) {  // 或者 j - i - 1 > res.length
            res = s.slice(i + 1, j);
        }
    }
    return res;
}
const s = "babad"; // aba
console.log(longestPalindrome(s));