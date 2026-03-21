/*
 * @Date: 2026-03-16 13:01:29
 * @LastEditors: zengfa 1051403128@qq.com
 * @LastEditTime: 2026-03-16 13:12:32
 * @FilePath: \leetcode-study\write\LeetCode100\35. 搜索插入位置.js
 */
// 给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。如果目标值不存在于数组中，返回它将会被按顺序插入的位置。
// 请必须使用时间复杂度为 O(log n) 的算法。
// 输入: nums = [1, 3, 5, 6], target = 5
// 输出: 2
// 输入: nums = [1, 3, 5, 6], target = 2
// 输出: 1
// 输入: nums = [1, 3, 5, 6], target = 7
// 输出: 4
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var searchInsert = function (nums, target) {
    let left = 0, right = nums.length - 1; // 闭区间
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (nums[mid] === target) return mid;
        if (nums[mid] < target) {
            left = mid + 1;  // 范围缩小到 [mid+1, right]
        } else {
            right = mid - 1; // 范围缩小到 [left, mid-1]
        }
    }
    // 循环结束时，left恰好是第一个 >= target的索引，right指向其前一个位置（left = right + 1）。
    return left;
}
const nums1 = [1, 3, 5, 6], target1 = 5; // 2
const nums2 = [1, 3, 5, 6], target2 = 2; // 1
const nums3 = [1, 3, 5, 6], target3 = 7; // 4
console.log(searchInsert(nums1, target1));
console.log(searchInsert(nums2, target2));
console.log(searchInsert(nums3, target3));