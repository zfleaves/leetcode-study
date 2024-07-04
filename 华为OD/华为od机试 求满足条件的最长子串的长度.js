/*
 * @Date: 2024-06-02 18:22:15
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2024-06-02 18:22:32
 * @FilePath: \leetcode-study\华为OD\华为od机试 求满足条件的最长子串的长度.js
 */
/**
 * @param {string[]} str
 * @return {string}
 */
function findLongestValidSubstring(s) {
    let maxLen = -1;
    let l = 0; // 左指针  
    let r = 0; // 右指针  
    let letterIdx = []; // 用来记录字母出现的位置  
    let hasLetter = false; // 标记是否找到了字母  
    let hasNum = false
    while (r < s.length) {
        const char = s[r]
        if (/[a-zA-Z]/.test(s[r])) {
            if (hasLetter) {
                l = letterIdx.shift() + 1;
                letterIdx.push(r)
            } else {
                hasLetter = true
                letterIdx.push(r)
                // 如果l追上了r，只能让r加1  
                if (r === l) {
                    r += 1;
                    continue; // 直接进入下一个循环  
                }
            }
        } else if (/\d/.test(char)) {
            hasNum = true
        }
        maxLen = Math.max(maxLen, r - l + 1)
        r++
    }
    // 如果没有找到任何字母，返回-1  
    if (!hasLetter || !hasNum) {
        return -1;
    }

    // 返回最长子串的长度  
    return maxLen;
}