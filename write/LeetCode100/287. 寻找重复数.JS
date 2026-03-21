/*
 * @Date: 2026-03-17 21:14:38
 * @LastEditors: zengfa 1051403128@qq.com
 * @LastEditTime: 2026-03-17 21:14:49
 * @FilePath: \leetcode-study\write\LeetCode100\287. 寻找重复数.JS
 */
// 给定一个包含 n + 1 个整数的数组 nums ，其数字都在[1, n] 范围内（包括 1 和 n），可知至少存在一个重复的整数。
// 假设 nums 只有 一个重复的整数 ，返回 这个重复的数 。
// 你设计的解决方案必须 不修改 数组 nums 且只用常量级 O(1) 的额外空间。
// 输入：nums = [1, 3, 4, 2, 2]
// 输出：2
/**
 * @param {number[]} nums
 * @return {number}
 */
// 代码逻辑同 142. 环形链表 II
var findDuplicate = function (nums) {
    let slow = 0, fast = 0;
    while(true) {
        slow = nums[slow];
        fast = nums[nums[fast]];
        if (slow === fast) break;
    }
    let head = 0;
    while (slow !== head) {
        slow = nums[slow];
        head = nums[head];
    }
    return slow;
}
const nums = [1, 3, 4, 2, 2];
console.log(findDuplicate(nums));