/*
 * @Date: 2026-03-16 17:39:44
 * @LastEditors: zengfa 1051403128@qq.com
 * @LastEditTime: 2026-03-16 18:04:06
 * @FilePath: \leetcode-study\write\LeetCode100\215.js
 */
// 给定整数数组 nums 和整数 k，请返回数组中第 k 个最大的元素。
// 请注意，你需要找的是数组排序后的第 k 个最大的元素，而不是第 k 个不同的元素。
// 你必须设计并实现时间复杂度为 O(n) 的算法解决此问题。
// 输入: [3, 2, 1, 5, 6, 4], k = 2
// 输出: 5
// 数组中的第K个最大元素
// 1. 二分查找法（快速选择）
/**
 * 快速选择算法 - 基于快速排序的分区思想
 * 时间复杂度: 平均O(n)，最坏O(n²)
 * 空间复杂度: O(1)
 */
function findKthLargest(nums, k) {
    if (!nums || nums.length === 0 || k < 1 || k > nums.length) {
        return null;
    }
    // 第k大元素是第n-k+1小元素  排序后
    k = nums.length - k;
    let left = 0, right = nums.length - 1;

    while (left <= right) {
        // 分区操作
        const pivotIndex = partition(nums, left, right);
        if (pivotIndex === k) {
            return nums[pivotIndex];
        } else if (pivotIndex < k) {
            left = pivotIndex + 1;
        } else {
            right = pivotIndex - 1;
        }
    }
    return null;
}
/**
 * 分区函数 - 将数组分为三部分：[< pivot, pivot, > pivot]
 */
function partition(nums, left, right) {
    // 选择最右边的元素作为基准
    const pivot = nums[right];
    let i = left;

    for (let j = left; j < right; j++) {
        if (nums[j] < pivot) {
            // 将小于pivot的元素移到左边
            [nums[i], nums[j]] = [nums[j], nums[i]];
            i++;
        }
    }

    // 将pivot放到正确的位置
    [nums[i], nums[right]] = [nums[right], nums[i]];
    console.log('nums: ', nums);
    return i;
}
const nums = [3, 2, 1, 5, 6, 4], k = 2;
console.log(findKthLargest(nums, k));