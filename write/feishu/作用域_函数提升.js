/*
 * @Date: 2026-02-27 14:39:33
 * @LastEditors: zengfa 1051403128@qq.com
 * @LastEditTime: 2026-02-27 14:39:38
 * @FilePath: \leetcode-study\write\feishu\作用域 函数提升.js
 */
{
    var a = 1;
    function fn() {
        console.log(a);
        var a = 2;
    }
    fn();
    console.log(a);
    // undefined
    // 1
    // 函数 fn 内部有 var a，触发变量提升：a 被提升到函数顶部，但未赋值（值为 undefined）；
    // 执行 console.log(a) 时，访问的是函数内提升后的 a（undefined），而非全局的 a = 1（函数作用域优先）；
    // 全局 console.log(a) 访问的是全局变量 a = 1。
}
// 闭包 + 循环（小米最常考闭包题）
{
    for (var i = 0; i < 3; i++) {
        setTimeout(() => {
            console.log(i);
        }, 0);
    }
    // 3
    // 3
    // 3
    // var i 是全局变量，循环结束后 i = 3；
    // setTimeout 是宏任务，等待同步代码（循环）执行完后才执行，此时访问的 i 已是全局的 3；
}
// 改造要求（面试官必追问）：如何输出 0、1、2？
{
    // 方案1：let 块级作用域（推荐）
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            console.log(i);
        }, 0);
    }

    // 方案2：闭包包裹
    for (var i = 0; i < 3; i++) {
        (function (j) {
            setTimeout(() => {
                console.log(j);
            }, 0);
        })(i);
    }
}
// 闭包 + 词法作用域
{
    function outer() {
        let a = 10;
        function inner() {
            console.log(a);
            a++;
        }
        return inner;
    }

    const fn1 = outer();
    const fn2 = outer();

    fn1();
    fn1();
    fn2();
    // 10
    // 11
    // 10
    // 每次调用 outer() 都会创建独立的作用域，fn1 和 fn2 绑定的是不同的作用域；
    // fn1 两次调用：第一次访问 a = 10，执行 a++ 后 a = 11；第二次访问 a = 11；
    // fn2 调用：访问的是新作用域的 a = 10，和 fn1 互不影响（闭包保留的是各自的作用域）。
}
// 立即执行函数 + 闭包（小米经典题）
{
    var num = 10;
    var fn = (function (num) {
        return function () {
            console.log(num++);
        };
    })(num);

    fn();
    fn();
    console.log(num);
    // 10
    // 11
    // 10
    // 立即执行函数（IIFE）接收参数 num = 10（全局 num 的值），形成独立作用域；
    // 返回的函数闭包保留了 IIFE 内的 num，每次调用 fn() 会修改 IIFE 内的 num（而非全局）；
    // 全局 num 始终未被修改，最终输出 10。
}
// 箭头函数 + 作用域（小米高级岗常考）
{
    var a = 1;
    const obj = {
        a: 2,
        fn1: function () {
            console.log(this.a);
        },
        fn2: () => {
            console.log(this.a);
        }
    };

    obj.fn1();
    obj.fn2();
    const fn = obj.fn1;
    fn();
    // 2
    // 1
    // 1
    // fn1 是普通函数：调用 obj.fn1() 时 this 指向 obj，输出 2；
    // fn2 是箭头函数：箭头函数无自己的 this，继承外层作用域的 this（全局 window），输出全局 a = 1；
    // fn() 执行时 this 指向全局，输出 1。
}
// 闭包 + 变量生命周期（小米高级岗）
{
    function createCounter() {
        let count = 0;
        return {
            add: () => count++,
            get: () => count
        };
    }

    const counter1 = createCounter();
    const counter2 = createCounter();

    counter1.add();
    console.log(counter1.get());
    console.log(counter2.get());
    // 1
    // 0
    // createCounter 返回的箭头函数闭包保留了各自的 count 变量；
    // counter1 和 counter2 是两个独立的闭包，修改 counter1 的 count 不会影响 counter2。
}
// 变量提升：var 提升到函数 / 全局顶部，let/const 有暂时性死区；
// 闭包关键：内部函数保留外部函数的作用域，即使外部函数执行完；
// 循环闭包：var 全局作用域导致结果一致，用 let 或 IIFE 解决；
// 箭头函数：无独立 this，继承外层作用域的 this，无 arguments / 原型。