/*
 * @Date: 2026-01-29 22:12:46
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2026-01-29 22:18:48
 * @FilePath: \leetcode-study\write\compose.js
 */
/**
 * compose 函数：手动循环实现函数链式调用
 * @param  {...Function} funcs - 要组合的函数列表
 * @returns {Function} 组合后的新函数
 */
function compose(...funcs) {
    return function (initialValue) {
        let result = initialValue;
        // 从右往左遍历函数列表
        for (let i = funcs.length - 1; i >= 0; i--) {
            const currentFunc = funcs[i];
            // 验证当前项是否为函数
            if (typeof currentFunc !== 'function') {
                throw new Error(`compose 的参数必须是函数，第 ${i} 项不是函数`);
            }
            // 将前一个结果作为当前函数的参数，更新结果
            result = currentFunc(result);
        }
        return result;
    };
}

const compose1 = (...fns) => val => fns.reverse().reduce((acc, fn) => fn(acc), val);

// 测试示例
const add2 = (x) => x + 2;
const divide3 = (x) => x / 3;
const square = (x) => x * x;

// 组合函数：square → divide3 → add2
const calc = compose(add2, divide3, square);

// 执行过程：4*4=16 →16/3≈5.333 →5.333+2≈7.333
console.log(calc(4)); // 输出：≈7.333333333333333