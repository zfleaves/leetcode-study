/*
 * @Date: 2024-06-02 18:58:46
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2024-06-02 18:58:53
 * @FilePath: \leetcode-study\华为OD\华为OD机试 - 结队编程.js
 */
function countValidTeams(levels) {  
    const n = levels.length;  
    let count = 0;  
  
    // 遍历所有可能的i, j, k组合  
    for (let i = 0; i < n - 2; i++) {  
        for (let j = i + 1; j < n - 1; j++) {  
            for (let k = j + 1; k < n; k++) {  
                // 检查职级关系是否满足条件  
                if ((levels[i] < levels[j] && levels[j] < levels[k]) ||  
                    (levels[i] > levels[j] && levels[j] > levels[k])) {  
                    count++; // 满足条件，增加计数  
                }  
            }  
        }  
    }  
  
    return count;  
}  
  
// 示例用法  
const levels = [1, 2, 3, 4, 5]; // 假设的职级数组  
const result = countValidTeams(levels);  
console.log(result); // 输出满足条件的结队编程组合数量