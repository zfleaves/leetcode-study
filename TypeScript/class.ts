/*
 * @Date: 2024-05-22 21:55:57
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2024-05-22 21:59:04
 * @FilePath: \leetcode-study\TypeScript\class.ts
 */
// 定义一个类  
class Animal {
    // 属性  
    name: string;

    // 构造函数，用于初始化对象的属性  
    constructor(name: string) {
        this.name = name;
    }

    // 方法  
    speak(): void {
        console.log(`The animal says something`);
    }
}

// 创建一个类的实例（对象）  
let dog = new Animal('Buddy');

// 访问对象的属性  
console.log(dog.name); // 输出：Buddy  

// 调用对象的方法  
dog.speak(); // 输出：The animal says something  

// 你可以定义一个继承自另一个类的类  
class Dog extends Animal {
    bark(): void {
        console.log('Woof woof!');
    }
}

// 创建一个 Dog 类的实例  
let myDog = new Dog('Max');

// 访问继承的属性  
console.log(myDog.name); // 输出：Max  

// 调用继承的方法  
myDog.speak(); // 输出：The animal says something（因为 Dog 类没有重写 speak 方法）  

// 调用 Dog 类特有的方法  
myDog.bark(); // 输出：Woof woof!

// 在 TypeScript 中，类的成员（包括属性、方法、访问器和构造函数）可以使用访问修饰符来定义它们的可见性和可访问性。
// TypeScript 支持三种访问修饰符：public、private 和 protected。

// 以下是这些修饰符的定义和用法：

// public：这是默认的访问修饰符。如果省略了修饰符，成员就是 public 的。public 成员可以在任何地方被访问，包括在类内部、类的子类中和类的实例上。
// typescript
class MyClass1 {
    public myPublicProperty: string = 'Hello, public!';

    public myPublicMethod() {
        console.log(this.myPublicProperty);
    }
}

const obj1 = new MyClass1();
console.log(obj1.myPublicProperty); // 输出 "Hello, public!"  
obj1.myPublicMethod(); // 输出 "Hello, public!"
// private：private 成员只能在类的内部被访问。它们不能在类的外部或类的子类中访问。
// typescript
class MyClass2 {
    private myPrivateProperty: string = 'Hello, private!';

    public showPrivateProperty() {
        console.log(this.myPrivateProperty); // 可以在类内部访问  
    }
}

const obj2 = new MyClass2();
// console.log(obj.myPrivateProperty); // 错误：myPrivateProperty 是私有的  
obj2.showPrivateProperty(); // 可以通过公共方法来间接访问私有属性
// protected：protected 成员可以在类内部和类的子类中被访问，但不能在类的外部访问。
// typescript
class ParentClass {
    protected myProtectedProperty: string = 'Hello, protected!';

    protected showProtectedProperty() {
        console.log(this.myProtectedProperty);
    }
}

class ChildClass extends ParentClass {
    public accessProtectedProperty() {
        console.log(this.myProtectedProperty); // 可以在子类中访问  
        this.showProtectedProperty(); // 可以在子类中访问  
    }
}

const child = new ChildClass();
// console.log(child.myProtectedProperty); // 错误：myProtectedProperty 是受保护的  
child.accessProtectedProperty(); // 可以通过子类的方法间接访问受保护的属性和方法
// 需要注意的是，尽管 TypeScript 提供了访问修饰符来确保类型安全并增强封装性，
// 但这些修饰符在编译为 JavaScript 时会被移除，因为 JavaScript 不支持这些访问修饰符。
// 因此，TypeScript 的访问修饰符主要用于在 TypeScript 编译时提供类型检查和错误提示，而不是在运行时提供真正的访问控制。
// 在 JavaScript 中，你可以访问任何对象的任何属性（除非使用闭包、原型链或其他 JavaScript 特性来模拟私有性）。