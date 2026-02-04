/*
 * @Date: 2026-01-29 13:54:22
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2026-01-29 13:59:47
 * @FilePath: \leetcode-study\write\extend.js
 */
// 寄生组合式继承
function clone(parent, child) {
    child.prototype = Object.create(parent.prototype);
    // 手动挂上构造器，指向自己的构造函数
    child.prototype.constructor = child;
}

function Parent() {
    this.name = 'parent';
    this.play = [1, 2, 3];
}

Parent.prototype.getName = function () {
    return this.name;
}

function Child() {
    Parent.call(this);
    this.friends = 'child5';
}

clone(Parent, Child);

Child.prototype.getFriends = function () {
    return this.friends;
}

let person = new Child();
console.log(person); //{friends:"child5",name:"child5",play:[1,2,3],__proto__:Parent6}
console.log(person.getName()); // parent6
console.log(person.getFriends()); // child5