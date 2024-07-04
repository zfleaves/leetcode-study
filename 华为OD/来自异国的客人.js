/*
 * @Date: 2024-06-02 19:49:50
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2024-06-02 19:49:59
 * @FilePath: \leetcode-study\华为OD\来自异国的客人.js
 */
function countLuckyNumbers(k, n, m) {  
    // 初始化幸运数字出现的次数  
    let count = 0;  
      
    // 转换 k 为字符串，以便于处理每一位数字  
    let kStr = k.toString(m); // 将十进制数 k 转换为 m 进制字符串  
  
    // 遍历 m 进制的每一位数字  
    for (let i = 0; i < kStr.length; i++) {  
        // 如果当前位是幸运数字 n，则增加计数  
        if (kStr[i] === n.toString(m)[0]) { // 注意 n 也需要转换为 m 进制字符串，但这里假设 n < m，所以只需取 n 的第一个字符  
            count++;  
        }  
    }  
  
    // 返回幸运数字出现的次数  
    return count;  
}  
  
// 示例用法  
const k = 10; // 以十进制计算的价格  
const n = 4; // 幸运数字  
const m = 4; // 进制  
  
const result = countLuckyNumbers(k, n, m);  
console.log(`在 ${m} 进制中，数字 ${k} 包含 ${n} 的次数为: ${result}`);