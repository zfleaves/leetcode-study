import {
    popTarget,
    pushTarget
} from "./Dep";

/**
 * 工具函数模块
 * 提供 Vue 响应式系统所需的各种工具函数
 */

// 检测是否支持 __proto__
const hasProto = '__proto__' in {};

/**
 * Vue 全局配置对象
 * 包含各种配置选项和开关
 */
const config = {
    /**
     * 选项合并策略（用于 core/util/options）
     */
    optionMergeStrategies: Object.create(null),

    /**
     * 是否抑制警告
     */
    silent: false,

    /**
     * 启动时显示生产模式提示
     */
    productionTip: true,

    /**
     * 是否启用 devtools
     */
    devtools: true,

    /**
     * 是否记录性能
     */
    performance: false,

    /**
     * Watcher 错误处理器
     */
    errorHandler: null,

    /**
     * Watcher 警告处理器
     */
    warnHandler: null,

    /**
     * 忽略某些自定义元素
     */
    ignoredElements: [],

    /**
     * v-on 的自定义用户键别名
     */
    keyCodes: Object.create(null),

    /**
     * 检查标签是否保留（不能注册为组件）
     * 平台相关，可能被覆盖
     */
    isReservedTag: no,

    /**
     * 检查属性是否保留（不能用作组件 prop）
     * 平台相关，可能被覆盖
     */
    isReservedAttr: no,

    /**
     * 检查标签是否是未知元素
     * 平台相关
     */
    isUnknownElement: no,

    /**
     * 获取元素的命名空间
     */
    getTagNamespace: noop,

    /**
     * 解析特定平台的真实标签名
     */
    parsePlatformTagName: identity,

    /**
     * 检查属性是否必须使用属性绑定（如 value）
     * 平台相关
     */
    mustUseProp: no,

    /**
     * 异步执行更新
     * 用于 Vue Test Utils，如果设置为 false 会显著降低性能
     */
    async: true,

    /**
     * 暴露用于遗留原因
     */
    _lifecycleHooks: LIFECYCLE_HOOKS
};

// Unicode 字符范围（用于解析路径）
const unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;

/**
 * 路径解析正则表达式
 * 用于检测非法字符
 */
const bailRE = new RegExp(`[^${unicodeRegExp.source}.$_\\d]`);

/**
 * 已遍历对象的集合
 * 用于 traverse 函数，避免循环引用
 */
const seenObjects = new Set();

/**
 * isObject - 检查是否是对象
 * @param {*} obj - 要检查的值
 * @returns {Boolean}
 */
function isObject(obj) {
    return obj !== null && typeof obj === 'object';
}

/**
 * isPromise - 检查是否是 Promise
 * @param {*} val - 要检查的值
 * @returns {Boolean}
 */
function isPromise(val) {
    return (isDef(val) &&
        typeof val.then === 'function' &&
        typeof val.catch === 'function');
}

/**
 * parsePath - 解析路径
 * 将字符串路径（如 'user.name'）转换为函数
 *
 * @param {String} path - 路径字符串
 * @returns {Function|undefined} - 路径解析函数
 */
function parsePath(path) {
    // 如果路径包含非法字符，返回 undefined
    if (bailRE.test(path)) {
        return;
    }

    // 按点分割路径
    const segments = path.split('.');

    // 返回一个函数，该函数从对象中获取路径对应的值
    return function (obj) {
        for (let i = 0; i < segments.length; i++) {
            if (!obj)
                return;
            obj = obj[segments[i]];
        }
        return obj;
    };
}

/**
 * hasOwn - 检查对象是否拥有指定属性
 * @param {Object} obj - 对象
 * @param {String} key - 属性名
 * @returns {Boolean}
 */
function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key);
}

/**
 * def - 在对象上定义属性
 * 使用 Object.defineProperty 的便捷方法
 *
 * @param {Object} obj - 目标对象
 * @param {String} key - 属性名
 * @param {*} val - 属性值
 * @param {Boolean} enumerable - 是否可枚举
 */
function def(obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true
    });
}

