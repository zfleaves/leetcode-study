// 给你一个字符串 s 。我们要把这个字符串划分为尽可能多的片段，同一字母最多出现在一个片段中。例如，字符串 "ababcc" 能够被分为["abab", "cc"]，但类似["aba", "bcc"] 或["ab", "ab", "cc"] 的划分是非法的。
// 输入：s = "ababcbacadefegdehijhklij"
// 输出：[9, 7, 8]
// 解释：
// 划分结果为 "ababcbaca"、"defegde"、"hijhklij" 。
// 每个字母最多出现在一个片段中。
// 像 "ababcbacadefegde", "hijhklij" 这样的划分是错误的，因为划分的片段数较少。
/**
 * @param {string} s
 * @return {number[]}
 */
var partitionLabels = function (s) {
    const n = s.length;
    const sLast = new Array(26);
    const aCode = 'a'.charCodeAt();
    for (let i = 0; i < n; i++) {
        sLast[s[i].charCodeAt() - aCode] = i; // 计算字符最后出现得位置
    }
    let res = [];
    let start = 0, end = 0;
    console.log('sLast: ', sLast);
    for (let i = 0; i < n; i++) {
        end = Math.max(end, sLast[s[i].charCodeAt() - aCode]); // 更新当前区间右端点的最大值
        if (end === i) {
            console.log(s.slice(start, end + 1));
            res.push(end - start + 1);
            start = i + 1;
        }
    }
    return res;
}
const s = "ababcbacadefegdehijhklij";
console.log(partitionLabels(s))