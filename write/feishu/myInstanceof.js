// 请手写实现 instanceof，并说明其工作原理

function myInstanceof(left, right) {
    // 获取right的原型
    let prototype = right.prototype;
    // 获取left 的原型链
    left = left.__proto__;
    // 遍历原型链
    while(true) {
        if (left === null) return false;
        if (left === prototype) return true;

        left = left.__proto__;
    }
}

// 测试
function Person() { }
const person = new Person();

console.log(myInstanceof(person, Person)); // true
console.log(myInstanceof(person, Object)); // true
console.log(myInstanceof(person, Array)); // false