/**
 * traverse - 递归遍历对象
 * 用于深度监听，触发对象所有属性的 getter
 *
 * @param {*} val - 要遍历的值
 * @returns {*} - 原值
 */
function traverse(val) {
    _traverse(val, seenObjects);
    seenObjects.clear();
    return val;
}

/**
 * _traverse - 递归遍历对象的内部实现
 *
 * @param {*} val - 要遍历的值
 * @param {Set} seen - 已遍历对象的集合
 */
function _traverse(val, seen) {
    let i, keys;
    const isA = isArray(val);

    // 如果不是对象/数组，或者是特殊对象，直接返回
    if ((!isA && !isObject(val)) ||
        val.__v_skip /* ReactiveFlags.SKIP */ ||
        Object.isFrozen(val) ||
        val instanceof VNode) {
        return;
    }

    // 如果对象有 __ob__，检查是否已遍历过
    if (val.__ob__) {
        const depId = val.__ob__.dep.id;
        if (seen.has(depId)) {
            return;
        }
        seen.add(depId);
    }

    // 数组：递归遍历每个元素
    if (isA) {
        i = val.length;
        while (i--)
            _traverse(val[i], seen);
    } else if (isRef(val)) {
        // Ref：遍历其值
        _traverse(val.value, seen);
    } else {
        // 对象：递归遍历每个属性
        keys = Object.keys(val);
        i = keys.length;
        while (i--)
            _traverse(val[keys[i]], seen);
    }
}

/**
 * invokeWithErrorHandling - 带错误处理的函数调用
 *
 * @param {Function} handler - 要调用的函数
 * @param {*} context - 函数上下文
 * @param {Array} args - 参数数组
 * @param {Vue} vm - Vue 实例
 * @param {String} info - 错误信息
 * @returns {*} - 函数返回值
 */
function invokeWithErrorHandling(handler, context, args, vm, info) {
    let res;
    try {
        // 调用函数
        res = args ? handler.apply(context, args) : handler.call(context);

        // 如果返回值是 Promise，处理其错误
        if (res && !res._isVue && isPromise(res) && !res._handled) {
            res.catch(e => handleError(e, vm, info + ` (Promise/async)`));
            res._handled = true;
        }
    } catch (e) {
        // 捕获错误并处理
        handleError(e, vm, info);
    }
    return res;
}

/**
 * handleError - 处理错误
 *
 * @param {Error} err - 错误对象
 * @param {Vue} vm - Vue 实例
 * @param {String} info - 错误信息
 */
function handleError(err, vm, info) {
    // 在处理错误处理器时禁用依赖收集，避免可能的无限渲染
    // 参考：https://github.com/vuejs/vuex/issues/1505
    pushTarget();

    try {
        if (vm) {
            // 向上查找父组件的 errorCaptured 钩子
            let cur = vm;
            while ((cur = cur.$parent)) {
                const hooks = cur.$options.errorCaptured;
                if (hooks) {
                    for (let i = 0; i < hooks.length; i++) {
                        try {
                            // 调用 errorCaptured 钩子
                            const capture = hooks[i].call(cur, err, vm, info) === false;
                            // 如果返回 false，停止向上传播
                            if (capture)
                                return;
                        } catch (e) {
                            globalHandleError(e, cur, 'errorCaptured hook');
                        }
                    }
                }
            }
        }
        // 如果没有捕获错误，使用全局错误处理器
        globalHandleError(err, vm, info);
    } finally {
        popTarget();
    }
}

/**
 * globalHandleError - 全局错误处理
 *
 * @param {Error} err - 错误对象
 * @param {Vue} vm - Vue 实例
 * @param {String} info - 错误信息
 */
function globalHandleError(err, vm, info) {
    // 如果配置了全局错误处理器，使用它
    if (config.errorHandler) {
        try {
            return config.errorHandler.call(null, err, vm, info);
        } catch (e) {
            // 如果用户在处理器中抛出原始错误，不要记录两次
            if (e !== err) {
                logError(e, null, 'config.errorHandler');
            }
        }
    }
    // 默认：记录错误
    logError(err, vm, info);
}

