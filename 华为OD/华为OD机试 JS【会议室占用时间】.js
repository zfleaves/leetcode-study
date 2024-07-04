/*
 * @Date: 2024-06-02 19:10:07
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2024-06-02 19:10:39
 * @FilePath: \leetcode-study\华为OD\华为OD机试 JS【会议室占用时间】.js
 */
function calculateMeetingRoomOccupation(meetings) {
    // 1. 排序  
    meetings.sort((a, b) => a[0] - b[0] || a[1] - b[1]);

    let result = [];
    let currentEnd = meetings[0][1]; // 当前会议的结束时间  

    // 2. 合并区间  
    for (let i = 1; i < meetings.length; i++) {
        const [start, end] = meetings[i];
        if (start <= currentEnd) {
            // 合并区间  
            currentEnd = Math.max(currentEnd, end);
        } else {
            // 输出上一个时间段  
            result.push([meetings[i - 1][0], currentEnd]);
            // 开始新的时间段  
            currentEnd = end;
        }
    }

    // 3. 输出最后的时间段  
    result.push([meetings[meetings.length - 1][0], currentEnd]);

    return result;
}