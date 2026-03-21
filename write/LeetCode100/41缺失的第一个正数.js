/*
 * @Date: 2026-03-15 18:46:17
 * @LastEditors: zengfa 1051403128@qq.com
 * @LastEditTime: 2026-03-15 18:52:28
 * @FilePath: \leetcode-study\write\LeetCode100\41.js
 */
// 给你一个未排序的整数数组 nums ，请你找出其中没有出现的最小的正整数。

// 请你实现时间复杂度为 O(n) 并且只使用常数级别额外空间的解决方案。
// 输入：nums = [1, 2, 0]
// 输出：3
// 解释：范围[1, 2] 中的数字都在数组中。
/**
 * @param {number[]} nums
 * @return {number}
 */
var firstMissingPositive = function (nums) {
    nums = nums.sort((a, b) => a - b).filter(v => v > 0);
    console.log('nums: ', nums);
    const n = nums.length;
    if (n === 0) return 1;
    if (nums[0] > 1) return 1;
    for (let i = 0; i < n; i++) {
        if (nums[i + 1] > nums[i] + 1) {x``
            return nums[i] + 1;
        }
    }
    return nums[n - 1] + 1;
}
const nums1 = [1, 2, 0]; // 3
const nums2 = [3, 4, -1, 1]; // 2
const nums3 = [7, 8, 9, 11, 12]; // 1
console.log('firstMissingPositive1: ', firstMissingPositive(nums1));
console.log('firstMissingPositive2: ', firstMissingPositive(nums2));
console.log('firstMissingPositive3: ', firstMissingPositive(nums3));