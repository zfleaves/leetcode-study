/*
 * @Date: 2026-01-28 20:09:47
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2026-01-28 21:13:27
 * @FilePath: \leetcode-study\write\cloneDeep.js
 */
function deepClone(obj, hash = new WeakMap()) {
    if (obj === null) return obj; // 如果是null或者undefined我就不进行拷贝操作
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof RegExp) return new RegExp(obj);
    // 可能是对象或者普通的值  如果是函数的话是不需要深拷贝
    if (typeof obj !== "object") return obj;
    // 是对象的话就要进行深拷贝
    if (hash.get(obj)) return hash.get(obj);
    let cloneObj = new obj.constructor();
    // 找到的是所属类原型上的constructor,而原型上的 constructor指向的是当前类本身
    hash.set(obj, cloneObj);
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            // 实现一个递归拷贝
            cloneObj[key] = deepClone(obj[key], hash);
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
    f: [5, 6, {
        g: 7
    }],
    h: /hello/g,
};

// 会忽略undefined、symbol和函数
const obj2 = JSON.parse(JSON.stringify(obj));
console.log(obj2); // {name: "A"}
const obj3 = deepClone(obj);
console.log(obj3);