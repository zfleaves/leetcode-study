// 代理模式（Proxy Pattern）是为一个对象提供一个代用品或占位符，以便控制对它的访问
const proxy = new Proxy(target, handler);

// 而按照功能来划分，javascript代理模式常用的有：

// 缓存代理
// 缓存代理可以为一些开销大的运算结果提供暂时的存储，在下次运算时，如果传递进来的参数跟之前一致，则可以直接返回前面存储的运算结果
var muti = function () {
  console.log("开始计算乘积");
  var a = 1;
  for (var i = 0, l = arguments.length; i < l; i++) {
    a = a * arguments[i];
  }
  return a;
};
var proxyMult = (function () {
  var cache = {};
  return function () {
    var args = Array.prototype.join.call(arguments, ",");
    if (args in cache) {
      return cache[args];
    }
    return (cache[args] = mult.apply(this, arguments));
  };
})();

proxyMult(1, 2, 3, 4); // 输出:24
proxyMult(1, 2, 3, 4); // 输出:24
// 当第二次调用 proxyMult(1, 2, 3, 4) 时，本体 mult 函数并没有被计算，proxyMult 直接返回了之前缓存好的计算结果

// #虚拟代理
// 虚拟代理把一些开销很大的对象，延迟到真正需要它的时候才去创建

// 图片本地对象，负责往页面中创建一个img标签，并且提供一个对外的setSrc接口
let myImage = (function () {
  let imgNode = document.createElement("img");
  document.body.appendChild(imgNode);

  return {
    //setSrc接口，外界调用这个接口，便可以给该img标签设置src属性
    setSrc: function (src) {
      imgNode.src = src;
    },
  };
})();
// 代理对象，负责图片预加载功能
let proxyImage = (function () {
  // 创建一个Image对象，用于加载需要设置的图片
  let img = new Image();
  img.onload = function () {
    // 监听到图片加载完成后，给被代理的图片本地对象设置src为加载完成后的图片
    myImage.setSrc(this.src);
  };
  return {
    setSrc: function (src) {
      // 设置图片时，在图片未被真正加载好时，以这张图作为loading，提示用户图片正在加载
      myImage.setSrc(
        "https://img.zcool.cn/community/01deed576019060000018c1bd2352d.gif"
      );
      img.src = src;
    },
  };
})();

proxyImage.setSrc("https://xxx.jpg");

// 使用代理模式代理对象的访问的方式，一般又被称为拦截器，比如我们在项目中经常使用 Axios 的实例来进行 HTTP 的请求，
// 使用拦截器 interceptor 可以提前对 请求前的数据 服务器返回的数据进行一些预处理
