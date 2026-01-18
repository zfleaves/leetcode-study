import {
    def,
    hasOwn,
    hasProto
} from './tool.js';
import Dep from './Dep.js';

/**
 * Observer - 数据劫持类
 *
 * Observer 是 Vue 响应式系统的核心类，负责将普通对象转换为响应式对象。
 * 通过 Object.defineProperty 为对象的每个属性添加 getter/setter，
 * 在 getter 中收集依赖，在 setter 中触发更新。
 *
 * 核心功能：
 * - 为对象添加 __ob__ 属性，指向 Observer 实例
 * - 递归遍历对象，为每个属性添加 getter/setter
 * - 对数组进行特殊处理，重写数组的变异方法（push、pop 等）
 * - 为每个对象创建一个 Dep 实例，用于收集该对象的整体依赖
 */

class Observer {
    /**
     * 构造函数
     * @param {Object|Array} value - 要观察的对象或数组
     * @param {Boolean} shallow - 是否浅观察（不递归观察子属性）
     */
    constructor(value, shallow = false) {
        this.value = value; // 保存被观察的值
        this.shallow = shallow; // 是否浅观察
        this.deep = new Dep(); // 为每个对象添加一个 dep，用于收集对象级别的依赖

        // 在对象上添加 __ob__ 属性，指向 Observer 实例
        // 这样可以判断一个对象是否已经被观察过
        def(value, '__ob__', this);

        // 数组需要特殊处理
        if (isArray(value)) {
            // 如果支持 __proto__，直接修改原型链
            if (hasProto) {
                value.__proto__ = arrayMethods;
            } else {
                // 否则手动重写数组方法
                for (let i = 0, l = arrayKeys.length; i < l; i++) {
                    const key = arrayKeys[i];
                    def(value, key, arrayMethods[key]);
                }
            }
            // 如果不是浅观察，递归观察数组的每个元素
            if (!shallow) {
                this.observeArray(value);
            }
        } else {
            // 对象：遍历所有属性，添加 getter/setter
            this.walk(value);
        }
    }

    /**
     * 遍历对象，为每个属性添加响应式
     * @param {Object} obj - 要遍历的对象
     */
    walk(obj) {
        const keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
            defineReactive(obj, keys[i]);
        }
    }

    /**
     * 观察数组的每个元素
     * @param {Array} items - 数组元素
     */
    observeArray(items) {
        for (let i = 0, l = items.length; i < l; i++) {
            observe(items[i]);
        }
    }
}

/**
 * observe - 观察函数
 * 创建 Observer 实例的入口函数
 *
 * @param {Object|Array} value - 要观察的值
 * @param {Boolean} asRootData - 是否是根数据（Vue 实例的 data）
 * @returns {Observer|undefined} - Observer 实例或 undefined
 */
function observe(value, asRootData) {
    // 如果不是对象或者是 VNode，直接返回
    if (!isObject(value) || value instanceof VNode) {
        return;
    }

    let ob;
    // 如果已经被观察过，直接返回已有的 Observer 实例
    if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
        ob = value.__ob__;
    } else if (
        shouldObserve && // 全局开关，允许观察
        !isServerRendering() && // 不是服务端渲染
        (Array.isArray(value) || isPlainObject(value)) && // 是数组或纯对象
        Object.isExtensible(value) && // 对象可扩展
        !value._isVue // 不是 Vue 实例
    ) {
        // 创建新的 Observer 实例
        ob = new Observer(value);
    }

    // 如果是根数据，增加 vmCount（用于统计有多少个 Vue 实例使用了这个数据）
    if (asRootData && ob) {
        ob.vmCount++;
    }

    return ob;
}

/**
 * defineReactive - 定义响应式属性
 * 为对象的属性添加 getter/setter，实现数据劫持
 *
 * @param {Object} obj - 目标对象
 * @param {String} key - 属性名
 * @param {*} val - 属性值（可选）
 * @param {Function} customSetter - 自定义 setter（可选）
 * @param {Boolean} shallow - 是否浅观察
 */
