// 以数组 intervals 表示若干个区间的集合，其中单个区间为 intervals[i] = [starti, endi] 。请你合并所有重叠的区间，并返回 一个不重叠的区间数组，该数组需恰好覆盖输入中的所有区间 。
// 示例 1：
// 输入：intervals = [[1, 3], [2, 6], [8, 10], [15, 18]]
// 输出：[[1, 6], [8, 10], [15, 18]]
// 解释：区间[1, 3] 和[2, 6] 重叠, 将它们合并为[1, 6].

/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
var merge = function (intervals) {
    const n = intervals.length;
    if (n <= 1) return intervals;
    intervals = intervals.sort((a, b) => a[0] - b[0]);
    let left = intervals[0][0];
    let right = intervals[0][1];
    let res = [];
    for (let i = 1; i < n; i++) {
        let cur = intervals[i];
        if (cur[0] > right) {
            res.push([left, right]);
            left = cur[0];
        }
        right = Math.max(right, cur[1]);
    }
    res.push([left, right]);
    return res;
}

const intervals = [[1, 3], [2, 6], [8, 10], [15, 18]];
console.log(merge(intervals))