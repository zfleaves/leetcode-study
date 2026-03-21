// 给定一个字符串 s ，请你找出其中不含有重复字符的 最长 子串 的长度。
// 输入: s = "pwwkew"
// 输出: 3
// 解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。
// 请注意，你的答案必须是 子串 的长度，"pwke" 是一个子序列，不是子串。
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function (s) {
    let map = new Map();
    let left = 0;
    let ans = 0;
    for (let right = 0; right < s.length; right++) {
        map.set(s[right], (map.get(s[right]) ?? 0) + 1);
        while (map.get(s[right]) > 1) {
            map.set(s[left], map.get(s[left]) - 1);
            left++;
        }
        ans = Math.max(ans, right - left + 1);
    }
    return ans;
}
const s = "pwwkew";
console.log('lengthOfLongestSubstring: ', lengthOfLongestSubstring(s));