/**
 * logError - 记录错误
 *
 * @param {Error} err - 错误对象
 * @param {Vue} vm - Vue 实例
 * @param {String} info - 错误信息
 */
function logError(err, vm, info) {
    {
        warn$2(`Error in ${info}: "${err.toString()}"`, vm);
    }
    /* istanbul ignore else */
    if (inBrowser && typeof console !== 'undefined') {
        console.error(err);
    } else {
        throw err;
    }
}

/**
 * noop - 空函数
 * @param {*} a
 * @param {*} b
 * @param {*} c
 */
function noop(a, b, c) {}

/**
 * identity - 恒等函数
 * @param {*} _ - 输入值
 * @returns {*} - 返回输入值
 */
function identity(_) {
    return _;
}

/**
 * no - 总是返回 false
 * @returns {Boolean}
 */
function no() {
    return false;
}

/**
 * isDef - 检查值是否已定义
 * @param {*} v - 要检查的值
 * @returns {Boolean}
 */
function isDef(v) {
    return v !== undefined && v !== null;
}

/**
 * isReserved - 检查字符串是否是保留字
 * @param {String} str - 字符串
 * @returns {Boolean}
 */
function isReserved(str) {
    const c = (str + '').charCodeAt(0);
    return c === 0x24 || c === 0x5F; // $ 或 _
}

/**
 * isPlainObject - 检查是否是纯对象
 * @param {*} obj - 要检查的值
 * @returns {Boolean}
 */
function isPlainObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}

/**
 * isArray - 检查是否是数组
 * @param {*} arr - 要检查的值
 * @returns {Boolean}
 */
function isArray(arr) {
    return Array.isArray(arr);
}

/**
 * isRef - 检查是否是 Ref
 * @param {*} val - 要检查的值
 * @returns {Boolean}
 */
function isRef(val) {
    return val && val.__v_isRef === true;
}

/**
 * remove - 从数组中移除元素
 * @param {Array} arr - 数组
 * @param {*} item - 要移除的元素
 */
function remove(arr, item) {
    if (!arr.length) return;
    const index = arr.indexOf(item);
    if (index > -1) {
        return arr.splice(index, 1);
    }
}

/**
 * inBrowser - 检查是否在浏览器环境
 */
const inBrowser = typeof window !== 'undefined';

/**
 * LIFECYCLE_HOOKS - 生命周期钩子名称列表
 */
const LIFECYCLE_HOOKS = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed',
    'activated',
    'deactivated',
    'errorCaptured',
    'serverPrefetch'
];

/**
 * shouldObserve - 是否应该观察
 * 全局开关，用于控制是否启用响应式
 */
let shouldObserve = true;

/**
 * toggleObserving - 切换观察状态
 * @param {Boolean} value - 是否启用观察
 */
function toggleObserving(value) {
    shouldObserve = value;
}

/**
 * isServerRendering - 检查是否是服务端渲染
 * @returns {Boolean}
 */
function isServerRendering() {
    return false;
}

/**
 * VNode - 虚拟节点类
 */
class VNode {
    constructor(
        tag,
        data,
        children,
        text,
        elm,
        context,
        componentOptions,
        asyncFactory
    ) {
        this.tag = tag;
        this.data = data;
        this.children = children;
        this.text = text;
        this.elm = elm;
        this.ns = undefined;
        this.context = context;
        this.functionalContext = undefined;
        this.key = data && data.key;
        this.componentOptions = componentOptions;
        this.componentInstance = undefined;
        this.parent = undefined;
        this.raw = false;
        this.isStatic = false;
        this.isRootInsert = true;
        this.isComment = false;
        this.isCloned = false;
        this.isOnce = false;
        this.asyncFactory = asyncFactory;
        this.asyncMeta = undefined;
        this.isAsyncPlaceholder = false;
    }
}

export {
    config,
    def,
    bailRE,
    hasOwn,
    hasProto,
    noop,
    parsePath,
    isObject,
    traverse,
    invokeWithErrorHandling,
    toggleObserving,
    shouldObserve,
    isServerRendering,
    isReserved,
    isPlainObject,
    isArray,
    isRef,
    remove,
    VNode
}