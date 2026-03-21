// 2、bind、call、apply 有什么区别？如何实现一个bind?/

function myBind(context) {
    if (typeof this !== 'function') {
        throw new Error('');
    }
    let args = [...arguments].slice(1);
    let fn = this;
    

    return function Fn() {
        return fn.apply(this instanceof Fn ? new fn(...arguments) : context, args.concat([...arguments]));
    }
}