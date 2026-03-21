/*
 * @Date: 2026-02-24 20:06:23
 * @LastEditors: zengfa 1051403128@qq.com
 * @LastEditTime: 2026-02-24 20:27:00
 * @FilePath: \leetcode-study\write\myInstanceof.js
 */
function myInstanceof(left, right) {
    if (typeof left !== 'object' || left === null) return false;

    let proto = Object.getPrototypeOf(left);

    while (true) {
        if (proto === null) return false;
        if (proto === right.prototype) return true;
        
        proto = Object.getPrototypeOf(proto);
    }
}

function myNew(Func, ...args) {
    const obj = {};

    obj._proto = Func.prototype;

    let result = Func.apply(obj, args);

    return result instanceof Object ? result : obj;
}

function Person(name, age) {
    this.name = name;
    this.age = age;
}
Person.prototype.say = function () {
    console.log(this.name)
}

let p = mynew(Person, "huihui", 123)
console.log(p) // Person {name: "huihui", age: 123}
p.say() // huihui

