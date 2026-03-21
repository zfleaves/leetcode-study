/*
 * @Date: 2026-03-15 20:36:22
 * @LastEditors: zengfa 1051403128@qq.com
 * @LastEditTime: 2026-03-15 20:36:32
 * @FilePath: \leetcode-study\write\LeetCode100\240. 搜索二维矩阵 II.js
 */
// 编写一个高效的算法来搜索 m x n 矩阵 matrix 中的一个目标值 target 。该矩阵具有以下特性：
// 每行的元素从左到右升序排列。
// 每列的元素从上到下升序排列。
// 输入：matrix = [[1, 4, 7, 11, 15], [2, 5, 8, 12, 19], [3, 6, 9, 16, 22], [10, 13, 14, 17, 24], [18, 21, 23, 26, 30]], target = 5
// 输出：true
/**
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 */
var searchMatrix = function (matrix, target) {
    const m = matrix.length;
    let x = 0, y = matrix[0].length - 1;
    while (x < m && y > 0) {
        const num = matrix[x][y];
        if (num === target) return true;
        if (num < target) {
            x++;
        } else {
            y--;
        }
    }
    return false;
}
const matrix = [[1, 4, 7, 11, 15], [2, 5, 8, 12, 19], [3, 6, 9, 16, 22], [10, 13, 14, 17, 24], [18, 21, 23, 26, 30]], target = 5;
console.log(searchMatrix(matrix, target))