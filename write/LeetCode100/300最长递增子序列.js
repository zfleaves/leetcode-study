/*
 * @Date: 2026-03-17 19:52:46
 * @LastEditors: zengfa 1051403128@qq.com
 * @LastEditTime: 2026-03-17 20:02:15
 * @FilePath: \leetcode-study\write\LeetCode100\300.js
 */
// 给你一个整数数组 nums ，找到其中最长严格递增子序列的长度。

// 子序列 是由数组派生而来的序列，删除（或不删除）数组中的元素而不改变其余元素的顺序。例如，[3, 6, 2, 7] 是数组[0, 3, 1, 6, 2, 2, 7] 的子序列。
// 输入：nums = [10, 9, 2, 5, 3, 7, 101, 18]
// 输出：4
// 解释：最长递增子序列是[2, 3, 7, 101]，因此长度为 4 。
/**
 * @param {number[]} nums
 * @return {number}
 */
// 第一种 动态规划
var lengthOfLIS = function (nums) {
    const n = nums.length;
    const dp = new Array(n).fill(1);
    let maxlen = 0;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < i; j++) {
            if (nums[i] > nums[j]) {
                dp[i] = Math.max(dp[i], dp[j] + 1); //更新dp[i]
            }
        }
        maxlen = Math.max(maxlen, dp[i]);
    }
    return maxlen;
}

var lengthOfLISSearch = function (nums) {
    const n = nums.length;
    if (n <= 1) return n;
    let tail = [nums[0]];
    for (let i = 0; i < n; i++) {
        //当nums中的元素比tail中的最后一个大时 可以放心push进tail
        if (nums[i] > tail[tail.length - 1]) {
            tail.push(nums[i]);
        } else {
            let left = 0, right = tail.length - 1; // 闭区间
            while (left < right) {
                const mid = Math.floor((left + right) / 2);
                if (tail[mid] < nums[i]) {
                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
            }
            tail[left] = nums[i];
        }
    }
    console.log('tail: ', tail);
    return tail.length;
}
const nums = [10, 9, 2, 5, 3, 7, 101, 18]; // 4
console.log(lengthOfLIS(nums));
console.log('lengthOfLISSearch: ', lengthOfLISSearch(nums));