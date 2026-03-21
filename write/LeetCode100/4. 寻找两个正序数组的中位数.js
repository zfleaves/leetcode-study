// 给定两个大小分别为 m 和 n 的正序（从小到大）数组 nums1 和 nums2。请你找出并返回这两个正序数组的 中位数 。

// 算法的时间复杂度应该为 O(log(m + n)) 。
// 输入：nums1 = [1, 3], nums2 = [2]
// 输出：2.00000
// 解释：合并数组 = [1, 2, 3] ，中位数 2
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findMedianSortedArrays = function (a, b) {
    // 比较较短值
    if (a.length < b.length) {
        [a, b] = [b, a];
    }
    const m = a.length, n = b.length;
    a = [-Infinity, ...a, Infinity];
    b = [-Infinity, ...b, Infinity];

    let left = 0, right = m + 1;
    while (left + 1 < right) { // 开区间 (left, right) 不为空
        const i = Math.floor((left + right) / 2);
        const j = Math.floor((m + n + 1) / 2) - i;
        if (a[i] <= b[j + 1]) {
            left = i;
        } else {
            // a[i]太大了，应该被放在右侧
            right = i;
        }
    }
    // 此时 left 等于 right-1
    // a[left] <= b[j+1] 且 a[right] > b[(j-1)+1] = b[j]，所以答案是 i=left
    const i = left;
    const j = Math.floor((m + n + 1) / 2) - i;
    const max1 = Math.max(a[i], b[j]);
    const max2 = Math.min(a[i + 1], b[j + 1]); // 偶数

    return (m + n) % 2 ? max1 : (max1 + max2) / 2;
}
const nums1 = [1, 2], nums2 = [3, 4];
console.log(findMedianSortedArrays(nums1, nums2));