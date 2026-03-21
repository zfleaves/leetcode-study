/*
 * @Date: 2026-03-16 17:08:50
 * @LastEditors: zengfa 1051403128@qq.com
 * @LastEditTime: 2026-03-16 17:16:05
 * @FilePath: \leetcode-study\write\LeetCode100\394. 字符串解码.js
 */
// 给定一个经过编码的字符串，返回它解码后的字符串。
// 编码规则为: k[encoded_string]，表示其中方括号内部的 encoded_string 正好重复 k 次。注意 k 保证为正整数。
// 输入：s = "3[a]2[bc]"
// 输出："aaabcbc"
// 输入：s = "2[abc]3[cd]ef"
// 输出："abcabccdcdcdef"
// 输入：s = "abc3[cd]xyz"
// 输出："abccdcdcdxyz"
/**
 * @param {string} s
 * @return {string}
 */
var decodeString = function (s) {
    const stack = []; // 用于模拟计算机的递归
    let res = '';
    let k = 0;
    for (let c of s) {
        if ('a' <= c && c <= 'z') {
            res += c;
        } else if ('0' <= c && c <= '9') {
            k = k * 10 + parseInt(c);
        } else if (c === '[') {
            stack.push([res, k]);
            // 递归，初始化 res 和 k
            res = '';
            k = 0;
        } else {
            const [pre_res, pre_k] = stack.pop();
            res = pre_res + res.repeat(pre_k);
        }
    }
    return res;
}
console.log(decodeString('3[a]2[bc]')); // aaabcbc
console.log(decodeString('2[abc]3[cd]ef')); // abcabccdcdcdef
console.log(decodeString('abc3[cd]xyz')); // abccdcdcdxyz