/*
 * @Date: 2026-02-26 18:27:13
 * @LastEditors: zengfa 1051403128@qq.com
 * @LastEditTime: 2026-02-26 18:57:55
 * @FilePath: \leetcode-study\write\feishu\1-10.js
 */
// 使用 Promise 实现红绿灯交替重复亮，红灯 3 秒亮一次，绿灯 2 秒亮一次，黄灯 1 秒亮一次；如何让三个灯不断交替重复亮灯？
{
    function red() {
        console.log('red');
    }
    function green() {
        console.log('green');
    }
    function yellow() {
        console.log('yellow');
    }

    const light = (time, cb) => {
        return new Promise((resolve) => {
            cb();
            setTimeout(() => {
                resolve();
            }, time)
        })
    }

    const step = function() {
        Promise.resolve().then(() => {
            light(3000, red);
        }).then(() => {
            light(2000, green);
        }).then(() => {
            light(1000, yellow)
        }).then(() => {
            step();
        })
    }
    step();
}