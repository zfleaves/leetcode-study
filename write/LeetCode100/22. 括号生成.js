// 数字 n 代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且 有效的 括号组合。
// 输入：n = 3
// 输出：["((()))", "(()())", "(())()", "()(())", "()()()"]
/**
 * @param {number} n
 * @return {string[]}
 */
var generateParenthesis = function (n) {
    const res = [];
    const dfs = (lRmain, rRmian, str) => {
        if  (str.length === n * 2) {
            res.push(str);
            return;
        }
        if (lRmain > 0) {
            dfs(lRmain - 1, rRmian, str + '(');
        }
        if (lRmain < rRmian) {
            dfs(lRmain, rRmian - 1, str +  ')');
        }
    }
    dfs(n, n, '');
    return res;
}
console.log(generateParenthesis(3));