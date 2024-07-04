/*
 * @Date: 2024-06-25 12:24:18
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2024-06-25 12:27:15
 * @FilePath: \leetcode-study\write\extend\index.js
 */
function Parent() {
    this.name = 'parent'
}

Parent.prototype.getName = function () {
    return this.name
}

function Child() {
    Parent.call(this)
    this.friends = [1, 3, 4]
}

function clone(Child, Parent) {
    Child.prototype = Object.create(Parent.prototype)
    Child.prototype.constructor = Child
}

clone(Child, Parent)