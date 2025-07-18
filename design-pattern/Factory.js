// 简单工厂模式
// 简单工厂模式也叫静态工厂模式，用一个工厂对象创建同一类对象类的实例

function Factory(career) {
  function User(career, work) {
    this.career = career;
    this.work = work;
  }
  let work;
  switch (career) {
    case "coder":
      work = ["写代码", "修Bug"];
      return new User(career, work);
      break;
    case "hr":
      work = ["招聘", "员工信息管理"];
      return new User(career, work);
      break;
    case "driver":
      work = ["开车"];
      return new User(career, work);
      break;
    case "boss":
      work = ["喝茶", "开会", "审批文件"];
      return new User(career, work);
      break;
  }
}
let coder1 = new Factory("coder");
console.log(coder1);
let boss1 = new Factory("boss");
console.log(boss1);
// Factory就是一个简单工厂。当我们调用工厂函数时，只需要传递name、age、career就可以获取到包含用户工作内容的实例对象

// #工厂方法模式
// 工厂方法模式跟简单工厂模式差不多，但是把具体的产品放到了工厂函数的prototype中
// 工厂方法
function Factory(career) {
  if (this instanceof Factory) {
    var a = new this[career]();
    return a;
  } else {
    return new Factory(career);
  }
}
// 工厂方法函数的原型中设置所有对象的构造函数
Factory.prototype = {
  coder: function () {
    this.careerName = "程序员";
    this.work = ["写代码", "修Bug"];
  },
  hr: function () {
    this.careerName = "HR";
    this.work = ["招聘", "员工信息管理"];
  },
  driver: function () {
    this.careerName = "司机";
    this.work = ["开车"];
  },
  boss: function () {
    this.careerName = "老板";
    this.work = ["喝茶", "开会", "审批文件"];
  },
};
let coder2 = new Factory("coder");
console.log(coder2);
let hr2 = new Factory("hr");
console.log(hr2);

// 抽象工厂模式
// 上述简单工厂模式和工厂方法模式都是直接生成实例，但是抽象工厂模式不同，抽象工厂模式并不直接生成实例， 而是用于对产品类簇的创建
// 通俗点来讲就是：简单工厂和工厂方法模式的工作是生产产品，那么抽象工厂模式的工作就是生产工厂的

let CareerAbstractFactory = function (subType, superType) {
  // 判断抽象工厂中是否有该抽象类
  if (typeof CareerAbstractFactory[superType] === "function") {
    // 缓存类
    function F() {}
    // 继承父类属性和方法
    F.prototype = new CareerAbstractFactory[superType]();
    // 将子类的constructor指向父类
    subType.constructor = subType;
    // 子类原型继承父类
    subType.prototype = new F();
  } else {
    throw new Error("抽象类不存在");
  }
};
