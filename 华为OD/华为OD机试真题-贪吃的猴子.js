/*
 * @Date: 2024-06-02 18:45:05
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2024-06-02 18:49:43
 * @FilePath: \leetcode-study\华为OD\华为OD机试真题-贪吃的猴子.js
 */
function rob(numbers, N) {  
    // 如果数组为空或只有一个元素，直接返回数组中的值  
    if (numbers.length === 0) return 0;  
    if (numbers.length === 1) return Math.min(N, 1) * numbers[0]; // 注意N次数的限制  
  
    // 如果可以取走的次数大于或等于数组长度，则直接取走所有香蕉  
    if (N >= numbers.length) {  
        let max = 0;  
        for (let num of numbers) {  
            max += num;  
        }  
        return max;  
    }  

    // 动态规划数组，dp[i] 表示取走前 i 串香蕉时的最大数量  
    let dp = new Array(N + 1).fill(0);  
    dp[0] = 0; // 不取任何香蕉  
    dp[1] = numbers[0]; // 取第一串香蕉  
  
    // 从第二串开始遍历  
    for (let i = 2; i <= N && i <= numbers.length; i++) {  
        // 取当前串或不取当前串，取两者中的较大值  
        dp[i] = Math.max(dp[i - 1], dp[i - 2] + numbers[i - 1]);  
    }  
  
    // 注意，由于我们是从1开始填充dp数组的，所以最后要返回dp[N]（而不是dp[N+1]）  
    return dp[N < numbers.length ? N : numbers.length];  
}  

// 示例输入  
const numbers = [1, 2, 2, 7, 3, 6, 1];
const N = 3;

// 调用函数并输出结果  
console.log(rob(numbers, N)); // 输出应为 10