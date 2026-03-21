/*
 * @Date: 2026-03-15 15:17:56
 * @LastEditors: zengfa 1051403128@qq.com
 * @LastEditTime: 2026-03-15 15:21:20
 * @FilePath: \leetcode-study\write\LeetCode100\42. 接雨水.js
 */
// 输入：height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]
// 输出：6
// 解释：上面是由数组[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1] 表示的高度图，在这种情况下，可以接 6 个单位的雨水（蓝色部分表示雨水）。 

var trap = function (height) {
    let left = 0, right = height.length - 1;
    let leftMax = 0, rightMax = 0;
    let res = 0;
    while (left < right) {
        leftMax = Math.max(leftMax, height[left]);
        rightMax = Math.max(rightMax, height[right]);
        if (height[left] < height[right]) {
            res += leftMax - height[left];
            left++;
        } else {
            res += rightMax - height[right];
            right--;
        }
    }
    return res;
}
const height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1];
console.log('trap: ', trap(height));