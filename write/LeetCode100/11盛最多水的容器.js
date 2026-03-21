/*
 * @Date: 2026-03-15 14:14:14
 * @LastEditors: zengfa 1051403128@qq.com
 * @LastEditTime: 2026-03-15 14:44:47
 * @FilePath: \leetcode-study\write\LeetCode100\11.js
 */
// 给定一个长度为 n 的整数数组 height 。有 n 条垂线，第 i 条线的两个端点是(i, 0) 和(i, height[i]) 。

// 找出其中的两条线，使得它们与 x 轴共同构成的容器可以容纳最多的水。

// 返回容器可以储存的最大水量。

// 说明：你不能倾斜容器。
// 输入：[1, 8, 6, 2, 5, 4, 8, 3, 7]
// 输出：49
var maxArea = function (height) {
    let left = 0, right = height.length - 1;
    let ans = 0;
    while (left <= right) {
        let curArea = (right - left) * Math.min(height[left], height[right]);
        ans = Math.max(ans, curArea);
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    return ans;
}

const height = [1, 8, 6, 2, 5, 4, 8, 3, 7];
console.log('maxArea: ', maxArea(height));