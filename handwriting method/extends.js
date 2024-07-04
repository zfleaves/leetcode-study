// 原型链继承
{
  function Parent() {
    this.name = "parent1";
    this.play = [1, 2, 3];
  }
  function Child() {
    this.type = "child2";
  }
  Child.prototype = new Parent();
  const s1 = new Child();
  const s2 = new Child();
  s1.play.push(4);
  //   console.log(s1.play, s2.play); // [1,2,3,4]
  // 缺点改变s1的play属性，会发现s2也跟着发生变化了，这是因为两个实例使用的是同一个原型对象，内存空间是共享的
}
// 构造函数继承
{
  // 借助 call调用Parent函数
  function Parent() {
    this.name = "parent1";
  }

  Parent.prototype.getName = function () {
    return this.name;
  };

  function Child() {
    Parent.call(this);
    this.type = "child";
  }

  let child = new Child();
  //   console.log(child); // 没问题
  //   console.log(child.getName()); // 会报错
  // 缺点但是只能继承父类的实例属性和方法，不能继承原型属性或者方法
}
// 组合继承
{
  function Parent3() {
    this.name = "parent3";
    this.play = [1, 2, 3];
  }

  Parent3.prototype.getName = function () {
    return this.name;
  };
  function Child3() {
    // 第二次调用 Parent3()
    Parent3.call(this);
    this.type = "child3";
  }

  // 第一次调用 Parent3()
  Child3.prototype = new Parent3();
  // 手动挂上构造器，指向自己的构造函数
  Child3.prototype.constructor = Child3;
  var s3 = new Child3();
  var s4 = new Child3();
  s3.play.push(4);
  //   console.log(s3.play, s4.play); // 不互相影响
  //   console.log(s3.getName()); // 正常输出'parent3'
  //   console.log(s4.getName()); // 正常输出'parent3'
}
// 原型式继承
{
  let parent4 = {
    name: "parent4",
    friends: ["p1", "p2", "p3"],
    getName: function () {
      return this.name;
    },
  };

  let person4 = Object.create(parent4);
  person4.name = "tom";
  person4.friends.push("jerry");

  let person5 = Object.create(parent4);
  person5.friends.push("lucy");

  //   console.log(person4.name); // tom
  //   console.log(person4.name === person4.getName()); // true
  //   console.log(person5.name); // parent4
  //   console.log(person4.friends); // ["p1", "p2", "p3","jerry","lucy"]
  //   console.log(person5.friends); // ["p1", "p2", "p3","jerry","lucy"]
  //   Object.create方法实现的是浅拷贝，多个实例的引用类型属性指向相同的内存，存在篡改的可能
}
// 寄生式继承
{
  let parent5 = {
    name: "parent5",
    friends: ["p1", "p2", "p3"],
    getName: function () {
      return this.name;
    },
  };
  function clone(original) {
    let clone = Object.create(original);
    clone.getFriends = function () {
      return this.friends;
    };
    return clone;
  }
  let person5 = clone(parent5);
  //   console.log(person5.getName()); // parent5
  //   console.log(person5.getFriends()); // ["p1", "p2", "p3"]
}
// 寄生组合式继承
{
  function clone(parent, child) {
    // 这里改用 Object.create 就可以减少组合继承中多进行一次构造的过程
    child.prototype = Object.create(parent.prototype);
    child.prototype.constructor = child;
  }

  function Parent6() {
    this.name = "parent6";
    this.play = [1, 2, 3];
  }
  Parent6.prototype.getName = function () {
    return this.name;
  };
  function Child6() {
    Parent6.call(this);
    this.friends = "child5";
  }

  clone(Parent6, Child6);

  Child6.prototype.getFriends = function () {
    return this.friends;
  };
  let person6 = new Child6();
  //   console.log(person6); //{friends:"child5",name:"child5",play:[1,2,3],__proto__:Parent6}
  //   console.log(person6.getName()); // parent6
  //   console.log(person6.getFriends()); // child5
}
// 类继承
{
  class Person {
    constructor(name) {
      this.name = name;
    }
    // 原型方法
    // 即 Person.prototype.getName = function() { }
    // 下面可以简写为 getName() {...}
    getName = function () {
      console.log("Person:", this.name);
    };
  }
  class Gamer extends Person {
    constructor(name, age) {
      // 子类中存在构造函数，则需要在使用“this”之前首先调用 super()。
      super(name);
      this.age = age;
    }
  }
  const asuna = new Gamer("Asuna", 20);
  asuna.getName(); // 成功访问到父类的方法
}


(function a () {
  console.log('a1', a)
  a = 3
  console.log('a2', a)
}())

var b = function() {
  console.log('b1', b)
  b = 3
  console.log('b2', b)
}
b()