// 给定一个非负整数 numRows，生成「杨辉三角」的前 numRows 行
// 输入: numRows = 5
// 输出: [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]]
/**
 * @param {number} numRows
 * @return {number[][]}
 */
var generate = function (numRows) {
    const res = [];
    for (let i = 0; i < numRows; i++) {
        const row = new Array(i + 1).fill(1);
        for (let j = 1; j < row.length - 1; j++) {
            row[j] = res[i - 1][j - 1] + res[i - 1][j]
        }
        res.push(row);
    }
    return res;
}
const numRows = 5;
console.log('generate: ', generate(numRows));