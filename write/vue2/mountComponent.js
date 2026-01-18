import {
    Watcher
} from "./Watcher";
import {
    noop,
    invokeWithErrorHandling,
} from "./tool";
import {
    pushTarget,
    popTarget
} from "./Dep";

/**
 * 当前 Vue 实例
 * 用于在生命周期钩子中访问当前实例
 */
let currentInstance = null;

/**
 * callHook - 调用生命周期钩子
 *
 * @param {Vue} vm - Vue 实例
 * @param {String} hook - 钩子名称（如 'beforeCreate', 'mounted'）
 * @param {Array} args - 传递给钩子的参数
 * @param {Boolean} setContext - 是否设置当前实例上下文
 */
function callHook(vm, hook, args, setContext = true) {
    // #7573 在调用生命周期钩子时禁用依赖收集
    // 避免在钩子中访问数据时产生不必要的依赖
    pushTarget();

    const prev = currentInstance;

    // 设置当前实例上下文
    setContext && setCurrentInstance(vm);

    // 获取钩子函数数组（支持多个同名钩子）
    const handlers = vm.$options[hook];
    const info = `${hook} hook`;

    // 执行所有钩子函数
    if (handlers) {
        for (let i = 0, j = handlers.length; i < j; i++) {
            invokeWithErrorHandling(handlers[i], vm, args || null, vm, info);
        }
    }

    // 如果有钩子事件，触发事件
    if (vm._hasHookEvent) {
        vm.$emit('hook:' + hook);
    }

    // 恢复上一个实例上下文
    setContext && setCurrentInstance(prev);

    // 恢复依赖收集
    popTarget();
}

/**
 * mountComponent - 挂载组件
 *
 * 将 Vue 实例挂载到 DOM 上，创建渲染 Watcher，建立响应式连接
 *
 * @param {Vue} vm - Vue 实例
 * @param {HTMLElement} el - 挂载的 DOM 元素
 * @param {Boolean} hydrating - 是否是服务端渲染的激活
 * @returns {Vue} - Vue 实例
 */
function mountComponent(vm, elm, hydrating) {
    // 保存挂载的 DOM 元素
    vm.$el = el;

    // 🔴 调用 beforeMount 钩子
    // 在挂载开始前调用，此时 DOM 还未创建
    callHook(vm, 'beforeMount');

    // 定义更新组件的函数
    // 这个函数会被渲染 Watcher 调用
    updateComponent = () => {
        // vm._render() - 执行渲染函数，生成虚拟 DOM (VNode)
        // vm._update() - 将虚拟 DOM 更新到真实 DOM
        vm._update(vm._render(), hydrating);
    };

    // 🔴 创建渲染 Watcher
    // 这是响应式系统的关键：创建一个 Watcher 来监听渲染函数
    // 当渲染函数中访问的数据变化时，Watcher 会重新执行 updateComponent
    new Watcher(vm, updateComponent, noop, {
        // before 钩子：在每次更新前调用
        before() {
            // 如果已经挂载且未销毁，调用 beforeUpdate 钩子
            if (vm._isMounted && !vm._isDestroyed) {
                callHook(vm, 'beforeUpdate');
            }
        }
    }, true /* isRenderWatcher */ );

    // 标记非服务端渲染
    hydrating = false;

    // 如果没有父 VNode，说明是根组件或首次挂载
    if (vm.$vnode == null) {
        // 标记为已挂载
        vm._isMounted = true;

        // 🔴 调用 mounted 钩子
        // 在挂载完成后调用，此时 DOM 已创建并插入页面
        callHook(vm, 'mounted');
    }

    return vm;
}

/**
 * setCurrentInstance - 设置当前实例
 * 用于在生命周期钩子中访问当前实例
 *
 * @param {Vue} vm - Vue 实例
 */
function setCurrentInstance(vm) {
    currentInstance = vm;
}

export {
    mountComponent,
    callHook,
}