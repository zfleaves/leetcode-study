/*
 * @Date: 2026-02-26 20:46:20
 * @LastEditors: zengfa 1051403128@qq.com
 * @LastEditTime: 2026-02-26 20:47:30
 * @FilePath: \leetcode-study\write\feishu\myNew.js
 */
function myNew(Func, ...args) {
    // 1.创建一个新对象
    const obj = {}
    // 2.新对象原型指向构造函数原型对象
    obj.__proto__ = Func.prototype
    // 3.将构建函数的this指向新对象
    let result = Func.apply(obj, args);
    // 4.根据返回值判断
    return result instanceof Object ? result : obj;
}