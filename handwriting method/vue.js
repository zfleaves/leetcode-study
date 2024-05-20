function observe(obj) {
  if (typeof obj !== "object" || obj == null) {
    return;
  }
  new Observer(obj);
}

class Observer {
  constructor(value) {
    this.value = value;
    this.walk(value);
  }
  walk(obj) {
    // 对对象里每一个对象进行监听
    Object.keys(obj).forEach((key) => {
      defineReactive(obj, key, obj[key]);
    });
  }
}

// 先来一个构造函数：执行初始化，对data执行响应化处理
class Vue {
  constructor(options) {
    this.$options = options;
    this.$data = options.data;
    // 对data选项做响应式处理
    observe();
  }
}

// 编译Compile
// 对每个元素节点的指令进行扫描跟解析,根据指令模板替换数据,以及绑定相应的更新函数
class Compile {
  constructor(el, vm) {
    this.$vm = vm;
    this.$el = document.querySelector(el); // 获取dom
    if (this.$el) {
      this.compile(this.$el);
    }
  }
  compile(el) {
    const childNodes = el.childNodes;
    Array.from(childNodes).forEach((node) => {
      // 遍历子元素
      if (this.isElement(node)) {
        // 判断是否为节点
        console.log("编译元素" + node.nodeName);
      } else if (this.isInterpolation(node)) {
        console.log("编译插值⽂本" + node.textContent); // 判断是否为插值文本 {{}}
      }
      if (node.childNodes && node.childNodes.length > 0) {
        // 判断是否有子元素
        this.compile(node); // 对子元素进行递归遍历
      }
    });
  }
  isElement(node) {
    return node.nodeType == 1;
  }
  isInterpolation(node) {
    return node.nodeType == 3 && /\{\{(.*)\}\}/.test(node.textContent);
  }
}

// 依赖收集
// 视图中会用到data中某key，这称为依赖。同⼀个key可能出现多次，每次都需要收集出来用⼀个Watcher来维护它们，
// 此过程称为依赖收集多个Watcher需要⼀个Dep来管理，需要更新时由Dep统⼀通知
// 实现思路
// 1 defineReactive时为每⼀个key创建⼀个Dep实例
// 2 初始化视图时读取某个key，例如name1，创建⼀个watcher1
// 3 由于触发name1的getter方法，便将watcher1添加到name1对应的Dep中
// 4 当name1更新，setter触发时，便可通过对应Dep通知其管理所有Watcher更新
// 负责更新视图
class Watcher {
  constructor(vm, key, updater) {
    this.vm = vm;
    this.key = key;
    this.updaterFn = updater;

    // 创建实例时，把当前实例指定到Dep.target静态属性上
    Dep.target = this;
    // 读一下key，触发get
    vm[key];
    // 置空
    Dep.target = null;
  }

  // 未来执行dom更新函数，由dep调用的
  update() {
    this.updaterFn.call(this.vm, this.vm[this.key]);
  }
}

class Dep {
  constructor() {
    this.deps = []; // 依赖管理
  }
  addDep(dep) {
    this.deps.push(dep);
  }
  notify() {
    this.deps.forEach((dep) => dep.update());
  }
}
