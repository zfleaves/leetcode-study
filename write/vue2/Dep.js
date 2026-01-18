import {
    config
} from './tool.js';

/**
 * Dep - 依赖收集器
 *
 * Dep 是 Vue 响应式系统的核心类之一，负责管理依赖关系。
 * 每个 Observer 实例都会创建一个 Dep 实例，用于收集该数据被哪些 Watcher 订阅。
 * 当数据发生变化时，Dep 会通知所有订阅的 Watcher 进行更新。
 *
 * 核心概念：
 * - Dep.target: 全局静态变量，指向当前正在执行的 Watcher
 * - subs: 订阅者数组，存储所有订阅该 Dep 的 Watcher 实例
 * - depend(): 依赖收集，在 getter 中调用，将当前 Watcher 添加到 subs
 * - notify(): 派发更新，在 setter 中调用，通知所有订阅者更新
 */

// 全局唯一 ID 计数器，用于给每个 Dep 实例分配唯一标识
let uid = 0;

class Dep {
    constructor() {
        this.id = uid++; // 分配唯一 ID，用于去重和排序
        this.subs = []; // 存储订阅者（Watcher 实例）
    }

    /**
     * 添加订阅者
     * @param {Watcher} sub - 要添加的 Watcher 实例
     */
    addSub(sub) {
        this.subs.push(sub);
    }

    /**
     * 删除订阅者
     * @param {Watcher} sub - 要删除的 Watcher 实例
     */
    removeSub(sub) {
        // 将订阅者置为 null 而不是直接删除，避免在遍历时出现问题
        // 在 notify 时会过滤掉 null 值
        this.subs[this.subs.indexOf(sub)] = null;
    }

    /**
     * 依赖收集
     * 在数据被读取（getter）时调用，将当前 Watcher 添加到订阅列表
     *
     * @param {Object} info - 调试信息，包含目标对象、操作类型、键名等
     */
    depend(info) {
        // Dep.target 指向当前正在执行的 Watcher（通过 pushTarget 设置）
        if (Dep.target) {
            // 让 Watcher 记录这个 Dep（双向绑定）
            Dep.target.addDep(this);

            // 如果有调试信息且 Watcher 支持追踪，则触发追踪回调
            if (info && Dep.target.onTrack) {
                Dep.target.onTrack(Object.assign({
                    effect: Dep.target
                }, info));
            }
        }
    }

    /**
     * 派发更新
     * 在数据被修改（setter）时调用，通知所有订阅者进行更新
     */
    notify() {
        // 过滤掉 null 值（已被删除的订阅者）
        const subs = this.subs.filter(s => s);

        // 如果不是异步模式，对订阅者进行稳定排序
        // 确保 Watcher 的执行顺序与创建顺序一致（父组件先于子组件）
        if (!config.async) {
            subs.sort((a, b) => a.id - b.id);
        }

        // 遍历所有订阅者，触发更新
        for (let i = 0, l = subs.length; i < l; i++) {
            subs[i].update();
        }
    }
}

/**
 * Dep.target - 全局静态变量
 * 指向当前正在执行的 Watcher
 * 在 Watcher.get() 执行前通过 pushTarget() 设置
 * 在 Watcher.get() 执行后通过 popTarget() 恢复
 */
Dep.target = null;

/**
 * 目标栈
 * 用于嵌套 Watcher 场景（如 computed 中使用另一个 computed）
 * 保存多层 Watcher 调用栈，确保依赖收集的正确性
 */
const targetStack = [];

/**
 * pushTarget - 压入目标
 * 在执行 Watcher.get() 之前调用，将当前 Watcher 设置为全局目标
 *
 * @param {Watcher} target - 要设置为目标的 Watcher 实例
 */
function pushTarget(target) {
  targetStack.push(target);
  Dep.target = target;
}

/**
 * popTarget - 弹出目标
 * 在执行 Watcher.get() 之后调用，恢复上一个 Watcher
 */
function popTarget() {
  targetStack.pop();
  Dep.target = targetStack[targetStack.length - 1];
}

// 导出 Dep 和辅助函数
export {
    Dep,
    pushTarget,
    popTarget
}