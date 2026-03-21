/*
 * @Date: 2026-03-16 18:17:25
 * @LastEditors: zengfa 1051403128@qq.com
 * @LastEditTime: 2026-03-16 18:17:35
 * @FilePath: \leetcode-study\write\LeetCode100\75. 颜色分类.js
 */
// 给定一个包含红色、白色和蓝色、共 n 个元素的数组 nums ，原地 对它们进行排序，使得相同颜色的元素相邻，并按照红色、白色、蓝色顺序排列。
// 我们使用整数 0、 1 和 2 分别表示红色、白色和蓝色。
// 输入：nums = [2, 0, 2, 1, 1, 0]
// 输出：[0, 0, 1, 1, 2, 2]
/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var sortColors = function (nums) {
    let low = 0;
    let cur = 0;
    let high = nums.length - 1;
    while (cur <= high) {
        if (nums[cur] === 0) {
            const temp = nums[low];
            nums[low] = nums[cur];
            nums[cur] = temp;
            cur++;
            low++;
        } else if (nums[cur] === 2) {
            const temp = nums[high];
            nums[high] = nums[cur];
            nums[cur] = temp;
            high--;
        } else {
            cur++;
        }
    }
    return nums;
};
const nums = [2, 0, 2, 1, 1, 0];
console.log(sortColors(nums));