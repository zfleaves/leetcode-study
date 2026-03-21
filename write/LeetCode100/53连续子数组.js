/*
 * @Date: 2026-03-15 17:44:32
 * @LastEditors: zengfa 1051403128@qq.com
 * @LastEditTime: 2026-03-15 17:53:44
 * @FilePath: \leetcode-study\write\LeetCode100\53.js
 */
// 输入：nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
// 输出：6
// 解释：连续子数组[4, -1, 2, 1] 的和最大，为 6 。
/**
 * @param {number[]} nums
 * @return {number}
 */
// var maxSubArray = function (nums) {
//     const dp = new Array(nums.length).fill(0);
//     dp[0] = nums[0];
//     for (let i = 1; i < nums.length; i++) {
//         dp[i] = Math.max(dp[i - 1] + nums[i], nums[i]);
//     }
//     console.log(dp)
//     return Math.max(...dp);
// }
var maxSubArray = function (nums) {
    let ans = nums[0];
    let pre = nums[0];
    for (let i = 1; i < nums.length; i++) {
        pre = Math.max(pre + nums[i], nums[i]);
        ans = Math.max(ans, pre);
    }
    return ans;
}
const nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
console.log(maxSubArray(nums));