function defineReactive(obj, key, val, customSetter, shallow) {
    // 为每个属性创建一个依赖收集器
    const dep = new Dep();

    // 获取属性描述符
    const property = Object.getOwnPropertyDescriptor(obj, key);
    if (property && property.configurable === false) {
        // 如果属性不可配置，无法添加 getter/setter，直接返回
        return;
    }

    // 保存原有的 getter/setter
    const getter = property && property.get;
    const setter = property && property.set;

    // 如果没有传入 val，从对象中获取
    if ((!getter || setter) && arguments.length === 2) {
        val = obj[key];
    }

    // 递归观察子属性，返回子属性的 Observer 实例
    let childOb = !shallow && observe(val);

    // 使用 Object.defineProperty 定义属性
    Object.defineProperty(obj, key, {
        enumerable: true, // 可枚举
        configurable: true, // 可配置
        get() {
            // 获取属性值
            const value = getter ? getter.call(obj) : val;

            // 🔴 依赖收集：当属性被读取时，将当前 Watcher 添加到 dep.subs
            {
                dep.depend({
                    target: obj,
                    type: "get" /* TrackOpTypes.GET */,
                    key
                });
            }

            // 如果子属性也被观察过，收集子属性的依赖
            if (childOb) {
                childOb.dep.depend();
                // 如果是数组，递归收集数组元素的依赖
                if (isArray(value)) {
                    dependArray(value);
                }
            }

            return value;
        },
        set(newVal) {
            // 获取旧值
            const value = getter ? getter.call(obj) : val;

            // 值未变化（包括 NaN 比较），直接返回
            if (newVal === value || (newVal !== newVal && value !== value)) {
                return;
            }

            // 如果没有 setter，直接返回
            if (getter && !setter) return;

            // 如果有自定义 setter，调用它
            if (setter) {
                setter.call(obj, newVal);
            } else {
                // 否则直接赋值
                val = newVal;
            }

            // 递归观察新值
            childOb = !shallow && observe(newVal);

            // 🔴 触发更新：通知所有订阅者
            dep.notify();
        }
    });
}

/**
 * 数组方法重写
 * 为了监听数组的变化，需要重写数组的变异方法
 * 这些方法在调用时会触发更新
 */

const arrayProto = Array.prototype; // 保存数组原型
const arrayMethods = Object.create(arrayProto); // 创建新原型对象

// 需要重写的数组方法（变异方法）
const methodsToPatch = [
    'push',    // 在末尾添加元素
    'pop',     // 删除末尾元素
    'shift',   // 删除开头元素
    'unshift', // 在开头添加元素
    'splice',  // 删除/插入元素
    'sort',    // 排序
    'reverse'  // 反转
];

// 遍历需要重写的方法
methodsToPatch.forEach(method => {
    // 保存原始方法
    const original = arrayProto[method];

    // 重写方法
    def(arrayMethods, method, function mutator(...args) {
        // 调用原始方法，获取结果
        const result = original.apply(this, args);

        // 获取数组的 Observer 实例
        const ob = this.__ob__;
        let inserted;

        // 根据方法类型，判断是否有新增元素
        switch (method) {
            case 'push':
            case 'unshift':
                // 这两个方法会添加元素
                inserted = args;
                break;
            case 'splice':
                // splice 从第三个参数开始是新增元素
                inserted = args.slice(2);
                break;
        }

        // 如果有新增元素，观察它们
        if (inserted) {
            ob.observeArray(inserted);
        }

        // 🔴 触发更新：通知所有订阅者
        ob.dep.notify();

        // 返回原始方法的结果
        return result;
    });
});

/**
 * dependArray - 递归收集数组依赖
 * 用于在读取数组时，递归收集数组元素的依赖
 *
 * @param {Array} value - 数组
 */
function dependArray(value) {
    for (let e, i = 0, l = value.length; i < l; i++) {
        e = value[i];
        // 如果元素有 __ob__ 属性，收集其依赖
        e && e.__ob__ && e.__ob__.dep.depend();
        // 如果元素是数组，递归处理
        if (Array.isArray(e)) {
            dependArray(e);
        }
    }
}