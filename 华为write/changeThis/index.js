Function.prototype.myApply = function (context, args) {
    context = context || window
    context.fn = this
    const result = args ? context.fn(args) : context.fn()
    delete result.fn
    return result
}

Function.prototype.myCall = function (context, ...args) {
    context = context || window
    context.fn = this
    const result = context.fn(...args)
    delete result.fn
    return result
}

Function.prototype.myBind = function (context) {
    context = context || window
    const args = [...arguments].slice(1)
    const self = this
    return function Fn() {
        return self.apply(self instanceof Fn ? new self(...arguments) : context, args.concat(...arguments))
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