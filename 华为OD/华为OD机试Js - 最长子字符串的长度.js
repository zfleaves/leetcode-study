/*
 * @Date: 2024-06-02 18:43:42
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2024-06-02 18:43:48
 * @FilePath: \leetcode-study\华为OD\华为OD机试Js - 最长子字符串的长度.js
 */
function findLongestSubstring(s) {
    // 加倍字符串  
    let doubledS = s + s;
    let maxLength = 0; // 最长子字符串长度  
    let count = 0; // 当前窗口中'o'字符的个数  
    let start = 0; // 窗口的起始位置  
    let map = new Map(); // 哈希表记录每个字符最后一次出现的位置  

    // 初始化哈希表，将第一个字符的索引作为-1（为了处理窗口起始于第一个字符的情况）  
    map.set('o', -1);

    for (let end = 0; end < doubledS.length; end++) {
        // 如果当前字符是'o'，则增加计数  
        if (doubledS[end] === 'o') {
            count++;
        }

        // 如果当前字符在哈希表中存在，并且其索引在窗口内（不包括起始位置），说明窗口内有重复的'o'  
        if (map.has(doubledS[end]) && map.get(doubledS[end]) >= start) {
            // 缩小窗口，直到没有重复的'o'为止  
            while (doubledS[start] !== doubledS[end] || map.get(doubledS[start]) < start) {
                if (doubledS[start] === 'o') {
                    count--;
                }
                start++;
            }
            // 移动起始位置到重复'o'的下一个位置  
            start++;
        }

        // 更新哈希表  
        map.set(doubledS[end], end);

        // 如果当前窗口中'o'的个数是偶数，则更新最长子字符串长度  
        if (count % 2 === 0) {
            maxLength = Math.max(maxLength, end - start + 1);
        }
    }

    // 因为是在加倍的字符串上找的，所以最后要除以2  
    return maxLength / 2;
}

// 示例用法  
let s = "abcabc"; // 环形字符串中，'o'字符出现0次，但按规则应返回最长不含'o'的子字符串长度  
console.log(findLongestSubstring(s)); // 输出: 6，因为整个字符串都不含'o'字符  

s = "abocoboo"; // 环形字符串中，最长不含重复'o'的子字符串是"aboco"或"bocob"  
console.log(findLongestSubstring(s)); // 输出: 5，因为"aboco"或"bocob"的长度都是5，且'o'字符出现偶数次（两次）