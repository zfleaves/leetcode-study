/*
 * @Date: 2024-05-22 21:42:58
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2024-05-22 21:51:59
 * @FilePath: \leetcode-study\TypeScript\interface.ts
 */
// 接口定义如下：
interface interface_name {
}

interface User {
    name?: string
    age?: number // 采用可选属性
    readonly isMale?: boolean // 只读属性
    say?: (words: string) => string
    [propName: string]: any; // 给接口添加字符串索引签名
}

const user: User = {
    name: '222',
    isMale: false
}
// user.isMale = true   无法分配到 "isMale" ，因为它是只读属性。

const getUserName = (user: User) => user.name
getUserName({color: 'yellow'} as User) // 类型推断

// 接口还能实现继承
interface Father {
    color: String
}

interface Mother {
    height: Number
}
// 也可以继承多个，父类通过逗号隔开，如下：
interface Son extends Father,Mother{
    name: string
    age: Number
}

// 定义一个接口  
interface Person {  
    name: string;  
    age: number;  
    greet(): void; // 方法定义  
}  
  
// 实现接口  
class Employee implements Person {  
    name: string;  
    age: number;  
    department: string; // 额外的属性  
  
    constructor(name: string, age: number, department: string) {  
        this.name = name;  
        this.age = age;  
        this.department = department;  
    }  
  
    greet(): void {  
        console.log(`Hello, my name is ${this.name} and I work in ${this.department}.`);  
    }  
}  
  
// 使用接口  
let john: Person = new Employee('John Doe', 30, 'Engineering');  
john.greet(); // 输出：Hello, my name is John Doe and I work in Engineering.  
  
// 注意：我们不能直接访问 john.department，因为它不是 Person 接口的一部分  
// john.department; // Error: Property 'department' does not exist on type 'Person'.  
  
// 但是我们可以使用类型断言或类型守卫来访问额外的属性  
if (john instanceof Employee) {  
    console.log(john.department); // 输出：Engineering  
}