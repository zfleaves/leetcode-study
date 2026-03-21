// 给你一个整数数组 coins ，表示不同面额的硬币；以及一个整数 amount ，表示总金额。
// 计算并返回可以凑成总金额所需的 最少的硬币个数 。如果没有任何一种硬币组合能组成总金额，返回 - 1 。
// 你可以认为每种硬币的数量是无限的。
// 输入：coins = [1, 2, 5], amount = 11
// 输出：3
// 解释：11 = 5 + 5 + 1
/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
var coinChange = function (coins, amount) {
    if (amount === 0) return 0;

    // 修正1：应该用 amount+1 或 Infinity
    const dp = new Array(amount + 1).fill(amount + 1);
    dp[0] = 0;
    for (let i = 1; i <= amount; i++) {
        for (const coin of coins) {
            // 修正3：正确的条件判断
            if (i >= coin) { // 如果 i >= coin，意味着我们可以使用这个硬币
                // 修正4：正确的递推公式
                // dp[i] 可能已经是前面硬币计算的结果
                // 比较：当前已知最少硬币数 vs 使用当前硬币后的硬币数
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }

    // 修正5：比较条件
    return dp[amount] === amount + 1 ? -1 : dp[amount];
};
const coins = [1, 2, 5], amount = 11;
console.log(coinChange(coins, amount));