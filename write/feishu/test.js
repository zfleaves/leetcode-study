/*
 * @Date: 2026-02-27 12:07:23
 * @LastEditors: zengfa 1051403128@qq.com
 * @LastEditTime: 2026-03-01 19:44:34
 * @FilePath: \leetcode-study\write\feishu\test.js
 */
// MyNew
{
    function MyNew(Func, ...args) {
        // 创建一个新对象
        let obj = {};
        // 将新对象的原型指向构造函数的原型
        obj.prototype = Func.prototype;
        // 将构造函数的 this 执行新对象
        let result = Func.apply(obj, args);
        // 根据返回结果的类型去判断
        return result instanceof Object ? result : obj;
    }
}
// MyBind
{
    function MyBind(context) {
        let agrs = [...arguments].slice(1);
        let fn = this;

        return function Fn() {
            return Fn.apply(this instanceof Fn ? new fn(...agrs) : context, agrs.concat([...arguments]));
        }
    }
}
// deepClone
{
    function deepClone(obj, map = new WeakMap()) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (map.has(obj)) {
            return map.get(obj);
        }
        // 日期
        if (obj instanceof Date) {
            return Date(obj);
        }
        // 正则
        if (obj instanceof RegExp) {
            return RegExp(obj);
        }
        // map
        if (obj instanceof Map) {
            const clone = new Map();
            map.set(obj, clone);
            obj.forEach((key, value) => {
                clone.set(deepClone(key, map), deepClone(value, map));
            })
            return clone;
        }
        // Set
        if (obj instanceof Set) {
            const clone = new Set();
            map.set(obj, clone);
            obj.forEach((value) => {
                clone.add(deepClone(value, map));
            })
            return clone;
        }
        // 数组
        if (Array.isArray(obj)) {
            const clone = [];
            map.set(obj, clone);
            obj.forEach((value, index) => {
                clone[index] = deepClone(value, map);
            })
            return clone;
        }
        // 对象 
        const clone = new obj.constructor();
        // 找到的是所属类原型上的constructor,而原型上的 constructor指向的是当前类本身
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                clone[key] = deepClone(obj[key], map);
            }
        }
        return clone;
    }
}
// myInstanceof
{
    function myInstanceof(left, right) {
        // 找到right 的原型
        right = right.prototype;
        // 找到left 的原型链
        left = left.__proto__;
        // 循环原型链
        while (true) {
            if (left === null) return false;
            if (left === right) return true;
            left = left.__proto__;
        }
    }
}
// debounce
{
    function debounce(fn, delay, immediate) {
        if (typeof fn !== 'function') {
            throw new Error('')
        }
        let timer = null;
        return function (...args) {
            let context = this;
            let shouldCallNow = immediate && !timer;
            clearTimeout(timer);

            timer = setTimeout(() => {
                if (!immediate) {
                    fn.apply(context, args);
                }
            }, delay)

            if (shouldCallNow) {
                fn.apply(context, args);
            }
        }
    }
}
// throttled
{
    function throttled(fn, delay) {
        let timer = null;
        let start = Date.now();
        return function (...args) {
            let contex = this;
            if (timer) clearTimeout(timer);
            let cur = Date.now();
            let remain = delay - (cur - start);
            if (remain > 0) {
                timer = setTimeout(() => {
                    fn.apply(contex, args);
                }, remain)
            } else {
                fn.apply(contex, args);
                start = Date.now();
            }
        }
    }
}
// quickSort
{
    function quickSort(arr) {
        if (arr.length <= 1) return arr;
        let left = [];
        let right = [];
        let equal = [];
        let pivot = arr[Math.floor(arr.length / 2)];
        for (const item of arr) {
            if (item < pivot) {
                left.push(item);
            } else if (item > pivot) {
                right.push(item);
            } else {
                equal.push(item);
            }
        }
        return [...quickSort(left), ...equal, ...quickSort(right)];
    }
    const arr1 = [3, 6, 8, 10, 1, 2, 1];
    console.log('Original:', arr1);
    console.log('QuickSort:', quickSort([...arr1])); // [1, 1, 2, 3, 6, 8, 10]
}
// mapSort
{
    function mapSort(arr) {
        let i = arr.length - 1;
        while (i > 0) {
            let pos = 0;
            for (let j = 0; j < i; j++) {
                if (arr[j] > arr[j + 1]) {
                    const temp = arr[j + 1];
                    arr[j + 1] = arr[j];
                    arr[j] = temp;
                    pos = j;
                }
            }
            i = pos;
        }
        return arr;
    }
    const arr = [12, 35, 99, 18, 76]
    const result = mapSort(arr)
    console.log('result', result);
}
// arrayToTree
{
    const data = [
        { id: 1, parentId: null, name: 'Root' },
        { id: 2, parentId: 1, name: 'Child 1' },
        { id: 3, parentId: 1, name: 'Child 2' },
        { id: 4, parentId: 2, name: 'Grandchild 1' },
        { id: 5, parentId: 2, name: 'Grandchild 2' },
        { id: 6, parentId: 3, name: 'Grandchild 3' },
    ];
    function arrayToTree(arr, parentId = 0) {
        return arr.filter(v => v.parentId === parentId)
            .map((item) => {
                return {
                    ...item,
                    children: arrayToTree(arr, item.id)
                }
            })
    }
    // 测试
    const tree = arrayToTree(data);
    console.log(JSON.stringify(tree, null, 2))
}
{
    const data = [
        { id: 1, parentId: null, name: 'Root' },
        { id: 2, parentId: 1, name: 'Child 1' },
        { id: 3, parentId: 1, name: 'Child 2' },
        { id: 4, parentId: 2, name: 'Grandchild 1' },
        { id: 5, parentId: 2, name: 'Grandchild 2' },
        { id: 6, parentId: 3, name: 'Grandchild 3' },
    ];
    function arrayToTree(arr) {
        let result = [];
        let treeMap = {};
        for (const item of arr) {
            treeMap[item.id] = { ...item, children: [] };
        }

        for (const item of arr) {
            const { id, parentId } = item;
            const treeItem = treeMap[id]
            if (parentId === 0 || parentId === null) {
                result.push(treeItem);
            } else {
                if (treeMap[parentId]) {
                    treeMap[parentId].children.push(item);
                }
            }
        }
        return result;
    }
    // 测试
    const tree = arrayToTree(data);
    console.log(JSON.stringify(tree, null, 2));
}
// 红绿灯
{
    function red() {
        console.log('red');
    }
    function green() {
        console.log('green');
    }
    function yellow() {
        console.log('yellow');
    }
    // const light = (cb, time) => {
    //     return new Promise((resolve) => {
    //         cb();
    //         setTimeout(() => {
    //             resolve();
    //         }, time)
    //     })
    // }
    // const step = function () {
    //     Promise.resolve()
    //         .then(() => {
    //             light(red, 3000);
    //         })
    //         .then(() => {
    //             light(green, 2000);
    //         }).then(() => {
    //             light(yellow, 1000);
    //         }).finally(() => {
    //             step();
    //         })
    // }
    function sleep(delay) {
        return new Promise((resolve) => setTimeout(resolve, delay))
    }
    async function trafficLight() {
        while (true) {
            red();
            await sleep(3000);
            green();
            await sleep(2000);
            yellow();
            await sleep(1000);
        }
    }
    // trafficLight();
}
//LRUCache 
{
    class LRUCach {
        constructor(capacity) {
            this.capacity = capacity;
            this.cache = new Map();
        }

        get (key) {
            if (!this.cache.has(key)) return -1;
            const val = this.cache.get(key);
            this.cache.delete(key);
            this.cache.set(key, val);
            return val;
        }

        put(key, val) {
            if (this.cache.has(key)) {
                this.cache.delete(key);
            } else if (this.cache.size >= this.capacity) {
                this.cache.delete(this.cache.keys().next().value);
            }
            this.cache.set(key, val);
        }
    }
}
// 合并链表
{
    function mergeTwoLists(list1, list2) {
        if (list1 === null) {
            return list2;
        } else if (list2 === null) {
            return list1;
        } else if (list1.val < list2.val) {
            list1.next = mergeTwoLists(list1.next, list2);
            return list1;
        } else {
            list2.next = mergeTwoLists(list1, list2.next);
            return list2;
        }
    }
}
// 无重复字符最长子串 
{
    function lengthOfLongestSubstring(s) {
        const n = s.length;
        if (n <= 1) return n;
        let ans = 0;
        for (let slow = 0; slow < n; slow++) {
            let fast = slow + 1;
            let res = '';
            while (fast < n && res.indexOf(s[fast]) < 0) {
                res += s[fast];
                fast++;
            }
            ans = Math.max(ans, fast - slow);
        }
        return ans;
    }
}
// 有效括号
{
    function isValid(s) {
        const map = new Map([
            [')', '('],
            ['}', '{'],
            [']', '[']
        ])
        let stack = [];
        for (const c of s) {
            if (map.has(c)) {
                if (stack.length === 0 || stack.pop() !== map.get(c)) return false;
            } else {
                stack.push(c);
            }
        }
        return stack.length === 0;
    }
}
// 树扁平化
{
    function treeToArray(tree, result = [], childrenKey = 'children') {
        if (!Array.isArray(tree)) tree = [tree];
        for (const node of tree) {
            result.push(node);
            if (node[childrenKey] && node[childrenKey].length) {
                treeToArray(node[childrenKey], result, childrenKey);
            }
        }
        return result;
    }
}
// flattenTree
{
    function flattenTree(tree, childrenKey = 'children') {
        return tree.reduce((acc, node) => {
            const children = node[childrenKey] || [];
            return acc.concat([node], flattenTree(children, childrenKey));
        }, []);
    }
}

// 实现一个将多维数组扁平化的方法
{
    function flatten(arr) {
        return arr.reduce((pre, cur) => {
            return pre.concat(Array.isArray(cur) ? flatten(cur) : cur);
        }, [])
    }
    // 测试
    const arr = [1, [2, [3, [4, 5]]], 6, [7, 8]];
    console.log(flatten(arr)); // [1, 2, 3, 4, 5, 6, 7, 8]
}