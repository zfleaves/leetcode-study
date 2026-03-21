/*
 * @Date: 2026-03-15 14:04:00
 * @LastEditors: zengfa 1051403128@qq.com
 * @LastEditTime: 2026-03-15 14:06:18
 * @FilePath: \leetcode-study\write\LeetCode100\128-最长连续序列.js
 */
// 输入：nums = [100, 4, 200, 1, 3, 2]
// 输出：4
// 解释：最长数字连续序列是[1, 2, 3, 4]。它的长度为 4。

var longestConsecutive = function (nums) {
    const set = new Set(nums);
    let ans = 0;
    for (let x of set) {
        if (set.has(x - 1)) {
            continue;
        }
        let y = x + 1;
        while (set.has(y)) {
            y++;
        }
        ans = Math.max(ans, y - x);
    }
    return ans;
}
const nums = [100, 4, 200, 1, 3, 2];
console.log('longestConsecutive: ', longestConsecutive(nums));