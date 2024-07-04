/*
 * @Date: 2024-06-02 19:33:56
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2024-06-02 19:37:36
 * @FilePath: \leetcode-study\华为OD\可以处理的最大任务数.js
 */
function maxNumberOfTasks(tasks) {
    // 首先按照任务的结束时间进行排序  
    tasks.sort((a, b) => a[1] - b[1]);

    // 初始化当前处理任务的日期为 0，以及处理的任务数  
    let currentDay = -1;
    let taskCount = 0;

    // 遍历排序后的任务列表  
    for (let i = 0; i < tasks.length; i++) {
        // 如果当前任务的开始时间在当前日期之后或与之相同，则可以处理该任务  
        if (tasks[i][0] >= currentDay) {
            // 处理任务，更新当前日期为当前任务的结束日期  
            taskCount++;
            currentDay = tasks[i][1];
        }
    }

    // 返回处理的任务数  
    return taskCount;
}

// 示例用法  
const tasks = [
    [1, 1],
    [1, 2],
    [1, 3]
];
console.log(maxNumberOfTasks(tasks)); // 输出: 3  
// 解释：可以处理的任务是第一个、第二个和第四个任务，因为它们可以在不重叠的时间段内完成。