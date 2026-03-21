/*
 * @Date: 2026-03-16 12:44:24
 * @LastEditors: zengfa 1051403128@qq.com
 * @LastEditTime: 2026-03-16 12:56:56
 * @FilePath: \leetcode-study\write\LeetCode100\131.js
 */
// 给你一个字符串 s，请你将 s 分割成一些 子串，使每个子串都是 回文串 。返回 s 所有可能的分割方案。
// 输入：s = "aab"
// 输出：[["a", "a", "b"], ["aa", "b"]]
var partition = function (s) {
    const n = s.length;
    let res = [];
    const path = [];
    const dfs = (i) => {
        if (i === n) {
            res.push(path.slice());
            return;
        }
        for (let j = i; j < n; j++) {
            if (isPalindrome(s, i, j)) {
                path.push(s.slice(i, j + 1));
                dfs(j + 1);
                path.pop();
            }
        }
    }
    dfs(0);
    return res;
}

var isPalindrome = function(s, l, r) {
    while(l < r) {
        if (s.charAt(l++) !== s.charAt(r--)) {
            return false;
        }
    }
    return true;
}
const s = "aab";
console.log(partition(s));