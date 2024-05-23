// 单例模式（Singleton Pattern）：创建型模式，提供了一种创建对象的最佳方式，这种模式涉及到一个单一的类，该类负责创建自己的对象，同时确保只有单个对象被创建

// 定义一个类
function Singleton(name) {
  this.name = name;
  this.instance = null;
}
// 原型扩展类的一个方法getName()
Singleton.prototype.getName = function () {
  console.log(this.name);
};
// 获取类的实例
Singleton.getInstance = function (name) {
  if (!this.instance) {
    this.instance = new Singleton(name);
  }
  return this.instance;
};

// 获取对象1
const a = Singleton.getInstance("a");
// 获取对象2
const b = Singleton.getInstance("b");
// 进行比较
console.log(a === b);

// 使用场景
// 在前端中，很多情况都是用到单例模式，例如页面存在一个模态框的时候，
// 只有用户点击的时候才会创建，而不是加载完成之后再创建弹窗和隐藏，并且保证弹窗全局只有一个
const getSingle = function (fn) {
  let result;
  return function () {
    return result || (result = fn.apply(this, arguments));
  };
};

const createLoginLayer = function () {
  var div = document.createElement("div");
  div.innerHTML = "我是浮窗";
  div.style.display = "none";
  document.body.appendChild(div);
  return div;
};

const createSingleLoginLayer = getSingle(createLoginLayer);

document.getElementById("loginBtn").onclick = function () {
  var loginLayer = createSingleLoginLayer();
  loginLayer.style.display = "block";
};

// 并且Vuex、redux全局态管理库也应用单例模式的思想，如下图：
// 现在很多第三方库都是单例模式，多次引用只会使用同一个对象，如jquery、lodash、moment