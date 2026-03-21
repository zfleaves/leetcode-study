/*
 * @Date: 2026-03-15 20:02:49
 * @LastEditors: zengfa 1051403128@qq.com
 * @LastEditTime: 2026-03-15 20:30:41
 * @FilePath: \leetcode-study\write\LeetCode100\54. 螺旋矩阵.js
 */
// 给你一个 m 行 n 列的矩阵 matrix ，请按照 顺时针螺旋顺序 ，返回矩阵中的所有元素。
// 输入：matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
// 输出：[1, 2, 3, 6, 9, 8, 7, 4, 5]
[
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]
/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
var spiralOrder = function (matrix) {
    const m = matrix.length;
    const n = matrix[0].length;
    let left = 0, right = n - 1, top = 0, bottom = m - 1;
    let order = [];
    while (left <= right && top <= bottom) {
        for (let i = left; i <= right; i++) {
            order.push(matrix[top][i]); // [1, 2, 3]
        }
        for (let i = top + 1; i <= bottom; i++) {
            order.push(matrix[i][right]);
        }
        if (left < right && top < bottom) {
            for (let i = right - 1; i >= left; i--) {
                order.push(matrix[bottom][i]);
            }
            for (let i = bottom - 1; i > top; i--) {
                order.push(matrix[i][left]);
            }
        }
        [left, right, top, bottom] = [left + 1, right - 1, top + 1, bottom - 1];
    }
    return order;
}
const matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
console.log(spiralOrder(matrix))