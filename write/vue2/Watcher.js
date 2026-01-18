/*
 * @Date: 2026-01-17 18:27:14
 * @LastEditors: zhangming 1051403128@qq.com
 * @LastEditTime: 2026-01-17 20:34:40
 * @FilePath: \leetcode-study\write\vue2\Watcher.js
 */

/**
 * Watcher - 订阅者类
 *
 * Watcher 是 Vue 响应式系统的核心类之一，负责订阅数据变化并执行更新。
 * 每个 Watcher 实例都会订阅一个或多个 Dep，当 Dep 中的数据变化时，
 * Watcher 会收到通知并执行相应的更新操作。
 *
 * Watcher 的类型：
 * - 渲染 Watcher: 监听组件的渲染函数，数据变化时重新渲染
 * - 用户 Watcher: 用户通过 $watch 创建的侦听器
 * - 计算 Watcher: 计算属性，惰性求值，只有被使用时才会计算
 *
 * 核心功能：
 * - get(): 执行 getter 函数，触发依赖收集
 * - update(): 收到 Dep 通知后，调度更新
 * - run(): 实际执行更新操作
 * - addDep(): 添加依赖关系
 * - cleanupDeps(): 清理不再需要的依赖
 */

import {
    popTarget,
    pushTarget
} from "./Dep";
import {
    traverse
} from "./tool";

// 全局唯一 ID 计数器
let uid = 0;

// 调度队列相关变量
const queue = []; // Watcher 队列
let has = {}; // 用于去重，记录已加入队列的 Watcher ID
let waiting = false; // 是否正在等待刷新队列
let flushing = false; // 是否正在刷新队列
let index$1 = 0; // 当前刷新到的索引

class Watcher {
    /**
     * 构造函数
     * @param {Vue} vm - Vue 实例
     * @param {String|Function} expOrFn - 表达式或函数（getter）
     * @param {Function} cb - 回调函数
     * @param {Object} options - 配置选项
     * @param {Boolean} isRenderWatcher - 是否是渲染 Watcher
     */
    constructor(vm, expOrFn, cb, options, isRenderWatcher) {
        this.vm = vm;

        // 如果是渲染 watcher，添加到 vm._watcher
        if (isRenderWatcher) {
            vm._watcher = this;
        }

        // 添加到 vm._watchers 数组
        vm._watchers.push(this);

        // 处理配置选项
        if (options) {
            this.deep = !!options.deep; // 深度监听
            this.user = !!options.user; // 用户创建的侦听器
            this.lazy = !!options.lazy; // 惰性求值（计算属性）
            this.sync = !!options.sync; // 同步更新
            this.before = options.before; // 更新前的钩子
        } else {
            this.deep = this.user = this.lazy = this.sync = false;
        }

        this.cb = cb; // 回调函数
        this.id = ++uid; // 唯一 ID
        this.active = true; // 是否激活
        this.dirty = this.lazy; // 是否需要重新计算（用于计算属性）
        this.deps = []; // 依赖的 Dep 数组
        this.newDeps = []; // 新收集的 Dep 数组
        this.depIds = new Set(); // 依赖的 Dep ID 集合
        this.newDepIds = new Set(); // 新收集的 Dep ID 集合
        this.expression = expOrFn.toString(); // 表达式字符串

        // 解析 getter 函数
        if (typeof expOrFn === 'function') {
            // 如果是函数，直接作为 getter
            this.getter = expOrFn;
        } else {
            // 如果是字符串表达式，解析为函数
            this.getter = parsePath(expOrFn);
        }

        // 如果不是惰性的，立即求值
        this.value = this.lazy ? undefined : this.get();
    }

    /**
     * get - 执行 getter，触发依赖收集
     *
     * 流程：
     * 1. 设置 Dep.target 为当前 Watcher
     * 2. 执行 getter 函数
     * 3. getter 中访问数据，触发数据 getter，执行 dep.depend()
     * 4. dep.depend() 将当前 Watcher 添加到 dep.subs
     * 5. 恢复 Dep.target
     * 6. 清理不再需要的依赖
     *
     * @returns {*} getter 的返回值
     */
    get() {
        // 🔴 设置 Dep.target 为当前 Watcher
        pushTarget(this);

        let value;
        const vm = this.vm;

        try {
            // 🔴 执行 getter，触发依赖收集
            // 在 getter 中访问的数据会触发其 getter，进而调用 dep.depend()
            value = this.getter.call(vm, vm);
        } catch (error) {
            // 错误处理
            if (this.user) {
                handleError(e, vm, `getter for watcher "${this.expression}"`);
            } else {
                throw e;
            }
        } finally {
            // 如果是深度监听，递归遍历值，触发深层依赖收集
            if (this.deep) {
                traverse(value);
            }
        }

        // 🔴 清理依赖
        popTarget();
        this.cleanupDeps();

        return value;
    }

    /**
     * addDep - 添加依赖
     * 被 Dep.depend() 调用，建立 Watcher 和 Dep 的双向绑定
     *
     * @param {Dep} dep - Dep 实例
     */
    addDep(dep) {
        const id = dep.id;

        // 如果这个 Dep 还没有被当前 Watcher 收集过
        if (!this.newDepIds.has(id)) {
            // 添加到新依赖集合
            this.newDepIds.add(id);
            this.newDeps.push(dep);

            // 如果这个 Dep 不在旧依赖集合中，添加 Watcher 到 Dep
            if (!this.depIds.has(id)) {
                dep.addSub(this);
            }
        }
    }

