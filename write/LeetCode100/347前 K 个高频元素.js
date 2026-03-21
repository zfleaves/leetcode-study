/*
 * @Date: 2026-03-16 19:00:15
 * @LastEditors: zengfa 1051403128@qq.com
 * @LastEditTime: 2026-03-16 19:02:16
 * @FilePath: \leetcode-study\write\LeetCode100\347.js
 */
// 给你一个整数数组 nums 和一个整数 k ，请你返回其中出现频率前 k 高的元素。你可以按 任意顺序 返回答案。
// 输入：nums = [1, 1, 1, 2, 2, 3], k = 2

// 输出：[1, 2]
var topKFrequent = function (nums, k) {
    // 第一步：统计每个元素的出现次数
    const cnt = new Map();
    for (const x of nums) {
        cnt.set(x, (cnt.get(x) ?? 0) + 1);
    }
    const maxCnt = Math.max(...cnt.values());
    console.log('maxCnt: ', maxCnt);

    // 第二步：把出现次数相同的元素，放到同一个桶中
    const buckets = Array.from({ length: maxCnt + 1 }, () => []);
    console.log('cnt.entries(): ', cnt.entries());
    for (const [x, c] of cnt.entries()) {
        buckets[c].push(x);
    }
    console.log('buckets: ', buckets);

    // 第三步：倒序遍历 buckets，把出现次数前 k 大的元素加入答案
    const ans = [];
    // 注意题目保证答案唯一，一定会出现某次 push 后 ans.length 恰好等于 k 的情况
    for (let i = maxCnt; i >= 0 && ans.length < k; i--) {
        ans.push(...buckets[i]);
    }
    return ans;
};
const nums = [1, 1, 1, 2, 2, 3], k = 2;
console.log(topKFrequent(nums, k));