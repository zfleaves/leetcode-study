/*
 * @Date: 2024-06-02 19:54:46
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2024-06-02 19:56:20
 * @FilePath: \leetcode-study\华为OD\华为OD机试真题-Wonderland.js
 */
function mincostTickets(costs, days) {
    const n = days.length;
    const dp = new Array(366).fill(0); // 动态规划数组  
    const travel = new Array(366).fill(false); // 标记游玩日期  

    // 标记游玩日期  
    for (let day of days) {
        travel[day] = true;
    }

    // 动态规划计算最低消费  
    for (let i = 1; i <= 365; i++) {
        if (!travel[i]) {
            dp[i] = dp[i - 1];
            continue;
        }

        // 初始化dp[i]为单日票的费用  
        dp[i] = dp[i - 1] + costs[0];

        // 比较一日票  
        dp[i] = Math.min(dp[i], (dp[Math.max(0, i - 1)] || 0) + costs[0]);

        // 注意JavaScript中的数组索引从0开始，并且我们没有costs[3]，只有costs[0], costs[1], costs[2]（单日、三日、周票）  
        // 比较三日票  
        dp[i] = Math.min(dp[i], (dp[Math.max(0, i - 3)] || 0) + costs[1]);

        // 比较周票  
        dp[i] = Math.min(dp[i], (dp[Math.max(0, i - 7)] || 0) + costs[2]);

        // 原始Java代码中的月票部分在JavaScript版本中被移除，因为我们只有三个类型的票  
    }

    return dp[365]; // 返回完成游玩计划的最低消费  
}

// 示例使用  
const costs = [5, 14, 30, 100]; // 假设我们有单日票、三日票和周票的价格  
const days = [13, 15, 20, 21, 200, 202, 230]; // 游玩日期  
console.log(mincostTickets(costs, days)); // 输出最低消费