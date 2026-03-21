/*
 * @Date: 2026-03-16 12:01:29
 * @LastEditors: zengfa 1051403128@qq.com
 * @LastEditTime: 2026-03-16 12:05:29
 * @FilePath: \leetcode-study\write\LeetCode100\78. 子集.js
 */
// 给你一个整数数组 nums ，数组中的元素 互不相同 。返回该数组所有可能的子集（幂集）。
// 解集 不能 包含重复的子集。你可以按 任意顺序 返回解集。
// 输入：nums = [1, 2, 3]
// 输出：[[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var subsets = function (nums) {
    const n = nums.length;
    const ans = [];
    const path = [];
    const dfs = (i) => {
        if (i === n) {
            ans.push(path.slice());
            return;
        }
        // 不选nums[i]；
        dfs(i + 1);
        path.push(nums[i]);
        // 选nums[i]；
        dfs(i + 1);
        path.pop();
    }
    dfs(0);
    return ans;
}
const nums = [1, 2, 3];
console.log(subsets(nums));