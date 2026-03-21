/*
 * @Date: 2026-03-15 19:02:49
 * @LastEditors: zengfa 1051403128@qq.com
 * @LastEditTime: 2026-03-15 19:02:58
 * @FilePath: \leetcode-study\write\LeetCode100\73. 矩阵置零.js
 */
// 给定一个 m x n 的矩阵，如果一个元素为 0 ，则将其所在行和列的所有元素都设为 0 。请使用 原地 算法。
// 输入：matrix = [[1, 1, 1], [1, 0, 1], [1, 1, 1]]
// 输出：[[1, 0, 1], [0, 0, 0], [1, 0, 1]]
/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var setZeroes = function (matrix) {
    const m = matrix.length;
    const n = matrix[0].length;
    const row = new Array(m).fill(false);
    const colum = new Array(n).fill(false);

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (matrix[i][j] === 0) {
                row[i] = true;
                colum[j] = true;
            }
        }
    }

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (row[i] || colum[j]) {
                matrix[i][j] = 0;
            }
        }
    }
    return matrix;
}
const matrix = [[1, 1, 1], [1, 0, 1], [1, 1, 1]];
console.log(setZeroes(matrix))