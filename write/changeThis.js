/*
 * @Date: 2026-01-28 21:01:05
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2026-01-28 21:12:32
 * @FilePath: \leetcode-study\write\changeThis.js
 * @Description: 手动实现 Function.prototype 上的 apply、call、bind 方法
 */

/**
 * 实现 apply 方法
 * 功能：调用函数，并指定函数内部的 this 值，参数以数组形式传入
 * @param {Object} context - 指定的 this 上下文对象
 * @param {Array} args - 参数数组
 * @returns {*} 函数执行结果
 */
Function.prototype.myApply = function (context, args) {
    // 如果 context 为 null 或 undefined，则默认为 window
    context = context || window;
    // 将当前函数作为 context 的一个临时属性 fn
    // 这样调用 context.fn() 时，函数内部的 this 就指向 context
    context.fn = this;
    // 执行函数：如果有参数数组则展开传入，否则直接调用
    const result = args ? context.fn(args) : context.fn();
    // 删除临时属性，避免污染 context 对象
    // 注意：这里应该删除 context.fn 而不是 result.fn
    delete context.fn;
    return result;
}

/**
 * 实现 call 方法
 * 功能：调用函数，并指定函数内部的 this 值，参数以列表形式传入
 * @param {Object} context - 指定的 this 上下文对象
 * @param {...*} args - 参数列表
 * @returns {*} 函数执行结果
 */
Function.prototype.myCall = function (context, ...args) {
    // 如果 context 为 null 或 undefined，则默认为 window
    context = context || window;
    // 将当前函数作为 context 的一个临时属性 fn
    // 这样调用 context.fn() 时，函数内部的 this 就指向 context
    context.fn = this;
    // 执行函数，使用展开运算符将参数列表传入
    const result = context.fn(...args);
    // 删除临时属性，避免污染 context 对象
    // 注意：这里应该删除 context.fn 而不是 result.fn
    delete context.fn;
    return result;
}

/**
 * 实现 bind 方法
 * 功能：创建一个新函数，当被调用时，其 this 值为指定的值
 * 支持参数绑定（部分应用）和 new 调用
 * @param {Object} context - 指定的 this 上下文对象
 * @returns {Function} 绑定后的新函数
 */
Function.prototype.myBind = function (context) {
    // 如果 context 为 null 或 undefined，则默认为 window
    context = context || window;
    // 获取绑定时的参数（从第二个参数开始）
    const args = [...arguments].slice(1);
    // 保存当前函数的引用（即要绑定的原始函数）
    const self = this;
    // 返回一个新函数 Fn
    return function Fn() {
        // 判断是否被 new 调用
        // 当使用 new 调用 Fn 时，this 是 Fn 的实例，也是 self 的实例（因为原型继承）
        // instanceof 检查：this instanceof self 可以判断是否通过 new 调用
        return self.apply(this instanceof Fn ? new self(...arguments) : context, args.concat(...arguments)); 
    };
}