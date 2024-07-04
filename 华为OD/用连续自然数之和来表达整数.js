/*
 * @Date: 2024-06-02 18:51:34
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2024-06-02 18:51:41
 * @FilePath: \leetcode-study\华为OD\用连续自然数之和来表达整数.js
 */
function findConsecutiveSums(T) {  
    let expressions = []; // 用于存储所有表达式的数组  
    let minCount = Infinity; // 用于记录自然数个数最少的表达式的数量  
  
    // 从1开始尝试不同的起始点  
    for (let start = 1; start <= T / 2; start++) { // 最多只需要检查到T/2，因为超过这个数，和会迅速增长  
        let sum = 0;  
        let count = 0;  
        let current = start;  
  
        // 计算以start为起始的连续自然数之和  
        while (sum < T) {  
            sum += current;  
            current++;  
            count++;  
  
            // 如果和等于T，则找到了一组解  
            if (sum === T) {  
                // 检查这组解是否比之前找到的更优  
                if (count < minCount) {  
                    expressions = [[...Array(count).keys()].map(i => start + i)]; // 重置表达式数组  
                    minCount = count;  
                } else if (count === minCount) {  
                    expressions.push([...Array(count).keys()].map(i => start + i)); // 添加相同长度的解  
                }  
  
                // 跳出内层循环，因为已经找到一组和为T的连续自然数  
                break;  
            }  
  
            // 如果和已经超过T，则无需继续检查更大的数  
            if (sum > T) {  
                break;  
            }  
        }  
    }  
  
    // 打印所有表达式  
    for (let expr of expressions) {  
        console.log(expr.join(' + '));  
    }  
  
    // 输出结果  
    console.log(`Result: ${expressions.length}`);  
}  
  
// 示例用法  
findConsecutiveSums(15);