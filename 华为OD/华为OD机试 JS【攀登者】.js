/*
 * @Date: 2024-06-02 18:39:52
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2024-06-02 18:39:59
 * @FilePath: \leetcode-study\华为OD\华为OD机试 JS【攀登者】.js
 */
function countPeaks(heights) {
    let peakCount = 0;
    for (let i = 1; i < heights.length - 1; i++) {
        if (heights[i] > heights[i - 1] && heights[i] > heights[i + 1]) {
            peakCount++;
        }
    }

    // 处理边界情况  
    if (heights[0] > heights[1]) peakCount++;
    if (heights[heights.length - 1] > heights[heights.length - 2]) peakCount++;

    return peakCount;
}

// 示例  
let heights = [0, 1, 2, 4, 3, 1, 0, 0, 1, 2, 3, 1, 2, 1, 0];
console.log(countPeaks(heights)); // 输出应为山峰的数量，例如：2