    /**
     * cleanupDeps - 清理依赖
     * 移除不再需要的依赖，避免内存泄漏
     */
    cleanupDeps() {
        let i = this.deps.length;
        while (i--) {
            const dep = this.deps[i];
            // 如果旧依赖不在新依赖中，从 Dep 中移除当前 Watcher
            if (!this.newDepIds.has(dep.id)) {
                dep.removeSub(this);
            }
        }

        // 交换新旧依赖集合
        let tmp = this.depIds;
        this.depIds = this.newDepIds;
        this.newDepIds = tmp;
        this.newDepIds.clear();

        tmp = this.deps;
        this.deps = this.newDeps;
        this.newDeps = tmp;
        this.newDeps.length = 0;
    }

    /**
     * update - 收到 Dep 通知后的更新入口
     * 根据 Watcher 的类型和配置，决定如何处理更新
     */
    update() {
        if (this.lazy) {
            // 惰性 Watcher（计算属性）：标记为脏，等待 get 时重新计算
            this.dirty = true;
        } else if (this.sync) {
            // 同步 Watcher：立即执行
            this.run();
        } else {
            // 普通 Watcher：加入队列，异步执行
            queueWatcher(this);
        }
    }

    /**
     * run - 实际执行更新操作
     */
    run() {
        if (this.active) {
            // 重新求值
            const value = this.get();

            // 如果值变化了，或者是对象/数组，或者是深度监听
            if (
                value !== this.value ||
                isObject(value) ||
                this.deep
            ) {
                const oldValue = this.value;
                this.value = value;

                // 执行回调
                if (this.user) {
                    // 用户 Watcher：带错误处理
                    const info = `callback for watcher "${this.expression}"`;
                    invokeWithErrorHandling(this.cb, this.vm, [value, oldValue], this.vm, info);
                } else {
                    // 渲染 Watcher：直接调用
                    this.cb.call(this.vm, value, oldValue);
                }
            }
        }
    }

    /**
     * evaluate - 求值（用于计算属性）
     * 重新计算并标记为干净
     */
    evaluate() {
        this.value = this.get();
        this.dirty = false;
    }

    /**
     * depend - 添加依赖（用于计算属性）
     * 让计算属性的 Watcher 依赖内部数据的 Dep
     */
    depend() {
        let i = this.deps.length;
        while (i--) {
            this.deps[i].depend();
        }
    }

    /**
     * teardown - 停止监听
     * 从所有 Dep 中移除当前 Watcher
     */
    teardown() {
        if (this.active) {
            remove(this.vm._watchers, this);
            let i = this.deps.length;
            while (i--) {
                this.deps[i].removeSub(this);
            }
            this.active = false;
        }
    }
}

/**
 * queueWatcher - 将 Watcher 加入调度队列
 * 实现异步批处理更新，避免频繁渲染
 *
 * @param {Watcher} watcher - 要加入队列的 Watcher
 */
function queueWatcher(watcher) {
    const id = watcher.id;

    // 去重：如果已经在队列中，直接返回
    if (has[id] != null) {
        return;
    }

    // 如果 Watcher 正在执行且不允许递归，直接返回
    if (watcher === Dep.target && watcher.noRecurse) {
        return;
    }

    // 标记已加入队列
    has[id] = true;

    if (!flushing) {
        // 如果没有正在刷新队列，直接加入队列
        queue.push(watcher);
    } else {
        // 如果正在刷新队列，根据 ID 插入到正确位置
        let i = queue.length - 1;
        while (i > index$1 && queue[i].id > watcher.id) {
            i--;
        }
        queue.splice(i + 1, 0, watcher);
    }

    // 如果还没有等待刷新，设置等待状态
    if (!waiting) {
        waiting = true;

        if (!config.async) {
            // 同步模式：立即刷新
            flushSchedulerQueue();
            return;
        }

        // 异步模式：在下一个 tick 刷新
        nextTick(flushSchedulerQueue);
    }
}

/**
 * flushSchedulerQueue - 刷新调度队列
 * 批量执行所有 Watcher 的更新
 */
function flushSchedulerQueue() {
    flushing = true;
    let watcher, id;

    // 按 ID 从小到大排序
    // 确保：1. 父组件先于子组件更新；2. 用户 Watcher 先于渲染 Watcher；3. 同一组件的 Watcher 按创建顺序执行
    queue.sort((a, b) => a.id - b.id);

    // 遍历执行所有 Watcher
    for (index = 0; index < queue.length; index++) {
        watcher = queue[index];
        id = watcher.id;
        has[id] = null;

        // 执行 before 钩子（beforeUpdate）
        if (watcher.before) {
            watcher.before();
        }

        // 执行更新
        watcher.run();
    }

    // 重置状态
    resetSchedulerState();
}

/**
 * resetSchedulerState - 重置调度队列状态
 */
function resetSchedulerState() {
    index = queue.length = 0;
    has = {};
    waiting = flushing = false;
}

export {
    queueWatcher,
    resetSchedulerState,
    Watcher
}