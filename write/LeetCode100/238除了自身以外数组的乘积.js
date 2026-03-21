/*
 * @Date: 2026-03-15 18:29:21
 * @LastEditors: zengfa 1051403128@qq.com
 * @LastEditTime: 2026-03-15 18:29:32
 * @FilePath: \leetcode-study\write\LeetCode100\238. 除了自身以外数组的乘积.js
 */
// 给你一个整数数组 nums，返回 数组 answer ，其中 answer[i] 等于 nums 中除了 nums[i] 之外其余各元素的乘积 。

// 题目数据 保证 数组 nums之中任意元素的全部前缀元素和后缀的乘积都在  32 位 整数范围内。

// 请 不要使用除法，且在 O(n) 时间复杂度内完成此题。
// 输入: nums = [1, 2, 3, 4]
// 输出: [24, 12, 8, 6]
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var productExceptSelf = function (nums) {
    // 所获取数组每个值 等于 该下标  左边乘积 * 右边乘积
    const n = nums.length;
    const answer = new Array(n);
    answer[0] = 1;
    // 左边乘积之和
    for (let i = 1; i < n; i++) {
        answer[i] = answer[i - 1] * nums[i - 1];
    }
    // 右边乘积之和
    let R = 1;
    for (let i = n - 2; i >= 0; i--) {
        R *= nums[i + 1];
        answer[i] *= R;
    }
    return answer;
}
console.log(productExceptSelf(nums = [1, 2, 3, 4]));