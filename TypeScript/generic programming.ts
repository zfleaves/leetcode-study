/*
 * @Date: 2024-05-22 22:04:14
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2024-05-22 22:10:46
 * @FilePath: \leetcode-study\TypeScript\generic programming.ts
 */
// 假设我们用一个函数，它可接受一个 number 参数并返回一个number 参数，如下写法：
function returnItemNumber(para: number): number {
    return para
}

// 如果我们打算接受一个 string 类型，然后再返回 string类型，则如下写法：
function returnItemString(para: string): string {
    return para
}

// 上述两种编写方式，存在一个最明显的问题在于，代码重复度比较高
// 虽然可以使用 any类型去替代，但这也并不是很好的方案，因为我们的目的是接收什么类型的参数返回什么类型的参数，即在运行时传入参数我们才能确定类型
function returnItem<T>(para: T): T {
    return para
}
// function returnItem<"2">(para: "2"): "2"
const getReturnItem = returnItem('2')


// 使用方式
// 泛型通过<>的形式进行表述，可以声明：
// 函数声明
function returnItemFunction<T>(para: T): T {
    return para
}
// 定义泛型的时候，可以一次定义多个类型参数，比如我们可以同时定义泛型 T 和 泛型 U：
function swap<T, U>(tuple: [T, U]): [U, T] {
    return [tuple[1], tuple[0]];
}

swap([7, 'seven']); // ['seven', 7]


// 接口声明
interface ReturnItemFn<T> {
    (para: T): T
}
// 那么当我们想传入一个number作为参数的时候，就可以这样声明函数:
const returnItemInterface: ReturnItemFn<number> = para => para


// 类声明
// 使用泛型声明类的时候，既可以作用于类本身，也可以作用与类的成员函数
class Stack<T> {
    private arr: T[] = []

    public push(item: T) {
        this.arr.push(item)
    }

    public pop() {
        this.arr.pop()
    }
}
const stack = new Stack<number>()
stack.push(3)


// 索引类型、约束类型
// 索引类型 keyof T 把传入的对象的属性类型取出生成一个联合类型，这里的泛型 U 被约束在这个联合类型中，如下所示：
function getValue<T extends object, U extends keyof T>(obj: T, key: U) {
    return obj[key] // ok
}
// 上述为什么需要使用泛型约束，而不是直接定义第一个参数为 object类型，是因为默认情况 object 指的是{}，
// 而我们接收的对象是各种各样的，一个泛型来表示传入的对象类型，比如 T extends object
const a = {
    name: 'huihui',
    age: 18
}
// getValue(obj: { name: string; age: number; }, key: "name" | "age"): string | number
// getValue(a,)

function logLength<T extends { length: number }>(arg: T): void {
    console.log(arg.length);
}

logLength('hello'); // 输出 5  
logLength([1, 2, 3]); // 输出 3  

// 下面的调用会导致编译错误，因为 number 类型没有 length 属性  
// logLength(123); // 编译错误

// 多类型约束
// 例如如下需要实现两个接口的类型约束
interface FirstInterface {
    doSomething(): number
}

interface SecondInterface {
    doSomethingElse(): string
}
// 可以创建一个接口继承上述两个接口，如下：
interface ChildInterface extends FirstInterface, SecondInterface {

}

// 正确使用如下
class Demo<T extends ChildInterface> {
    private genericProperty: T

    constructor(genericProperty: T) {
        this.genericProperty = genericProperty
    }
    useT() {
        this.genericProperty.doSomething()
        this.genericProperty.doSomethingElse()
    }
}
// 交叉类型（Intersection Types） 这可以通过 & 符号来实现
class Demo1<T extends FirstInterface & SecondInterface> {
    private genericProperty: T

    constructor(genericProperty: T) {
        this.genericProperty = genericProperty
    }
    useT() {
        this.genericProperty.doSomething()
        this.genericProperty.doSomethingElse()
    }
}