// 给你一个整数数组 nums 和一个整数 k ，请你统计并返回 该数组中和为 k 的子数组的个数 。
// 子数组是数组中元素的连续非空序列。
// 示例 1：

// 输入：nums = [1, 1, 1], k = 2
// 输出：2
// 示例 2：

// 输入：nums = [1, 2, 3], k = 3
// 输出：2
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var subarraySum = function (nums, k) {
    const n = nums.length;
    // 创建前缀和数组 s，长度 n+1，s[0] = 0
    let s = new Array(n + 1).fill(0);
    for (let i = 0; i < n; i++) {
        s[i + 1] = s[i] + nums[i]; // 计算前缀和
    }

    let ans = 0;
    const map = new Map(); // 哈希表，用于存储前缀和及其出现次数
    for (const x of s) { // 遍历每一个前缀和
        // 我们需要找之前的前缀和 y，使得 x - y = k，即 y = x - k
        // 从 map 中查找之前出现过的前缀和 (x - k) 的次数
        ans += map.get(x - k) ?? 0;
        // 将当前前缀和 x 加入 map，记录其出现次数
        map.set(x, (map.get(x) ?? 0) + 1);
    }
    return ans;
}