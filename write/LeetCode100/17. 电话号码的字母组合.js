/*
 * @Date: 2026-03-16 12:06:19
 * @LastEditors: zengfa 1051403128@qq.com
 * @LastEditTime: 2026-03-16 12:11:27
 * @FilePath: \leetcode-study\write\LeetCode100\17. 电话号码的字母组合.js
 */
// 给定一个仅包含数字 2 - 9 的字符串，返回所有它能表示的字母组合。答案可以按 任意顺序 返回。
// 给出数字到字母的映射如下（与电话按键相同）。注意 1 不对应任何字母。
// 输入：digits = "23"
// 输出：["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"]
var letterCombinations = function (digits) {
    const phoneMap = ['', '', "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"];
    const n = digits.length;
    const res = [];
    const path = [];
    const dfs = (i) => {
        if (i === n) {
            res.push(path.join(''));
            return;
        }
        for (const item of phoneMap[digits[i]]) {
            path.push(item);
            dfs(i + 1);
            path.pop();
        }
    }
    dfs(0);
    return res;
}
const digits = "23"
console.log(letterCombinations(digits));