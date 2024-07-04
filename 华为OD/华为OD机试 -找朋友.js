/*
 * @Date: 2024-06-02 18:21:30
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2024-06-02 18:21:42
 * @FilePath: \leetcode-study\华为OD\华为OD机试 -找朋友.js
 */
/**
         * @param {string[]} strs
         * @return {string}
         */
 function findFriends(heights) {  
    const n = heights.length;  
    const friends = new Array(n).fill(0); // 初始化一个长度为n的数组，全部填充为0  
    const stack = []; // 单调递减栈，存储小朋友的索引  

    for (let i = 0; i < n; i++) {  
        // 当栈不为空且当前小朋友的身高高于栈顶小朋友时  
        while (stack.length > 0 && heights[i] > heights[stack[stack.length - 1]]) {  
            // 栈顶小朋友找到了他的好朋友  
            const j = stack.pop();  
            friends[j] = i + 1; // 注意索引从0开始，而题目要求从1开始，所以需要+1  
        }  
        stack.push(i); // 当前小朋友入栈  
    }  

    return friends;  
}  
