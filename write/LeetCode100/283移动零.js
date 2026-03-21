/*
 * @Date: 2026-03-15 14:07:52
 * @LastEditors: zengfa 1051403128@qq.com
 * @LastEditTime: 2026-03-15 14:11:17
 * @FilePath: \leetcode-study\write\LeetCode100\283.js
 */
// 给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。
// 请注意 ，必须在不复制数组的情况下原地对数组进行操作。
// 示例 1:
// 输入: nums = [0, 1, 0, 3, 12]
// 输出: [1, 3, 12, 0, 0]
var moveZeroes = function (nums) {
    let slow = 0;
    for (let fast = 0; fast < nums.length; fast++) {
        if (nums[fast] !== 0) {
            [nums[slow], nums[fast]] = [nums[fast], nums[slow]];
            slow++;
        }
    }
    return nums;
}
const nums = [0, 1, 0, 3, 12];
console.log('moveZeroes: ', moveZeroes(nums));
