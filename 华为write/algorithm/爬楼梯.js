/*
 * @Date: 2024-06-26 17:50:05
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2024-06-27 14:12:29
 * @FilePath: \leetcode-study\write\algorithm\爬楼梯.js
 */
// 斐波那契数列   爬楼梯
function climbStairs(n) {
    if (n <= 2) return n
    return climbStairs(n - 1) + climbStairs(n - 2)
}
// 优化
function climbStairs1(n, m = {}) {
    if (m[n]) {
        return m[n]
    }
    if (n <= 2) return n
    return m[n] = climbStairs(n - 1, m) + climbStairs(n - 2, m)
}

// 动态规划方法
function climbStairs2(n) {
    let dp = []
    dp[0] = 0
    dp[1] = 1
    dp[2] = 2
    for (let i = 3; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2]
    }
    return dp[n]
}

// 动态规划优化方法
function climbStairs3(n) {
    if (n <= 2) {  
        return n; // 如果 n 是 1 或 2，则只有一种或两种方法  
    }
    let pre = 1  // 到达第 n-2 阶的方法数
    let cur = 2  // 到达第 n-1 阶的方法数  
    for (let i = 3; i <= n; i++) {
        let temp = pre + cur   // 到达第 i 阶的方法数是前两个台阶方法数的和  
        pre = cur
        cur = temp
    }
    return cur
}

const result = climbStairs1(20)
console.log('%c 🍈 result: ', '', result);