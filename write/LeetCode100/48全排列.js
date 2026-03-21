/*
 * @Date: 2026-03-16 11:52:04
 * @LastEditors: zengfa 1051403128@qq.com
 * @LastEditTime: 2026-03-16 11:58:06
 * @FilePath: \leetcode-study\write\LeetCode100\48.js
 */
// 给定一个不含重复数字的数组 nums ，返回其 所有可能的全排列 。你可以 按任意顺序 返回答案。
// 输入：nums = [1,2,3]
// 输出：[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permute = function (nums) {
    const n = nums.length;
    if (n === 1) return [nums];
    const res = [];
    const path = [];
    const dfs = (used) => {
        if (path.length === n) {
            res.push([...path]);
            return;
        }
        for (let i = 0; i < n; i++) {
            if (used[i]) continue;
            path.push(nums[i]);
            used[i] = true;
            dfs(used);
            path.pop();
            used[i] = false;
        }
    }
    dfs([]);
    return res;
}
const nums = [1, 2, 3];
console.log(permute(nums));