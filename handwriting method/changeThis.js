// call call方法的第一个参数也是this的指向，后面传入的是一个参数列表 跟apply一样，改变this指向后原函数会立即执行，且此方法只是临时改变this指向一次
Function.prototype.myCall = function(context, ...args) {
    context = context || window
    context.fn = this
    const result = context.fn(...args)
    delete context.fn
    return result
}

// apply apply接受两个参数，第一个参数是this的指向，第二个参数是函数接受的参数，以数组的形式传入改变this指向后原函数会立即执行，且此方法只是临时改变this指向一次
Function.prototype.myApply = function(context, args) {
    context = context || window
    context.fn = this
    const result = args ? context.fn(...args) : context.fn()
    delete context.fn
    return result
}

// bind bind方法和call很相似，第一参数也是this的指向，后面传入的也是一个参数列表(但是这个参数列表可以分多次传入) 
// 改变this指向后不会立即执行，而是返回一个永久改变this指向的函数
Function.prototype.myBind = function(context) {
    // console.log('arguments-myBind: ', arguments);
    const args = [...arguments].slice(1)
    const self = this
    return function Fn() {
        // console.log('arguments-fn: ', arguments);
        self.apply(this instanceof Fn ? new self(...arguments) : context, args.concat(...arguments))
    }
}

function fn(...args){
    console.log(this,args);
}
let obj = {
    myname:"张三"
}

const bindFn = fn.myBind(obj); // this 也会变成传入的obj ，bind不是立即执行需要执行一次
bindFn(1,2) // this指向obj
bindFn(3) // this指向obj
fn(1,2) // this指向window