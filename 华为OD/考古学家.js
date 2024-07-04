/*
 * @Date: 2024-06-02 19:45:06
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2024-06-02 19:47:08
 * @FilePath: \leetcode-study\华为OD\考古学家.js
 */
function permute(str, l, r) {
    if (l === r) {
        console.log(str);
    } else {
        for (let i = l; i <= r; i++) {
            str = swap(str, l, i);
            permute(str, l + 1, r);
            str = swap(str, l, i); // backtrack  
        }
    }
}

function swap(str, i, j) {
    let result = str.split('');
    [result[i], result[j]] = [result[j], result[i]];
    return result.join('');
}

// 示例输入  
let input = "abc";
let n = input.length;
permute(input, 0, n - 1);