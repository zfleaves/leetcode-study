/*
 * @Date: 2026-02-27 12:07:23
 * @LastEditors: zengfa 1051403128@qq.com
 * @LastEditTime: 2026-03-01 21:10:12
 * @FilePath: \leetcode-study\write\feishu\111.js
 */
// MyNew
{
    function MyNew(Func, ...args) {
        // 新建一个对象
        let obj = {};
        // 将对象的原型指向构造函数的原型
        obj.prototype = Func.prototype;
        // 讲对象的this 挂在在构造函数上
        const result = Func.apply(obj, args);
        // 根据返回结果的类型去判断
        return result instanceof Object ? result : obj;
    }
}
// MyBind
{
    function MyBind(context) {
        let args = [...arguments].slice(1);
        let fn = this;
        return function Fn() {
            return Fn.apply(this instanceof Fn ? new fn(...arguments) : context, args.concat([...arguments]));
        }
    }
}
// deepClone
{
    function deepClone(obj, map = new WeakMap()) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (map.has(obj)) return map.get(obj);
        // 日期
        if (obj instanceof Date) return Date(obj);
        // 正则
        if (obj instanceof RegExp) return new RegExp(obj);
        // map
        if (obj instanceof Map) {
            const clone = new Map();
            map.set(obj, clone);
            obj.forEach((key, value) => {
                clone.set(deepClone(key, map), deepClone(value, map));
            })
            return clone;
        }
        // set
        if (obj instanceof Set) {
            const clone = new Map();
            map.set(obj, clone);
            obj.forEach(value => {
                clone.add(deepClone(value, map));
            })
            return clone;
        }
        // 数组
        if (Array.isArray(obj)) {
            const clone = [];
            map.set(obj, clone);
            obj.forEach((item, index) => {
                clone[index] = deepClone(item, map);
            })
            return clone;
        }
        // 对象
        const clone = new obj.constructor();
        for (const key of obj) {
            if (obj.hasOwnPropetry(key)) {
                clone[key] = deepClone(obj[key], map);
            }
        }
        return clone;
    }
}
// myInstanceof
{
    function myInstanceof(left, right) {
        let prototype = right.prototype;
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
            clearTimeout(timer);
            let context = this;
            let cur = Date.now();
            let remain = delay - (cur - start);
            if (remain > 0) {
                timer = setTimeout(() => {
                    fn.apply(context, args);
                }, remain)
            } else {
                fn.apply(context, args);
                start = Date.now();
            }
        }
    }
}
// quickSort
{
    function quickSort(arr) {
        if (arr.length <= 1) return arr;
        let mid = arr[Math.floor(arr.length / 2)];
        let left = [], right = [];
        for (const num of arr) {
            if (num < mid) {
                left.push(num);
            } else if (num > mid) {
                right.push(mid);
            }
        }
        return [...quickSort(left), mid, ...quickSort(right)];
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
                    const temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    pos = j;
                }
            }
            i = pos; // 下一轮
        }
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
        if (arr.length <= 1) return arr;
        let itemMap = {};
        for (const item of arr) {
            itemMap[item.id] = { ...item, children: [] };
        }
        let result = [];
        for (const item of arr) {
            const { id, parentId } = item;
            if (parentId === null || parentId === 0) {
                result.push(itemMap[id]);
            } else {
                if (itemMap[parentId]) {
                    itemMap[parentId].children.push(item);
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
    // trafficLight();
    const sleep = async (time) => {
        return new Promise((resolve) => setTimeout(resolve, time));
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
}
//LRUCache 
{
    class LRUCach {
        constructor(capacity) {
            this.capacity = capacity;
            this.cache = new Map();
        }

        get(key) {
            if (!this.cache.has(key)) return -1;
            // 更新最新
            const val = this.cache.get(key);
            this.cache.delete(key);
            this.cache.set(key, val);
            return val;
        }

        put(key, val) {
            if (this.cache.has(key)) {
                this.cache.delete(key)
            } else if (this.cache.size >= this.capacity) {
                this.cache.delete(this.cache.keys().next().value)
            }
            this.set(key, val);
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
            let res = s[slow];
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
            [']', '['],
            ['}', '{']
        ])
        let stack = [];
        for (const c of s) {
            if (map.has(c)) {
                if (stack.length === 0 || stack.pop() !== map.get(c)) return false;
            } else {
                stack.push(c);
            }
        }
        return stack.length;
    }
}
// 树扁平化
{
    function treeToArray(tree, result = [], childrenKey = 'children') {
        if (!Array.isArray(tree)) tree = [tree];
        for (const node of tree) {
            result.push(node);
            const children = node[childrenKey];
            if (children && children.length) {
                treeToArray(children, result, childrenKey);
            }
        }
        return result;
    }
}
// flattenTree
{
    function flattenTree(tree, childrenKey = 'children') {
        return tree.reduce((pre, cur) => {
            const children = cur[childrenKey] || [];
            return pre.concat([node], flattenTree(children, childrenKey));
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
// MyPromise
{
    const PENDING = 'pending';
    const FULFILLED = 'fulfilled';
    const REJECTD = 'rejectd';

    class MyPromise {
        constructor(executor) {
            this.state = PENDING;
            this.value = undefined;
            this.reason = undefined;
            this.onResolveCallbacks = [];
            this.onRejectCallbacks = [];

            const resolve = (value) => {
                if (this.state === PENDING) {
                    this.state = FULFILLED;
                    this.value = value;
                    this.onResolveCallbacks.forEach(cb => cb(value));
                }
            }

            const reject = (reason) => {
                if (this.state === PENDING) {
                    this.state = REJECTD;
                    this.reason = reason;
                    this.onRejectCallbacks.forEach(cb => cb(reason));
                }
            }

            try {
                executor(resolve, reject)
            } catch (error) {
                reject(error);
            }
        }

        static resolve(value) {
            if (value instanceof MyPromise) {
                return value;
            }
            return new MyPromise((resolve) => resolve(value));
        }

        static reject(reason) {
            if (reason instanceof MyPromise) {
                return reason;
            }
            return new MyPromise((resolve, reject) => reject(reason));
        }

        then(onFulfilled, onRejected) {
            return new MyPromise((resolve, reject) => {
                const fulfilledTask = () => {
                    const result = onFulfilled ? onFulfilled(this.value) : this.value;
                    try {
                        if (result instanceof MyPromise) {
                            result.then(resolve, reject);
                        } else {
                            resolve(result);
                        }
                    } catch (error) {
                        reject(error);
                    }
                }

                const rejectedTask = () => {
                    const result = onRejected ? onRejected(this.reason) : this.reason;
                    try {
                        if (result instanceof MyPromise) {
                            result.then(resolve, reject);
                        } else {
                            resolve(result);
                        }
                    } catch (error) {
                        reject(error);
                    }
                }

                if (this.state === FULFILLED) {
                    fulfilledTask();
                } else if (this.state === REJECTD) {
                    rejectedTask();
                } else {
                    this.onResolveCallbacks.push(fulfilledTask);
                    this.onRejectCallbacks.push(rejectedTask);
                }
            })
        }

        catch(onRejected) {
            return this.then(undefined, onRejected);
        }

        all(promises) {
            return new Promise((resolve, reject) => {
                let count = 0;
                let result = [];
                const processData = (val, index) => {
                    count++;
                    result[index] = val;
                    if (count === promises.length) {
                        resolve(result);
                    }
                }

                promises.forEach((promise, index) => {
                    MyPromise.resolve(promise).then(
                        value => processData(value, index),
                        reason => reject(reason)
                    )
                })
            })
        }

        allSettled(promises) {
            return new Promise((resolve, reject) => {
                let count = 0;
                let result = [];
                const processData = (val, index, state) => {
                    count++;
                    result[index] = {
                        value: val,
                        state
                    };
                    if (count === promises.length) {
                        resolve(result);
                    }
                }

                promises.forEach((promise, index) => {
                    MyPromise.resolve(promise).then(
                        value => processData(value, index, FULFILLED),
                        reason => processData(reason, index, REJECTD)
                    )
                })
            })
        }

        race(promises) {
            return new Promise((resolve, reject) => {
                promises.forEach((promise) => {
                    MyPromise.resolve(promise).then(
                        value => resolve(value),
                        reason => reject(reason)
                    )
                })
            })
        }

        finally(cb) {
            return this.then(
                value => MyPromise.resolve(cb()).then(() => value),
                reason => MyPromise.resolve(cb()).then(() => { throw reason})
            )
        }
    }
}
// EventEmitter
{
    
    class EventEmitter{
        constructor() {
            this.events = {};
        }

        on(eventName, callback) {
            if (!this.events[eventName]) {
                this.events[eventName] = [];
            }
            this.events[eventName].push(callback);
            return this;
        }

        off (eventName, callback) {
            if (!this.events[eventName]) {
                return this;
            }
            if (!callback) {
                delete this.events[eventName]
            } else {
                this.events[eventName] = this.events[eventName].filter((cb !== callback));
            }
        }

        emit(eventName, ...args) {
            if (!this.events[eventName]) {
                return this;
            }
            this.events[eventName].forEach((cb) => {
                cb.apply(this, args);
            })
            return this;
        }

        once(eventName, callback) {
            const onceCallback = (...args) => {
                callback.apply(this, args);
                this.off(eventName, onceCallback);
            }
            this.on(eventName, onceCallback);
            return this;
        }
    }
}
// 最长递增子序列
{
    var lengthOfLIS = function (nums) {
        let n = nums.length;
        if (n <= 1) {
            return n;
        }
        let tails = [];
        for (let num of nums) {
            if (num > tails[tails.length - 1]) {
                tails.push(num);
            } else {
                let left = 0, right = tails.length - 1;
                while (left < right) {
                   const mid = Math.floor((left + right) / 2);
                   if (mid < num) {
                    left = mid + 1;
                   } else {
                    right = mid;
                   }
                }
                tails[left] = num;
            }
        }
    }
}