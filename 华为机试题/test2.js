/*
 * @Date: 2024-05-31 21:30:57
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2024-06-02 16:52:54
 * @FilePath: \leetcode-study\华为机试题\test2.js
 */
function sumSurvivors(nums, jump, left) {  
    // 创建一个数组来记录哪些数字是幸存的  
    let survivors = new Array(nums.length).fill(true);  
      
    // 跳跃和淘汰的循环  
    let currentIndex = 0
    let step = 0
    while (nums.length > left) {  
        const nextIndex = (currentIndex + jump + 1) % nums.length
        currentIndex = nextIndex  - 1
        nums.splice(nextIndex, 1)
        step++
    }  
      
    const nextIndex = currentIndex + jump + 1
    nums.splice(nextIndex, 1)
    console.log('nums: ', nums);
    // 计算幸存数的和  
    let sum = 0;  
    for (let i = 0; i < nums.length; i++) {  
        if (survivors[i]) {  
            sum += nums[i];  
        }  
    }  
      
    return sum;  
}  
  
// 示例用法  
let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];  
let jump = 4;  
let left = 3;  
  
console.log(sumSurvivors(nums, jump, left)); // 输出应该是幸存数的和