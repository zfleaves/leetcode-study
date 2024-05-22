// 跟javascript 定义函数十分相似，可以通过funciton 关键字、箭头函数等形式去定义，例如下面一个
const add = (a: number, b: number) => a + b

// 当我们没有提供函数实现的情况下，有两种声明函数类型的方式，如下所示
// 方式一
type LongHand = {
    (a: number): number;
};

// 方式二
type ShortHand = (a: number) => number;

// 剩余类型
// 如果剩余参数 rest 是一个由number类型组成的数组，则如下表示：
const addRest = (a: number, ...rest: number[]) => rest.reduce(((a, b) => a + b), a)

// 函数重载
// 上边是声明
// function add (arg1: string, arg2: string): string
// function add (arg1: number, arg2: number): number
// 因为我们在下边有具体函数的实现，所以这里并不需要添加 declare 关键字

// 下边是实现
function addHeavyLoad (arg1: string | number, arg2: string | number) {
  // 在实现上我们要注意严格判断两个参数的类型是否相等，而不能简单的写一个 arg1 + arg2
  if (typeof arg1 === 'string' && typeof arg2 === 'string') {
    return arg1 + arg2
  } else if (typeof arg1 === 'number' && typeof arg2 === 'number') {
    return arg1 + arg2
  }
}