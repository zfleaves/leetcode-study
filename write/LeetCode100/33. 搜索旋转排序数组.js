/*
 * @Date: 2026-03-16 13:21:42
 * @LastEditors: zengfa 1051403128@qq.com
 * @LastEditTime: 2026-03-16 14:53:32
 * @FilePath: \leetcode-study\write\LeetCode100\33. 搜索旋转排序数组.js
 */
// 整数数组 nums 按升序排列，数组中的值 互不相同 。
// 在传递给函数之前，nums 在预先未知的某个下标 k（0 <= k < nums.length）上进行了 向左旋转，使数组变为[nums[k], nums[k + 1], ..., nums[n - 1], nums[0], nums[1], ..., nums[k - 1]]（下标 从 0 开始 计数）。例如，[0, 1, 2, 4, 5, 6, 7] 下标 3 上向左旋转后可能变为[4, 5, 6, 7, 0, 1, 2] 。
// 给你 旋转后 的数组 nums 和一个整数 target ，如果 nums 中存在这个目标值 target ，则返回它的下标，否则返回 - 1 。
// 你必须设计一个时间复杂度为 O(log n) 的算法解决此问题。
// 输入：nums = [4, 5, 6, 7, 0, 1, 2], target = 0
// 输出：4
// 输入：nums = [4, 5, 6, 7, 0, 1, 2], target = 3
// 输出：-1
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function (nums, target) {
    const n = nums.length;
    let left = -1, right = n;
    const last = nums[n - 1];
    while(left + 1 < right) {
        const mid = Math.floor((left + right) / 2);
        console.log('mid: ', mid);
        if (target > last && nums[mid] <= last) {
            right = mid;
        } else if (target <= last && nums[mid] > last) {
            left = mid;
        } else if (nums[mid] < target) {
            left = mid;
        } else {
            right = mid;
        }
    }
    return nums[right] === target ? right : -1;
}
const nums1 = [4, 5, 6, 7, 0, 1, 2], target1 = 0;
const nums2 = [4, 5, 6, 7, 0, 1, 2], target2 = 3;
console.log(search(nums1, target1));
console.log(search(nums2, target2));