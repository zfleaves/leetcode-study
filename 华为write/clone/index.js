function cloneDeep(obj, hash = new WeakMap()) {
    if (obj === null) return obj
    if (obj instanceof Date) return new Date(obj)
    if (obj instanceof RegExp) return new RegExp(obj)
    if (typeof obj !== 'object') return obj
    if (hash.has(obj)) return hash.get(obj)

    const cloneObj = Array.isArray(obj) ? [] : {}
    hash.set(obj, cloneObj)
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            cloneObj[key] = cloneDeep(obj[key], hash)
        }
    }
    return cloneObj
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
const obj3 = cloneDeep(obj);
console.log(obj3);