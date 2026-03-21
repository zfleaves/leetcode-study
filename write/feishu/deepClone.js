function deepClone(obj, map = new WeakMap()) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (map.has(obj)) {
        return map.get(obj);
    }

    if (obj instanceof Date) {
        return new Date(obj);
    }

    if (obj instanceof RegExp) {
        return new RegExp(obj);
    }

    // 处理Map
    if (obj instanceof Map) {
        const clone = new Map();
        map.set(obj, clone);
        obj.forEach((value, key) => {
            clone.set(deepClone(key, map), deepClone(value, map));
        })
        return clone;
    }
    // 处理Set
    if (obj instanceof Set) {
        const clone = new Set();
        map.set(obj, clone);
        obj.forEach(value => {
            clone.add(deepClone(value, map));
        })
        return clone;
    }
    // 处理数组
    if (Array.isArray(obj)) {
        const clone = [];
        map.set(obj, clone);
        obj.forEach((item, index) => {
            clone[index] = deepClone(item, map);
        })
    }

    // 处理对象
    const clone = {};
    map.set(obj, clone);

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            clone[key] = deepClone(obj[key], map);
        }
    }
    return clone;
}

// 测试
const original = {
    a: 1,
    b: { c: 2 },
    d: new Date(),
    e: /test/g,
    f: [1, 2, 3],
    g: function () { return 'hello'; }
};

const cloned = deepClone(original);

console.log(cloned);
console.log(cloned !== original); // true