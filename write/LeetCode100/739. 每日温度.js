// 给定一个整数数组 temperatures ，表示每天的温度，返回一个数组 answer ，其中 answer[i] 是指对于第 i 天，下一个更高温度出现在几天后。如果气温在这之后都不会升高，请在该位置用 0 来代替。

// 输入: temperatures = [73, 74, 75, 71, 69, 72, 76, 73]
// 输出: [1, 1, 4, 2, 1, 1, 0, 0]
/**
 * @param {number[]} temperatures
 * @return {number[]}
 */
var dailyTemperatures = function(temperatures) {
    const n = temperatures.length;
    const ans = new Array(n).fill(0);
    const stack = [];
    for (let i = 0; i < n; i++) {
        const t = temperatures[i];
        while (stack.length && t > temperatures[stack[stack.length - 1]]) {
            const j = stack.pop();
            ans[j] = i - j;
        }
        stack.push(i);
    }
    return ans;
}
const temperatures = [73, 74, 75, 71, 69, 72, 76, 73];
console.log(dailyTemperatures(temperatures)); // [1, 1, 4, 2, 1, 1, 0, 0]