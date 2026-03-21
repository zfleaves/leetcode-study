/*
 * @Date: 2026-03-17 20:18:20
 * @LastEditors: zengfa 1051403128@qq.com
 * @LastEditTime: 2026-03-17 20:22:39
 * @FilePath: \leetcode-study\write\LeetCode100\62. 不同路径.js
 */
// 一个机器人位于一个 m x n 网格的左上角 （起始点在下图中标记为 “Start” ）。

// 机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下角（在下图中标记为 “Finish” ）。
// 输入：m = 3, n = 7
// 输出：28
/**
 * @param {number} m
 * @param {number} n
 * @return {number}
 */
var uniquePaths = function (m, n) {
    const dp = new Array(m).fill(0).map(() => new Array(n).fill(0));
    for (let i = 0; i < m; i++) {
        dp[i][0] = 1;
    }
    for (let j = 0; j < n; j++) {
        dp[0][j] = 1;
    }
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
        }
    }
    return dp[m - 1][n - 1];
};
const m = 3, n = 7;
console.log(uniquePaths(m, n));