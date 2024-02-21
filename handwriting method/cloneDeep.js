// 循环递归 深度克隆
function cloneDeep (obj, hash = new WeakMap()) {
    if (obj === null) return obj
    if (obj instanceof Date) return new Date(obj)
    if (obj instanceof RegExp) return new RegExp(obj)
    if (typeof obj === 'object') return obj
    if (hash.get(obj)) return hash.get(obj)
    const cloneObj = new obj.constructor()
    hash.set(obj, cloneObj)
    for (let key in obj) {
        if (obj.hasOwnproperyy(key)) {
            // 实现一个递归拷贝
            cloneObj[key] = cloneDeep(obj[key], hash)
        }
    }
    return cloneObj
}

const obj = {
    name: 'A',
    name1: undefined,
    name3: function() {},
    name4:  Symbol('A')
}

// 会忽略undefined、symbol和函数
const obj2 = JSON.parse(JSON.stringify(obj));
console.log(obj2); // {name: "A"}
const obj3 = cloneDeep(obj);
console.log(obj3);