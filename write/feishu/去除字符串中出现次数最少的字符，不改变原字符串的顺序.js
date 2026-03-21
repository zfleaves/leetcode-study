/*
 * @Date: 2026-02-26 21:18:37
 * @LastEditors: zengfa 1051403128@qq.com
 * @LastEditTime: 2026-02-26 21:25:25
 * @FilePath: \leetcode-study\write\feishu\去除字符串中出现次数最少的字符，不改变原字符串的顺序.js
 */
// 去除字符串中出现次数最少的字符，不改变原字符串的顺序

function removeLeastFrequentChars(str) {
    if (str === '') return '';
    const charCount = {}
    for (const s of str) {
        charCount[s] = (charCount[s] ?? 0) | 1;
    }
    // 找出出现次数最少
    const minCount = Math.min(...Object.values(charCount));

    // 去除出现次数最少的字符
    let result = '';
    for (const char of str) {
        if (charCount[char] > minCount) {
            result += char;
        }
    }

    return result;
}
console.log(1111)
console.log(removeLeastFrequentChars('aabcccccaaa')); // b1 (因为b只出现1次，a和c出现多次)