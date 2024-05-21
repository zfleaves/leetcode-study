// 循环递归 深度克隆
function cloneDeep(obj, hash = new WeakMap()) {
  if (obj === null) return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  if (typeof obj !== "object") return obj;
  if (hash.get(obj)) {
    return hash.get(obj);
  }
  // 创建一个新的对象或数组
  let cloneObj = Array.isArray(obj) ? [] : {};
  // console.log("cloneObj: ", cloneObj);
  hash.set(obj, cloneObj);
  // 循环递归复制所有属性或元素
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloneObj[key] = cloneDeep(obj[key], hash); // 递归调用
    }
  }
  return cloneObj;
}

// 使用示例
const obj = {
  a: 1,
  b: {
    c: 2,
    d: [3, 4],
    e: new Date(),
  },
  f: [5, 6, { g: 7 }],
  h: /hello/g,
};

// 会忽略undefined、symbol和函数
const obj2 = JSON.parse(JSON.stringify(obj));
console.log(obj2); // {name: "A"}
const obj3 = cloneDeep(obj);
console.log(obj3);
