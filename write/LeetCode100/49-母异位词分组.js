/*
 * @Date: 2026-03-15 13:52:22
 * @LastEditors: zengfa 1051403128@qq.com
 * @LastEditTime: 2026-03-15 13:52:38
 * @FilePath: \leetcode-study\write\LeetCode100\49. 字母异位词分组.js
 */
// 示例 1:

// 输入: strs = ["eat", "tea", "tan", "ate", "nat", "bat"]

// 输出: [["bat"], ["nat", "tan"], ["ate", "eat", "tea"]]

// 解释：

// 在 strs 中没有字符串可以通过重新排列来形成 "bat"。
// 字符串 "nat" 和 "tan" 是字母异位词，因为它们可以重新排列以形成彼此。
// 字符串 "ate" ，"eat" 和 "tea" 是字母异位词，因为它们可以重新排列以形成彼此。
var groupAnagrams = function (strs) {
    const map = new Map();
    for (let c of strs) {
        const word = c.split('').sort().join('');
        const list = map.get(word) ?? [];
        map.set(word, [...list, c]);
    }
    return Array.from(map.values());
}
const strs = ["eat", "tea", "tan", "ate", "nat", "bat"];
console.log(groupAnagrams(strs));