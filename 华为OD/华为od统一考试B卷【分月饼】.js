/*
 * @Date: 2024-06-02 18:43:13
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2024-06-02 18:43:20
 * @FilePath: \leetcode-study\华为OD\华为od统一考试B卷【分月饼】.js
 */
function distributeMooncakes(m, n, currentDistribution, index, maxDiff, count) {  
    // 如果已经分配了所有月饼或所有员工  
    if (index === m || n === 0) {  
        // 检查是否所有员工都至少分到了一个月饼  
        if (currentDistribution.every(item => item >= 1)) {  
            // 检查是否满足Max(i) - Max(i+1) <= 3  
            for (let i = 0; i < m - 1; i++) {  
                if (currentDistribution[i] - currentDistribution[i + 1] > maxDiff) {  
                    return; // 剪枝  
                }  
            }  
            count.value++; // 找到一个有效的分配方式  
        }  
        return;  
    }  
  
    // 尝试给当前员工分配1到剩余月饼数的月饼  
    for (let i = 1; i <= n; i++) {  
        currentDistribution[index] = i;  
        distributeMooncakes(m, n - i, currentDistribution, index + 1, maxDiff, count);  
    }  
}  
  
function countMooncakeDistributions(m, n) {  
    let count = { value: 0 }; // 使用对象来封装count，以便在回调中修改  
    let currentDistribution = new Array(m).fill(0); // 初始化当前分配方案  
  
    distributeMooncakes(m, n, currentDistribution, 0, 3, count);  
  
    return count.value;  
}  
  
// 示例调用  
console.log(countMooncakeDistributions(3, 10)); // 输出应为某种计算得到的分配方法数